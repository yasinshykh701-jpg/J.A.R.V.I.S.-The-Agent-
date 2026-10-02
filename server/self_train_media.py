"""
Self-training media pipeline.

Flow:
  1. Prefer Kling API (best cloud video) when KLING_ACCESS_KEY + KLING_SECRET_KEY are set.
  2. On API-key / balance / quota errors → local image/video models + RAG notes.
  3. Successful cloud outputs are downloaded into training folders so local models
     can learn from them (self-train data loop).
"""
from __future__ import annotations

import base64
import csv
import hashlib
import hmac
import json
import os
import re
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from workspace_paths import get_app_root, module_paths


def _load_dotenv() -> None:
    """Load key=value pairs from app .env into os.environ (does not override existing)."""
    env_path = get_app_root() / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        text = line.strip()
        if not text or text.startswith("#") or "=" not in text:
            continue
        key, _, value = text.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


_load_dotenv()

KLING_BASE = os.environ.get("KLING_API_BASE", "https://api.klingai.com").rstrip("/")
BALANCE_OR_KEY_MARKERS = (
    "insufficient",
    "balance",
    "credit",
    "quota",
    "billing",
    "payment",
    "unauthorized",
    "invalid api",
    "invalid key",
    "api key",
    "access key",
    "forbidden",
    "401",
    "403",
    "authentication",
    "not enough",
    "exceed",
)


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _kling_jwt(access_key: str, secret_key: str) -> str:
    header = _b64url(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    now = int(time.time())
    payload = _b64url(
        json.dumps(
            {"iss": access_key, "exp": now + 1800, "nbf": now - 5},
            separators=(",", ":"),
        ).encode()
    )
    signing_input = f"{header}.{payload}".encode()
    sig = hmac.new(secret_key.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header}.{payload}.{_b64url(sig)}"


def _slug(text: str, limit: int = 48) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", (text or "media").strip().lower()).strip("-")
    return (cleaned or "media")[:limit]


def training_roots() -> dict[str, Path]:
    paths = module_paths()
    zev = paths["zevorix"]
    app = get_app_root()
    store = app / "server" / "training_store"
    video_dir = zev / "data" / "video_generation" / "training_videos"
    image_dir = zev / "data" / "image_generation" / "training_images"
    rag_dir = paths["jarvis_rag"] / "data" / "self_train"
    captions_csv = zev / "data" / "video_generation" / "video_captions.csv"
    image_captions = zev / "data" / "image_generation" / "captions.csv"
    for folder in (store, video_dir, image_dir, rag_dir, captions_csv.parent, image_captions.parent):
        folder.mkdir(parents=True, exist_ok=True)
    return {
        "store": store,
        "video_dir": video_dir,
        "image_dir": image_dir,
        "rag_dir": rag_dir,
        "video_captions": captions_csv,
        "image_captions": image_captions,
        "index": store / "media_index.jsonl",
    }


def is_balance_or_key_error(message: str, status: int | None = None) -> bool:
    if status in {401, 402, 403, 429}:
        return True
    lowered = (message or "").lower()
    return any(marker in lowered for marker in BALANCE_OR_KEY_MARKERS)


def _http_json(
    method: str,
    url: str,
    headers: dict[str, str],
    body: dict[str, Any] | None = None,
    timeout: float = 60.0,
) -> tuple[int, dict[str, Any]]:
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8") or "{}"
            payload = json.loads(raw)
            return resp.status, payload if isinstance(payload, dict) else {"data": payload}
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace") or "{}"
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            payload = {"message": raw}
        if not isinstance(payload, dict):
            payload = {"message": str(payload)}
        return exc.code, payload
    except Exception as exc:  # noqa: BLE001
        return 0, {"message": str(exc)}


def _append_csv(csv_path: Path, filename: str, caption: str) -> None:
    exists = csv_path.exists()
    with csv_path.open("a", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        if not exists:
            writer.writerow(["filename", "caption"])
        writer.writerow([filename, caption])


def _append_index(record: dict[str, Any]) -> None:
    roots = training_roots()
    with roots["index"].open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")


def _write_rag_note(prompt: str, meta: dict[str, Any]) -> Path:
    roots = training_roots()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = roots["rag_dir"] / f"media_{stamp}_{_slug(prompt)}.txt"
    lines = [
        f"Prompt: {prompt}",
        f"Source: {meta.get('source')}",
        f"Mode: {meta.get('mode')}",
        f"Created: {meta.get('created_at')}",
        f"Asset: {meta.get('local_path')}",
        f"Notes: {meta.get('notes', '')}",
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def store_training_asset(
    *,
    kind: str,
    prompt: str,
    source_bytes: bytes | None = None,
    source_url: str | None = None,
    extension: str,
    provider: str,
    extra: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Persist media into local training folders + RAG notes (self-train loop)."""
    roots = training_roots()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    digest = hashlib.sha1((prompt + stamp).encode("utf-8")).hexdigest()[:8]
    filename = f"{_slug(prompt)}-{digest}{extension}"
    target_dir = roots["video_dir"] if kind == "video" else roots["image_dir"]
    target = target_dir / filename

    payload = source_bytes
    if payload is None and source_url:
        req = urllib.request.Request(source_url, method="GET")
        with urllib.request.urlopen(req, timeout=120) as resp:
            payload = resp.read()
    if payload is None:
        raise ValueError("No media bytes to store")

    target.write_bytes(payload)
    if kind == "video":
        _append_csv(roots["video_captions"], filename, prompt)
    else:
        _append_csv(roots["image_captions"], filename, prompt)

    record = {
        "kind": kind,
        "prompt": prompt,
        "filename": filename,
        "local_path": str(target),
        "provider": provider,
        "source": provider,
        "mode": "cloud-train-store" if provider.startswith("kling") else "local-fallback-store",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "notes": (extra or {}).get("notes", "Stored for local model self-training"),
        **(extra or {}),
    }
    rag_path = _write_rag_note(prompt, record)
    record["rag_note"] = str(rag_path)
    _append_index(record)
    return record


def kling_credentials() -> tuple[str | None, str | None]:
    ak = os.environ.get("KLING_ACCESS_KEY", "").strip()
    sk = os.environ.get("KLING_SECRET_KEY", "").strip()
    return (ak or None, sk or None)


def generate_video_kling(prompt: str, duration: str = "5", aspect_ratio: str = "16:9") -> dict[str, Any]:
    ak, sk = kling_credentials()
    if not ak or not sk:
        return {
            "success": False,
            "error": "Missing KLING_ACCESS_KEY / KLING_SECRET_KEY",
            "balance_or_key_error": True,
            "provider": "kling",
        }

    token = _kling_jwt(ak, sk)
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    create_url = f"{KLING_BASE}/v1/videos/text2video"
    status, created = _http_json(
        "POST",
        create_url,
        headers,
        {
            "model_name": os.environ.get("KLING_VIDEO_MODEL", "kling-v1"),
            "prompt": prompt,
            "duration": str(duration),
            "aspect_ratio": aspect_ratio,
            "mode": os.environ.get("KLING_MODE", "std"),
        },
        timeout=60.0,
    )
    message = str(created.get("message") or created.get("msg") or created)
    if status and status >= 400:
        return {
            "success": False,
            "error": message,
            "status": status,
            "balance_or_key_error": is_balance_or_key_error(message, status),
            "provider": "kling",
            "raw": created,
        }

    data = created.get("data") if isinstance(created.get("data"), dict) else created
    task_id = str(data.get("task_id") or data.get("id") or "").strip()
    if not task_id:
        return {
            "success": False,
            "error": f"Kling did not return task_id: {message}",
            "balance_or_key_error": is_balance_or_key_error(message, status),
            "provider": "kling",
            "raw": created,
        }

    poll_url = f"{KLING_BASE}/v1/videos/text2video/{task_id}"
    deadline = time.time() + float(os.environ.get("KLING_POLL_TIMEOUT_SEC", "180"))
    last: dict[str, Any] = {}
    while time.time() < deadline:
        time.sleep(float(os.environ.get("KLING_POLL_INTERVAL_SEC", "8")))
        pstatus, last = _http_json("GET", poll_url, headers, None, timeout=60.0)
        if pstatus and pstatus >= 400:
            err = str(last.get("message") or last.get("msg") or last)
            return {
                "success": False,
                "error": err,
                "status": pstatus,
                "balance_or_key_error": is_balance_or_key_error(err, pstatus),
                "provider": "kling",
                "task_id": task_id,
                "raw": last,
            }
        pdata = last.get("data") if isinstance(last.get("data"), dict) else last
        task_status = str(pdata.get("task_status") or pdata.get("status") or "").lower()
        if task_status in {"succeed", "succeeded", "success", "completed"}:
            videos = pdata.get("task_result", {}).get("videos") if isinstance(pdata.get("task_result"), dict) else None
            url = None
            if isinstance(videos, list) and videos:
                url = videos[0].get("url")
            url = url or pdata.get("video_url") or pdata.get("url")
            if not url:
                return {
                    "success": False,
                    "error": "Kling succeeded but no video URL was returned",
                    "provider": "kling",
                    "task_id": task_id,
                    "raw": last,
                }
            stored = store_training_asset(
                kind="video",
                prompt=prompt,
                source_url=str(url),
                extension=".mp4",
                provider="kling",
                extra={"task_id": task_id, "notes": "Kling cloud video stored for local self-training"},
            )
            return {
                "success": True,
                "provider": "kling",
                "mode": "cloud",
                "task_id": task_id,
                "video_url": url,
                "training": stored,
                "self_train": True,
            }
        if task_status in {"failed", "error", "canceled", "cancelled"}:
            err = str(pdata.get("task_status_msg") or pdata.get("message") or "Kling task failed")
            return {
                "success": False,
                "error": err,
                "balance_or_key_error": is_balance_or_key_error(err, pstatus),
                "provider": "kling",
                "task_id": task_id,
                "raw": last,
            }

    return {
        "success": False,
        "error": "Kling poll timed out",
        "balance_or_key_error": False,
        "provider": "kling",
        "task_id": task_id,
        "raw": last,
    }


def _local_video_fallback(prompt: str) -> dict[str, Any]:
    """
    Prefer local ConvLSTM when a checkpoint exists; otherwise store a RAG-ready
    storyboard note and a lightweight SVG animation placeholder.
    """
    from jarvis_brain import generate_placeholder_image

    paths = module_paths()
    model_dir = paths["zevorix"] / "models" / "video_gen"
    has_checkpoint = model_dir.exists() and any(model_dir.glob("*.pt"))

    local_result: dict[str, Any] = {
        "success": True,
        "provider": "local-video",
        "mode": "local-fallback",
        "self_train": True,
        "checkpoint_ready": has_checkpoint,
    }

    if has_checkpoint:
        try:
            # Soft import — may be heavy; keep optional
            import sys

            zev = str(paths["zevorix"])
            if zev not in sys.path:
                sys.path.insert(0, zev)
            from src.video_gen import VideoGenerator  # type: ignore

            generator = VideoGenerator()
            out = generator.generate(prompt)
            local_result["local_output"] = str(out)
            local_result["video_url"] = str(out)
            stored = store_training_asset(
                kind="video",
                prompt=prompt,
                source_url=None,
                source_bytes=Path(out).read_bytes() if Path(out).exists() else None,
                extension=".mp4",
                provider="local-video",
                extra={"notes": "Local model output after Kling balance/key failure"},
            )
            local_result["training"] = stored
            return local_result
        except Exception as exc:  # noqa: BLE001
            local_result["local_error"] = str(exc)

    # Placeholder concept + RAG note so the pipeline still learns the prompt
    concept = generate_placeholder_image(f"video storyboard: {prompt}")
    svg_name = concept.get("filename")
    svg_path = module_paths()["image_pipeline"] / "storage" / "images" / "generated" / str(svg_name)
    stored = None
    if svg_path.exists():
        stored = store_training_asset(
            kind="image",
            prompt=f"[video-fallback-storyboard] {prompt}",
            source_bytes=svg_path.read_bytes(),
            extension=".svg",
            provider="local-storyboard",
            extra={
                "notes": "Fallback storyboard stored because Kling balance/API key failed",
                "rag_pipeline": True,
            },
        )
    else:
        roots = training_roots()
        note = _write_rag_note(
            prompt,
            {
                "source": "local-fallback",
                "mode": "rag-only",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "local_path": "",
                "notes": "No checkpoint; prompt indexed for RAG self-train",
            },
        )
        stored = {"rag_note": str(note), "provider": "rag-only"}

    local_result.update(
        {
            "video_url": concept.get("image_url"),
            "concept": concept,
            "training": stored,
            "fallback_reason": "kling_balance_or_key_or_unavailable",
            "hint": (
                "Add videos under Zevorix data/video_generation/training_videos "
                "and run local train, or fix Kling credits/keys."
            ),
        }
    )
    return local_result


def _local_image_fallback(prompt: str) -> dict[str, Any]:
    from jarvis_brain import generate_placeholder_image

    concept = generate_placeholder_image(prompt)
    svg_name = concept.get("filename")
    svg_path = module_paths()["image_pipeline"] / "storage" / "images" / "generated" / str(svg_name)
    stored = None
    if svg_path.exists():
        stored = store_training_asset(
            kind="image",
            prompt=prompt,
            source_bytes=svg_path.read_bytes(),
            extension=".svg",
            provider="local-image",
            extra={"notes": "Local image fallback after API key/balance error"},
        )
    return {
        "success": True,
        "provider": "local-image",
        "mode": "local-fallback",
        "image_url": concept.get("image_url"),
        "concept": concept,
        "training": stored,
        "self_train": True,
    }


def generate_video_with_self_train(prompt: str, duration: str = "5") -> dict[str, Any]:
    text = (prompt or "").strip()
    if not text:
        return {"success": False, "error": "Missing prompt"}

    cloud = generate_video_kling(text, duration=duration)
    if cloud.get("success"):
        return cloud

    if cloud.get("balance_or_key_error") or not kling_credentials()[0]:
        local = _local_video_fallback(text)
        local["cloud_error"] = cloud.get("error")
        local["used_rag_pipeline"] = True
        return local

    # Non-balance cloud failure: still degrade to local so UX never hard-stops
    local = _local_video_fallback(text)
    local["cloud_error"] = cloud.get("error")
    local["used_rag_pipeline"] = True
    return local


def generate_image_with_self_train(prompt: str) -> dict[str, Any]:
    """Images: try Kling image endpoint if keys exist; else local + store."""
    text = (prompt or "").strip()
    if not text:
        return {"success": False, "error": "Missing prompt"}

    ak, sk = kling_credentials()
    if ak and sk:
        token = _kling_jwt(ak, sk)
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        status, created = _http_json(
            "POST",
            f"{KLING_BASE}/v1/images/generations",
            headers,
            {"model_name": os.environ.get("KLING_IMAGE_MODEL", "kling-v1"), "prompt": text},
            timeout=60.0,
        )
        message = str(created.get("message") or created.get("msg") or created)
        if status and status < 400:
            data = created.get("data") if isinstance(created.get("data"), dict) else created
            # Async image APIs vary; if URL present, store it
            images = []
            if isinstance(data.get("task_result"), dict):
                images = data["task_result"].get("images") or []
            url = None
            if isinstance(images, list) and images:
                url = images[0].get("url")
            url = url or data.get("url") or data.get("image_url")
            if url:
                stored = store_training_asset(
                    kind="image",
                    prompt=text,
                    source_url=str(url),
                    extension=".png",
                    provider="kling-image",
                )
                return {
                    "success": True,
                    "provider": "kling-image",
                    "mode": "cloud",
                    "image_url": url,
                    "training": stored,
                    "self_train": True,
                }
        if is_balance_or_key_error(message, status) or status in {401, 402, 403}:
            local = _local_image_fallback(text)
            local["cloud_error"] = message
            return local

    local = _local_image_fallback(text)
    local["cloud_error"] = "Kling image skipped or unavailable"
    return local


def self_train_status() -> dict[str, Any]:
    roots = training_roots()
    index_lines = 0
    if roots["index"].exists():
        index_lines = sum(1 for _ in roots["index"].open(encoding="utf-8") if _.strip())
    videos = list(roots["video_dir"].glob("*")) if roots["video_dir"].exists() else []
    images = list(roots["image_dir"].glob("*")) if roots["image_dir"].exists() else []
    rag_notes = list(roots["rag_dir"].glob("*.txt")) if roots["rag_dir"].exists() else []
    ak, sk = kling_credentials()
    return {
        "kling_configured": bool(ak and sk),
        "training_videos": len([p for p in videos if p.is_file()]),
        "training_images": len([p for p in images if p.is_file()]),
        "rag_notes": len(rag_notes),
        "index_records": index_lines,
        "paths": {k: str(v) for k, v in roots.items()},
        "hint": (
            "Cloud Kling successes are stored under Zevorix training folders. "
            "On balance/API key errors, local RAG + image/video models are used "
            "and prompts/assets are still indexed for self-training."
        ),
    }
