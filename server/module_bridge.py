"""Lazy bridges from the unified gateway into workspace modules.

Zevorix API Bridge
------------------
When Zevorix server.py is running on port 8001 (auto-started by
scripts/autostart_zevorix.ps1 or manually via `python server.py`),
all Zevorix queries go through the HTTP API — much faster and more
reliable than importing the heavy LangChain/Transformers stack inline.

Fallback: if port 8001 is unreachable, the bridge falls back to the
original in-process Python import approach.
"""
from __future__ import annotations

import json
import base64
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

from workspace_paths import (
    apply_sys_path,
    module_paths,
    voice_package_root,
)


# ── Zevorix HTTP client (port 8001) ────────────────────────────────────────────
ZEVORIX_API_BASE = os.environ.get("ZEVORIX_API_BASE", "http://127.0.0.1:8001").rstrip("/")
ZEVORIX_API_KEY = os.environ.get("ZEVORIX_API_KEY", "zevorix-local-dev-key")
IMAGE_RAG_API_BASE = os.environ.get("IMAGE_RAG_URL", "http://127.0.0.1:8002").rstrip("/")
_ZEVORIX_API_AVAILABLE: bool | None = None   # None = not yet checked
_IOT_API_AVAILABLE: bool | None = None
_IMAGE_RAG_API_AVAILABLE: bool | None = None
_AVAIL_CACHE: dict[str, Any] | None = None
_AVAIL_TS = 0.0


def _zevorix_api_ping(timeout: float = 1.5) -> bool:
    """Check if Zevorix API server is reachable."""
    global _ZEVORIX_API_AVAILABLE
    try:
        req = urllib.request.Request(f"{ZEVORIX_API_BASE}/health", method="GET")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode())
            _ZEVORIX_API_AVAILABLE = 200 <= resp.status < 400
            return bool(_ZEVORIX_API_AVAILABLE)
    except Exception:
        _ZEVORIX_API_AVAILABLE = False
        return False


