"""Unified J.A.R.V.I.S gateway and ecosystem hub."""
from __future__ import annotations

import base64
import hashlib
import json
import os
import socket
import sys
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

SERVER_DIR = Path(__file__).resolve().parent
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

from auth_server import authenticate_user, create_user, init_db  # noqa: E402
from ecosystem_hub import HUB, validate_token  # noqa: E402
from access_tokens import verify_access_token  # noqa: E402
from jarvis_brain import HOST, PORT  # noqa: E402
from module_bridge import (  # noqa: E402
    ask_chat_with_modules,
    ask_image_rag,
    ask_llm_engine,
    ask_rag,
    generate_image,
    module_availability,
    run_voice_command,
)
from self_train_media import (  # noqa: E402
    generate_image_with_self_train,
    generate_video_with_self_train,
    self_train_status,
)
from workspace_paths import existing_module_status, get_workspace_root  # noqa: E402


def _read_json_body(handler: BaseHTTPRequestHandler) -> dict[str, Any] | None:
    try:
        size = int(handler.headers.get("Content-Length", "0"))
        return json.loads(handler.rfile.read(size).decode("utf-8") or "{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


def _zevorix_request(path: str, method: str = "GET", payload: dict[str, Any] | None = None) -> tuple[int, dict[str, Any]]:
    base = os.environ.get("ZEVORIX_URL", os.environ.get("ZEVORIX_PUBLIC_URL", "http://127.0.0.1:8001")).rstrip("/")
    body = json.dumps(payload or {}).encode("utf-8") if method != "GET" else None
    request = urllib.request.Request(
        f"{base}{path}",
        data=body,
        method=method,
        headers={
            "Content-Type": "application/json",
            "X-Zevorix-Key": os.environ.get("ZEVORIX_API_KEY", "zevorix-local-dev-key"),
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        try:
            detail = json.loads(exc.read().decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            detail = {"error": str(exc)}
        return exc.code, detail
    except (urllib.error.URLError, TimeoutError) as exc:
        return 503, {"error": f"Zevorix unavailable: {exc}"}


ACTION_TOPICS = {
    "/api/v1/voice/command": "voice.command",
    "/api/v1/voice/typing": "voice.typing",
    "/api/v1/image/request": "image.request",
    "/api/v1/llm/query": "llm.query",
    "/api/v1/app/launch": "app.launch",
    "/api/v1/music/play": "music.play",
    "/api/v1/paint/draw": "paint.draw",
    "/api/v1/iot/device/action": "iot.device.action",
    "/api/v1/communications/email": "communications.email",
    "/api/v1/files/share": "files.share",
}


class UnifiedJarvisRequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), format % args))

    def _send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Jarvis-Token")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Jarvis-Token")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path == "/ws":
            self._serve_websocket()
        elif path.startswith("/image-rag/generated/"):
            self._serve_image_rag(path.split("/image-rag/generated/", 1)[1], "generated")
        elif path.startswith("/images/generated/"):
            self._serve_image_rag(path.split("/images/generated/", 1)[1], "generated")
        elif path.startswith("/images/uploaded/"):
            self._serve_image_rag(path.split("/images/uploaded/", 1)[1], "uploaded")
        elif path == "/api/v1/services":
            self._send_json(200, {"services": HUB.services()})
        elif path == "/api/v1/events":
            self._send_json(200, {"events": HUB.recent_events()})
        elif path == "/api/v1/metrics":
            self._send_json(200, HUB.metrics())
        elif path in {"/health", "/engines"}:
            self._send_json(200, {
                "status": "ok",
                "service": "jarvis-unified",
                "workspace": str(get_workspace_root()),
                "modules": module_availability(),
                "paths": existing_module_status(),
                "self_train": self_train_status(),
            })
        elif path in {"/media/train-status", "/media/self-train"}:
            self._send_json(200, self_train_status())
        elif path in {"/rag/ingest/status", "/ingest/status"}:
            status, result = _zevorix_request("/ingest/status")
            self._send_json(status, result)
        else:
            self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path in {"/api/v1/services/register", "/api/v1/events"}:
            if not validate_token(self._token()):
                self._send_json(401, {"error": "Valid JARVIS service token required"})
                return
            payload = _read_json_body(self)
            if payload is None:
                self._send_json(400, {"error": "Invalid JSON body"})
                return
            try:
                result = HUB.register(payload) if path.endswith("/register") else HUB.publish(
                    str(payload.get("topic", "")),
                    payload.get("data", {}),
                    source=str(payload.get("source", "unknown")),
                )
            except (TypeError, ValueError) as exc:
                self._send_json(400, {"error": str(exc)})
                return
            self._send_json(201 if path.endswith("/register") else 202, result)
            return

        if path in ACTION_TOPICS:
            identity = verify_access_token(self._token())
            if identity is None and not validate_token(self._token()):
                self._send_json(401, {"error": "Bearer access token required"})
                return
            payload = _read_json_body(self)
            if payload is None:
                self._send_json(400, {"error": "Invalid JSON body"})
                return
            payload["user"] = identity.get("sub") if identity else "service"
            if path == "/api/v1/voice/command":
                payload["result"] = run_voice_command(str(payload.get("command", "")))
            elif path == "/api/v1/llm/query":
                payload["result"] = ask_llm_engine(
                    str(payload.get("query") or payload.get("message") or ""),
                    engine=str(payload.get("engine", "unified")),
                    username=payload["user"],
                )
            elif path == "/api/v1/image/request":
                payload["result"] = ask_image_rag(
                    str(payload.get("prompt", "")),
                    str(payload["reference_image"]) if payload.get("reference_image") else None,
                )
            event = HUB.publish(ACTION_TOPICS[path], payload, source="jarvis-gateway")
            self._send_json(202, {"accepted": True, "event": event})
            return

        payload = _read_json_body(self)
        if payload is None:
            self._send_json(400, {"error": "Invalid JSON body"})
            return
        if path in {"/signup", "/auth/signup"}:
            result = create_user(str(payload.get("username", "")), str(payload.get("password", "")))
            self._send_json(201 if result.get("success") else 409, result)
        elif path in {"/login", "/auth/login"}:
            result = authenticate_user(str(payload.get("username", "")), str(payload.get("password", "")))
            self._send_json(200 if result.get("success") else 401, result)
        elif path == "/chat":
            message = str(payload.get("message", "")).strip()
            result = ask_llm_engine(message, engine=str(payload.get("engine", "unified")))
            HUB.publish("llm.query", {"message": message}, source="jarvis-gateway")
            self._send_json(200, result)
        elif path == "/voice":
            command = str(payload.get("command", "")).strip()
            result = run_voice_command(command)
            HUB.publish("voice.command", {"command": command, "result": result}, source="voice-system")
            self._send_json(200 if result.get("success") else 400, result)
        elif path == "/rag":
            result = ask_rag(str(payload.get("query") or payload.get("message") or ""))
            self._send_json(200 if result.get("success") else 503, result)
        elif path in {"/rag/ingest", "/ingest"}:
            status, result = _zevorix_request("/ingest", "POST", {"force": bool(payload.get("force", False))})
            self._send_json(status, result)
        elif path == "/image":
            prompt = str(payload.get("prompt", ""))
            reference_image = payload.get("reference_image")
            engine = str(payload.get("engine") or "").lower()
            self_train = str(payload.get("self_train", "0")).lower()
            use_image_rag = bool(reference_image) or engine in {"image-rag", "image", "visual"} or self_train in {"1", "true", "yes"}
            if use_image_rag:
                result = ask_image_rag(prompt, str(reference_image) if reference_image else None)
            else:
                result = generate_image_with_self_train(prompt)
            HUB.publish("image.request", {"prompt": payload.get("prompt"), "result": result}, source="jarvis-gateway")
            self._send_json(200, result)
        elif path in {"/video", "/media/video"}:
            result = generate_video_with_self_train(str(payload.get("prompt", "")), duration=str(payload.get("duration", "5")))
            self._send_json(200 if result.get("success") else 503, result)
        elif path == "/media/image":
            self._send_json(200, generate_image_with_self_train(str(payload.get("prompt", ""))))
        elif path in {
            "/api/speech/start",
            "/api/speech/stop",
            "/api/gesture",
            "/api/body/walk",
            "/api/eye/beam",
            "/api/tts",
        }:
            api_key = os.environ.get(
                "HULKBUSTER_API_KEY",
                os.environ.get("VITE_HULKBUSTER_API_KEY", "hulkbuster-local-dev-key"),
            )
            provided = self._token() or ""
            if provided and provided not in {api_key, "hulkbuster-local-dev-key"} and not validate_token(provided):
                self._send_json(401, {"error": "Invalid API key"})
                return

            if path == "/api/tts":
                text = str(payload.get("text") or payload.get("input") or "").strip()
                if not text:
                    self._send_json(400, {"error": "text required"})
                    return
                voice_key = (
                    os.environ.get("VOICE_RSS_API_KEY")
                    or os.environ.get("VITE_VOICE_RSS_API_KEY")
                    or ""
                )
                if not voice_key:
                    self._send_json(503, {"error": "VOICE_RSS_API_KEY not configured"})
                    return
                from urllib.parse import urlencode

                qs = urlencode(
                    {
                        "key": voice_key,
                        "hl": str(payload.get("lang") or "en-us"),
                        "src": text[:10000],
                        "c": "MP3",
                        "f": "44khz_16bit_stereo",
                        "v": str(payload.get("voice") or "Mike"),
                    }
                )
                try:
                    with urllib.request.urlopen(f"https://api.voicerss.org/?{qs}", timeout=30) as resp:
                        audio = resp.read()
                    if audio.startswith(b"ERROR") or len(audio) < 64:
                        self._send_json(502, {"error": audio.decode("utf-8", errors="ignore")})
                        return
                    self.send_response(200)
                    self.send_header("Content-Type", "audio/mpeg")
                    self.send_header("Content-Length", str(len(audio)))
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(audio)
                    return
                except Exception as exc:  # noqa: BLE001
                    self._send_json(502, {"error": str(exc)})
                    return

            event_map = {
                "/api/speech/start": "speech.start",
                "/api/speech/stop": "speech.stop",
                "/api/gesture": "gesture.trigger",
                "/api/body/walk": "body.walk",
                "/api/eye/beam": "eye.beam",
            }
            topic = event_map[path]
            event = HUB.publish(topic, payload, source="hulkbuster-api")
            self._send_json(202, {"ok": True, "event": topic, "hub": event})
        else:
            self._send_json(404, {"error": "Not found"})

    def _token(self) -> str | None:
        authorization = self.headers.get("Authorization", "")
        return authorization[7:].strip() if authorization.lower().startswith("bearer ") else self.headers.get("X-Jarvis-Token")

    def _serve_image_rag(self, filename: str, kind: str = "generated") -> None:
        from urllib.parse import unquote
        folder = "uploaded" if kind == "uploaded" else "generated"
        root = (get_workspace_root() / "image egeneration" / "image-rag-pipeline" / "storage" / "images" / folder).resolve()
        target = (root / unquote(filename)).resolve()
        if root not in target.parents or not target.is_file():
            self._send_json(404, {"error": "Image not found"})
            return
        suffix = target.suffix.lower()
        content_type = {
            ".svg": "image/svg+xml",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
            ".png": "image/png",
        }.get(suffix, "application/octet-stream")
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        self.end_headers()
        self.wfile.write(body)

    def _serve_websocket(self) -> None:
        key = self.headers.get("Sec-WebSocket-Key")
        if self.headers.get("Upgrade", "").lower() != "websocket" or not key:
            self._send_json(426, {"error": "WebSocket upgrade required"})
            return
        accept = base64.b64encode(hashlib.sha1((key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode()).digest()).decode()
        self.send_response(101, "Switching Protocols")
        self.send_header("Upgrade", "websocket")
        self.send_header("Connection", "Upgrade")
        self.send_header("Sec-WebSocket-Accept", accept)
        self.end_headers()
        HUB.add_websocket(self)
        try:
            self.send_event({"topic": "system.alert", "source": "hub", "data": {"kind": "connected"}})
            self.request.settimeout(1)
            while True:
                try:
                    frame = self.request.recv(2)
                    if not frame or frame[0] & 0x0F == 8:
                        break
                except socket.timeout:
                    continue
        except OSError:
            pass
        finally:
            HUB.remove_websocket(self)

    def send_event(self, event: dict[str, Any]) -> None:
        data = json.dumps(event, separators=(",", ":")).encode()
        size = len(data)
        header = bytes([0x81, size]) if size < 126 else bytes([0x81, 126]) + size.to_bytes(2, "big")
        self.request.sendall(header + data)


def run_server() -> None:
    init_db()
    HUB.register({
        "service": "jarvis-gateway",
        "url": f"http://{HOST}:{PORT}",
        "capabilities": list(ACTION_TOPICS.values()),
        "version": "1.0.0",
    })
    server = ThreadingHTTPServer((HOST, PORT), UnifiedJarvisRequestHandler)
    print(f"Unified J.A.R.V.I.S. server listening on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