def _zevorix_api_chat(query: str, top_k: int = 4, timeout: float = 30.0) -> dict[str, Any] | None:
    """
    Call the Zevorix API server /chat endpoint.
    Returns dict with 'answer', 'sources', 'latency_ms' — or None if unreachable.
    """
    try:
        body = json.dumps({"query": query, "top_k": top_k, "engine": "zevorix"}).encode()
        req  = urllib.request.Request(
            f"{ZEVORIX_API_BASE}/chat",
            data=body,
            method="POST",
            headers={"Content-Type": "application/json", "X-Zevorix-Key": ZEVORIX_API_KEY},
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            detail = json.loads(raw).get("detail", raw)
        except Exception:
            detail = raw
        return {"error": detail, "source": "zevorix-api"}
    except Exception as exc:
        return None


def _zevorix_api_search(query: str, top_k: int = 4) -> dict[str, Any] | None:
    """Call the Zevorix API /search endpoint for semantic document search."""
    try:
        body = json.dumps({"query": query, "top_k": top_k}).encode()
        req  = urllib.request.Request(
            f"{ZEVORIX_API_BASE}/search",
            data=body,
            method="POST",
            headers={"Content-Type": "application/json", "X-Zevorix-Key": ZEVORIX_API_KEY},
        )
        with urllib.request.urlopen(req, timeout=10.0) as resp:
            return json.loads(resp.read().decode())
    except Exception:
        return None


def _image_rag_api_ping(timeout: float = 0.4) -> bool:
    global _IMAGE_RAG_API_AVAILABLE
    try:
        request = urllib.request.Request(f"{IMAGE_RAG_API_BASE}/health", method="GET")
        with urllib.request.urlopen(request, timeout=timeout) as response:
            _IMAGE_RAG_API_AVAILABLE = 200 <= response.status < 400
    except Exception:
        _IMAGE_RAG_API_AVAILABLE = False
    return bool(_IMAGE_RAG_API_AVAILABLE)


def _iot_api_ping(timeout: float = 1.0) -> bool:
    """Check whether the optional IoT FastAPI service is running."""
    global _IOT_API_AVAILABLE
    try:
        request = urllib.request.Request(
            os.environ.get("IOT_API_BASE", "http://127.0.0.1:8010").rstrip("/") + "/health",
            method="GET",
        )
        with urllib.request.urlopen(request, timeout=timeout) as response:
            payload = json.loads(response.read().decode("utf-8"))
        _IOT_API_AVAILABLE = payload.get("status") == "ok"
    except (OSError, urllib.error.URLError, json.JSONDecodeError):
        _IOT_API_AVAILABLE = False
    return bool(_IOT_API_AVAILABLE)


# ── Legacy in-process state (fallback when API server is not running) ─────────
_RAG_CHAIN: Any = None
_RAG_ERROR: str | None = None
_ZEVORIX_CHAIN: Any = None
_ZEVORIX_ERROR: str | None = None
_VOICE_BRAIN: Any = None
_VOICE_ERROR: str | None = None
_IMAGE_RAG_BUILDER: Any = None
_IMAGE_RAG_ERROR: str | None = None


def save_image_rag_upload(data_url: str, filename: str = "reference.png") -> dict[str, Any]:
    """Persist a browser data URL in the Image RAG pipeline upload directory."""
    if not data_url.startswith("data:image/") or "," not in data_url:
        raise ValueError("reference_image must be an image data URL")
    header, encoded = data_url.split(",", 1)
    mime = header.split(";", 1)[0].split("/", 1)[1].lower()
    if mime == "jpg":
        mime = "jpeg"
    if mime not in {"png", "jpeg", "webp"}:
        raise ValueError("Only PNG, JPEG, and WebP images are supported")
    safe_name = re.sub(r"[^a-zA-Z0-9._-]+", "-", Path(filename).name).strip("-") or f"reference.{mime}"
    if "." not in safe_name:
        safe_name = f"{safe_name}.{mime}"
    target_dir = module_paths()["image_pipeline"] / "storage" / "images" / "uploaded"
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{int(time.time() * 1000)}-{safe_name}"
    target.write_bytes(base64.b64decode(encoded))
    return {"path": str(target), "filename": target.name}


def ensure_paths() -> list[str]:
    return apply_sys_path(sys)


def module_availability() -> dict[str, Any]:
    global _AVAIL_CACHE, _AVAIL_TS
    now = time.time()
    if _AVAIL_CACHE is not None and now - _AVAIL_TS < 4:
        return _AVAIL_CACHE

    paths = module_paths()

    # Check if Zevorix API server is running (fast HTTP ping)
    zevorix_api_up = _zevorix_api_ping(timeout=0.4)
    iot_api_up = _iot_api_ping(timeout=0.4)
    image_rag_api_up = _image_rag_api_ping(timeout=0.4)
    # Fallback: directory exists = engine can be started even if server isn't up
    zevorix_dir_exists = paths["zevorix"].exists()
    zevorix_available  = zevorix_api_up or zevorix_dir_exists

    payload = {
        "frontend": True,
        "auth": True,
        "voice-assistant": voice_package_root() is not None,
        "rag-engine": zevorix_available or paths["jarvis_rag"].exists(),
        "zevorix": zevorix_available,
        "zevorix-api": zevorix_api_up,
        "jarvis-rag": paths["jarvis_rag"].exists(),
        "voice-system": paths["system_voice"].exists() or paths["jarvis_voice"].exists(),
        "image-rag": paths["image_pipeline"].exists() or image_rag_api_up,
        "image-rag-api": image_rag_api_up,
        "image-generator": (
            paths["jarvis_rag"].exists()
            or paths["image_pipeline"].exists()
            or zevorix_available
        ),
        "iot-api": iot_api_up,
        "engines": [
            {
                "id": "zevorix",
                "name": "Zevorix LLM Engine 1.0",
                "description": (
                    "Local Flan-T5 + ChromaDB RAG — API server running"
                    if zevorix_api_up
                    else "Local HuggingFace Flan-T5 / Causal LLM & Chroma Vector Store"
                ),
                "available": zevorix_available,
                "api_running": zevorix_api_up,
                "icon": "Zap",
            },
            {
                "id": "jarvis-rag",
                "name": "JARVIS RAG Engine",
                "description": "LangChain Document QA & Knowledge Pipeline",
                "available": paths["jarvis_rag"].exists(),
                "icon": "Brain",
            },
            {
                "id": "voice-system",
                "name": "Voice System Control Engine",
                "description": "Desktop Automation, App Launcher, Media & Voice Brain",
                "available": paths["system_voice"].exists() or paths["jarvis_voice"].exists(),
                "icon": "Mic",
            },
            {
                "id": "image-rag",
                "name": "Image RAG Pipeline",
                "description": "Prompt Engineering & Image RAG Generation",
                "available": paths["image_pipeline"].exists() or image_rag_api_up,
                "api_running": image_rag_api_up,
                "icon": "Image",
            },
            {
                "id": "iot-api",
                "name": "IoT Device Control",
                "description": "USB, Wi-Fi/HTTP, MQTT, and connected device control",
                "available": iot_api_up,
                "icon": "Cpu",
            },
            {
                "id": "unified",
                "name": "Unified Auto Brain",
                "description": "Intelligent Multi-Engine Auto Router",
                "available": True,
                "icon": "Sparkles",
            },
        ],
    }
    _AVAIL_CACHE = payload
    _AVAIL_TS = now
    return payload


def _prepare_voice_import() -> None:
    """Put voice package first and drop shadowed utils/core modules."""
    ensure_paths()
    voice = voice_package_root()
    if voice is None:
        raise FileNotFoundError("No voice package found under workspace")

    voice_str = str(voice)
    paths = module_paths()
    for bad in (str(paths["zevorix"]), str(paths["zevorix"] / "src")):
        while bad in sys.path:
            sys.path.remove(bad)

    if voice_str in sys.path:
        sys.path.remove(voice_str)
    sys.path.insert(0, voice_str)

    for name in list(sys.modules):
        if name in ("utils", "core") or name.startswith(("utils.", "core.")):
            del sys.modules[name]


def _try_build_zevorix_rag() -> Any:
    """Build Zevorix RAG chain if vector store and deps are ready."""
    paths = module_paths()
    zevorix = paths["zevorix"]
    if not zevorix.exists():
        raise FileNotFoundError(f"Zevorix not found at {zevorix}")

    zev_str = str(zevorix)
    if zev_str not in sys.path:
        sys.path.insert(0, zev_str)

    # Try Chroma DB QA chain first
    chroma = zevorix / "chroma_db"
    if chroma.exists():
        try:
            from src.rag_chain import build_qa_chain  # type: ignore
            return build_qa_chain()
        except Exception:
            pass

    # Fallback to local HuggingFace LLM in Zevorix src
    from src.local_llm import get_local_llm  # type: ignore
    return get_local_llm()


def _load_zevorix_with_timeout(seconds: float = 12.0) -> Any:
    import concurrent.futures

    pool = concurrent.futures.ThreadPoolExecutor(max_workers=1)
    future = pool.submit(_try_build_zevorix_rag)
    try:
        return future.result(timeout=seconds)
    except concurrent.futures.TimeoutError as exc:
        pool.shutdown(wait=False, cancel_futures=True)
        raise TimeoutError("Zevorix model load timed out") from exc
    finally:
        if future.done() and not future.cancelled():
            pool.shutdown(wait=False)


def ask_zevorix(query: str) -> dict[str, Any]:
    """
    Query Zevorix LLM Engine 1.0.
    Priority: HTTP API server (port 8001) → in-process Python import fallback.
    """
    global _ZEVORIX_CHAIN, _ZEVORIX_ERROR
    text = (query or "").strip()
    if not text:
        return {"success": False, "error": "Missing query", "source": "zevorix"}

    # ── Try Zevorix API server first (fast, no heavy import) ─────────────────
    if _zevorix_api_ping(timeout=1.0):
        result = _zevorix_api_chat(text)
        if result is not None and "error" not in result:
            answer  = result.get("answer", "")
            sources = result.get("sources", [])
            return {
                "success":  True,
                "response": answer,
                "sources":  sources,
                "source":   "Zevorix LLM Engine 1.0 (API)",
                "engine":   "zevorix",
                "model":    result.get("model", "Flan-T5 / Local Transformers"),
                "latency_ms": result.get("latency_ms", 0),
            }
        elif result is not None and "error" in result:
            # API server returned an error (e.g. still initializing)
            err_msg = result["error"]
            if "initializing" in err_msg.lower() or "503" in str(err_msg):
                return {
                    "success": False,
                    "error":   f"Zevorix is initializing: {err_msg}",
                    "source":  "zevorix-api",
                    "hint":    "Wait a moment for the model to finish loading.",
                }

    # ── Fallback: in-process import (original behaviour) ─────────────────────

    try:
        if _ZEVORIX_CHAIN is None and _ZEVORIX_ERROR is None:
            try:
                _ZEVORIX_CHAIN = _load_zevorix_with_timeout(12.0)
            except TimeoutError:
                _ZEVORIX_ERROR = "Zevorix model is downloading/initializing."
                return {
                    "success": False,
                    "error": _ZEVORIX_ERROR,
                    "source": "zevorix-llm-1.0",
                    "hint": "Zevorix LLM Engine 1.0 downloading HuggingFace Flan-T5 model...",
                }
            except Exception as exc:
                _ZEVORIX_ERROR = str(exc)
                return {
                    "success": False,
                    "error": _ZEVORIX_ERROR,
                    "source": "zevorix-llm-1.0",
                }

        if _ZEVORIX_CHAIN is None:
            return {
                "success": False,
                "error": _ZEVORIX_ERROR or "Zevorix LLM unavailable",
                "source": "zevorix-llm-1.0",
            }

        if hasattr(_ZEVORIX_CHAIN, "invoke"):
            raw_res = _ZEVORIX_CHAIN.invoke({"query": text} if isinstance(_ZEVORIX_CHAIN, dict) or hasattr(_ZEVORIX_CHAIN, "combine_documents_chain") else text)
            if isinstance(raw_res, dict):
                answer = raw_res.get("result") or raw_res.get("answer") or str(raw_res)
                sources = [
                    {
                        "source": getattr(d, "metadata", {}).get("source", "?"),
                        "page": getattr(d, "metadata", {}).get("page", "?"),
                        "snippet": getattr(d, "page_content", "")[:240],
                    }
                    for d in raw_res.get("source_documents") or []
                ]
            else:
                answer = str(raw_res)
                sources = []
        else:
            answer = str(_ZEVORIX_CHAIN(text))
            sources = []

        return {
            "success": True,
            "response": answer,
            "sources": sources,
            "source": "Zevorix LLM Engine 1.0",
            "engine": "zevorix",
            "model": "Flan-T5 / Local Transformers",
        }
    except Exception as exc:
        return {"success": False, "error": str(exc), "source": "zevorix-llm-1.0"}


def ask_rag(query: str) -> dict[str, Any]:
    """Query JARVIS RAG Engine (LangChain QA Pipeline)."""
    global _RAG_CHAIN, _RAG_ERROR
    text = (query or "").strip()
    if not text:
        return {"success": False, "error": "Missing query", "source": "rag"}

    paths = module_paths()
    jarvis_rag = paths["jarvis_rag"]
    if not jarvis_rag.exists():
        return {"success": False, "error": "JARVIS RAG folder not found", "source": "jarvis-rag"}

    try:
        rag_str = str(jarvis_rag)
        if rag_str not in sys.path:
            sys.path.insert(0, rag_str)

        if _RAG_CHAIN is None and _RAG_ERROR is None:
            try:
                from src.rag_chain import build_qa_chain  # type: ignore
                _RAG_CHAIN = build_qa_chain()
            except Exception as exc:
                _RAG_ERROR = str(exc)

        if _RAG_CHAIN is None:
            return ask_zevorix(query)

        result = _RAG_CHAIN.invoke({"query": text})
        answer = result.get("result") if isinstance(result, dict) else str(result)
        sources = []
        if isinstance(result, dict):
            for doc in result.get("source_documents") or []:
                meta = getattr(doc, "metadata", {}) or {}
                sources.append(
                    {
                        "source": meta.get("source", "?"),
                        "page": meta.get("page") or meta.get("row", "?"),
                        "snippet": (getattr(doc, "page_content", "") or "")[:240],
                    }
                )
        return {
            "success": True,
            "response": answer,
            "sources": sources,
            "source": "JARVIS RAG Engine",
            "engine": "jarvis-rag",
        }
    except Exception as exc:
        return {"success": False, "error": str(exc), "source": "jarvis-rag"}


def run_voice_command(command: str) -> dict[str, Any]:
    """Execute a command via System Control / JARVIS voice Brain."""
    global _VOICE_BRAIN, _VOICE_ERROR
    text = (command or "").strip()
    if not text:
        return {"success": False, "error": "Missing command", "source": "voice-system"}

    try:
        if _VOICE_BRAIN is None and _VOICE_ERROR is None:
            try:
                _prepare_voice_import()
                from core.brain import Brain  # type: ignore
                _VOICE_BRAIN = Brain()
            except Exception as exc:
                _VOICE_ERROR = str(exc)
                return {"success": False, "error": _VOICE_ERROR, "source": "voice-system"}

        if _VOICE_BRAIN is None:
            return {"success": False, "error": _VOICE_ERROR or "Voice unavailable"}

        result = _VOICE_BRAIN.process(text)
        message = getattr(result, "message", None)
        answer = message if message is not None else str(result)
        return {
            "success": True,
            "command": text,
            "response": answer,
            "result": answer,
            "source": "Voice System Control Engine",
            "engine": "voice-system",
        }
    except Exception as exc:
        return {"success": False, "error": str(exc), "source": "voice-system"}


def _rewrite_image_rag_url(url: str | None) -> str | None:
    if not url:
        return None
    if url.startswith("/images/generated/"):
        return "/image-rag/generated/" + url.rsplit("/", 1)[-1]
    return url


def _generate_via_image_rag_http(prompt: str, reference_image: str | None) -> dict[str, Any] | None:
    if not _image_rag_api_ping(timeout=0.8):
        return None
    body = json.dumps({
        "prompt": prompt,
        "style": "detailed",
        "top_k": 5,
        **({"reference_image": reference_image} if reference_image else {}),
    }).encode("utf-8")
    request = urllib.request.Request(
        f"{IMAGE_RAG_API_BASE}/api/generate-image",
        data=body,
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except Exception:
        return None
    filename = Path(str(payload.get("url") or payload.get("path") or "")).name
    return {
        "success": True,
        "response": f"Generated with Image RAG Pipeline: {payload.get('prompt') or prompt}",
        "prompt": payload.get("prompt") or prompt,
        "image_url": _rewrite_image_rag_url(payload.get("url")) or f"/image-rag/generated/{filename}",
        "source": "Image RAG Pipeline",
        "engine": "image-rag",
    }


def ask_image_rag(prompt: str, reference_image: str | None = None) -> dict[str, Any]:
    """Invoke Image RAG pipeline (HTTP FastAPI, then in-process fallback)."""
    global _IMAGE_RAG_BUILDER, _IMAGE_RAG_ERROR
    text = (prompt or "").strip()
    if not text:
        return {"success": False, "error": "Missing prompt", "source": "image-rag"}

    upload = None
    try:
        upload = save_image_rag_upload(reference_image) if reference_image else None
    except Exception as exc:
        return {"success": False, "error": str(exc), "source": "image-rag"}

    http_res = _generate_via_image_rag_http(text, reference_image)
    if http_res:
        http_res["uploaded_image"] = upload
        return http_res

    paths = module_paths()
    img_pipe = paths["image_pipeline"]
    if img_pipe.exists():
        try:
            pipe_str = str(img_pipe)
            if pipe_str not in sys.path:
                sys.path.insert(0, pipe_str)
            if _IMAGE_RAG_BUILDER is None and _IMAGE_RAG_ERROR is None:
                try:
                    from app.services.prompt_engineer import PromptEngineer  # type: ignore
                    _IMAGE_RAG_BUILDER = PromptEngineer()
                except Exception as exc:
                    _IMAGE_RAG_ERROR = str(exc)

            if _IMAGE_RAG_BUILDER is not None:
                data_dir = img_pipe / "storage" / "images" / "uploaded"
                examples = _IMAGE_RAG_BUILDER.load_data_examples(str(data_dir), 5)
                enhanced_prompt = _IMAGE_RAG_BUILDER.build_prompt(text, examples, "detailed")
                from jarvis_brain import generate_placeholder_image
                image_res = generate_placeholder_image(enhanced_prompt)
                return {
                    "success": True,
                    "response": f"🎨 **Image RAG Prompt Engineered:**\n`{enhanced_prompt}`",
                    "prompt": enhanced_prompt,
                    "image_url": image_res.get("image_url"),
                    "source": "Image RAG Pipeline",
                    "engine": "image-rag",
                    "uploaded_image": upload,
                }
        except Exception as exc:
            return {"success": False, "error": str(exc), "source": "image-rag"}

    from jarvis_brain import generate_placeholder_image
    res = generate_placeholder_image(text)
    return {
        "success": True,
        "response": f"🎨 Visual concept card generated for prompt: '{text}'",
        "image_url": res.get("image_url"),
        "source": "Image RAG Engine",
        "engine": "image-rag",
        "uploaded_image": upload,
    }


def ask_llm_engine(message: str, engine: str = "unified", username: str | None = None) -> dict[str, Any]:
    """Target a specific workspace LLM engine or use smart auto-routing."""
    mode = (engine or "unified").lower().strip()
    text = (message or "").strip()

    if mode in ("zevorix", "zevorix-llm", "zevorix-1.0"):
        res = ask_zevorix(text)
        if res.get("success"):
            return {
                "response": res["response"],
                "source": "Zevorix LLM Engine 1.0",
                "engine": "zevorix",
                "sources": res.get("sources", []),
                "username": username,
            }
        return {
            "response": f"⚡ [Zevorix LLM Engine 1.0 Notice]: {res.get('error') or 'Initializing model.'}\n\nFalling back to Unified Assistant: " + ask_chat_with_modules(text, username)["response"],
            "source": "Zevorix LLM Engine 1.0 (Fallback)",
            "engine": "zevorix",
            "username": username,
        }

    if mode in ("jarvis-rag", "rag", "langchain"):
        res = ask_rag(text)
        if res.get("success"):
            return {
                "response": res["response"],
                "source": "JARVIS RAG Engine",
                "engine": "jarvis-rag",
                "sources": res.get("sources", []),
                "username": username,
            }
        return {
            "response": f"🧠 [JARVIS RAG Engine Notice]: {res.get('error') or 'RAG Engine offline.'}\n\nUnified Brain Response: " + ask_chat_with_modules(text, username)["response"],
            "source": "JARVIS RAG Engine",
            "engine": "jarvis-rag",
            "username": username,
        }

    if mode in ("voice-system", "voice", "system"):
        res = run_voice_command(text)
        return {
            "response": res.get("response") or res.get("result") or res.get("error") or "Voice command processed.",
            "source": "Voice System Control Engine",
            "engine": "voice-system",
            "command": res.get("command"),
            "username": username,
        }

    if mode in ("image-rag", "image", "visual"):
        res = ask_image_rag(text)
        return {
            "response": res.get("response") or "Image concept generated.",
            "image_url": res.get("image_url"),
            "source": "Image RAG Pipeline",
            "engine": "image-rag",
            "username": username,
        }

    # Unified Auto Mode
    return ask_chat_with_modules(text, username=username)


def ask_chat_with_modules(message: str, username: str | None = None) -> dict[str, Any]:
    """Prefer RAG / Voice / Zevorix according to intent; fall back to jarvis_brain."""
    from jarvis_brain import build_jarvis_response

    availability = module_availability()
    modules = [
        name
        for name, ok in {
            "frontend": True,
            "voice-assistant": availability["voice-assistant"],
            "rag-engine": availability["rag-engine"],
            "zevorix": availability["zevorix"],
            "image-generator": availability["image-generator"],
        }.items()
        if ok
    ]

    lowered = (message or "").lower()

    if any(cmd in lowered for cmd in ["open ", "search ", "play ", "close ", "system info", "volume", "brightness", "weather", "notes"]):
        if availability["voice-assistant"]:
            voice_res = run_voice_command(message)
            if voice_res.get("success"):
                return {
                    "response": f"🎙️ [Voice System Control]: {voice_res.get('response') or voice_res.get('result')}",
                    "username": username,
                    "source": "Voice System Control Engine",
                    "engine": "voice-system",
                    "modules": modules,
                    "modules_detail": availability,
                }

    if any(img_kw in lowered for img_kw in ["image", "picture", "draw", "generate image", "photo", "art"]):
        img_res = ask_image_rag(message)
        return {
            "response": img_res.get("response"),
            "image_url": img_res.get("image_url"),
            "username": username,
            "source": "Image RAG Pipeline",
            "engine": "image-rag",
            "modules": modules,
            "modules_detail": availability,
        }

    wants_rag = any(
        token in lowered
        for token in ("document", "pdf", "rag", "according to", "in the files", "knowledge", "zevorix")
    )

    if wants_rag and availability["zevorix"]:
        zev = ask_zevorix(message)
        if zev.get("success"):
            return {
                "response": zev["response"],
                "username": username,
                "source": "Zevorix LLM Engine 1.0",
                "engine": "zevorix",
                "sources": zev.get("sources", []),
                "modules": modules,
                "modules_detail": availability,
            }

    base = build_jarvis_response(message, username=username)
    base["modules"] = modules
    base["modules_detail"] = availability
    base["source"] = base.get("source") or "Unified Brain Auto Router"
    base["engine"] = "unified"
    return base


def generate_image(prompt: str) -> dict[str, Any]:
    return ask_image_rag(prompt)
