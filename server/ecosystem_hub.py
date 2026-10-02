"""Central service registry and event hub for the J.A.R.V.I.S ecosystem.

The hub deliberately uses only the Python standard library so the local
gateway remains startable on a clean machine.  Deployments can replace this
in-process bus with RabbitMQ/Kafka while keeping the REST event contract.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import threading
import time
from collections import deque
from datetime import datetime, timezone
from typing import Any


HUB_SECRET = os.environ.get("JARVIS_HUB_SECRET", "change-me-in-production").encode()
MAX_EVENTS = int(os.environ.get("JARVIS_HUB_MAX_EVENTS", "1000"))


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def issue_service_token(service: str) -> str:
    """Issue a compact HMAC token for trusted local/service-to-service calls."""
    payload = json.dumps(
        {"sub": service, "iat": int(time.time())}, separators=(",", ":")
    ).encode()
    encoded = base64.urlsafe_b64encode(payload).rstrip(b"=")
    signature = hmac.new(HUB_SECRET, encoded, hashlib.sha256).digest()
    return encoded.decode() + "." + base64.urlsafe_b64encode(signature).rstrip(b"=").decode()


def validate_token(token: str | None) -> bool:
    if not token or "." not in token:
        return False
    encoded, supplied = token.split(".", 1)
    expected = base64.urlsafe_b64encode(
        hmac.new(HUB_SECRET, encoded.encode(), hashlib.sha256).digest()
    ).rstrip(b"=").decode()
    return hmac.compare_digest(supplied, expected)


class EcosystemHub:
    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._services: dict[str, dict[str, Any]] = {}
        self._events: deque[dict[str, Any]] = deque(maxlen=MAX_EVENTS)
        self._websockets: set[Any] = set()
        self._started_at = _now()
        self._event_count = 0

    def register(self, payload: dict[str, Any]) -> dict[str, Any]:
        service = str(payload.get("service", "")).strip()
        if not service:
            raise ValueError("service is required")
        record = {
            "service": service,
            "url": str(payload.get("url", "")).strip(),
            "health": str(payload.get("health", "/health")).strip() or "/health",
            "capabilities": sorted(
                {str(item).strip() for item in payload.get("capabilities", []) if str(item).strip()}
            ),
            "version": str(payload.get("version", "unknown")),
            "metadata": payload.get("metadata", {}),
            "registered_at": _now(),
            "last_seen": _now(),
        }
        with self._lock:
            previous = self._services.get(service)
            if previous:
                record["registered_at"] = previous["registered_at"]
            self._services[service] = record
        self.publish(
            "system.alert",
            {"kind": "service.registered", "service": service, "url": record["url"]},
            source="hub",
        )
        return record

    def services(self) -> list[dict[str, Any]]:
        with self._lock:
            return [dict(item) for item in self._services.values()]

    def publish(self, topic: str, data: dict[str, Any], source: str = "unknown") -> dict[str, Any]:
        if not topic or "." not in topic:
            raise ValueError("topic must use a namespaced event such as voice.command")
        event = {
            "id": f"{int(time.time() * 1000)}-{self._event_count + 1}",
            "topic": topic,
            "source": source,
            "timestamp": _now(),
            "data": data,
        }
        with self._lock:
            self._events.append(event)
            self._event_count += 1
            sockets = list(self._websockets)
        for socket in sockets:
            try:
                socket.send_event(event)
            except OSError:
                self.remove_websocket(socket)
        return event

    def recent_events(self, topic: str | None = None) -> list[dict[str, Any]]:
        with self._lock:
            events = list(self._events)
        if topic:
            events = [event for event in events if event["topic"] == topic]
        return events

    def add_websocket(self, socket: Any) -> None:
        with self._lock:
            self._websockets.add(socket)

    def remove_websocket(self, socket: Any) -> None:
        with self._lock:
            self._websockets.discard(socket)

    def metrics(self) -> dict[str, Any]:
        with self._lock:
            return {
                "service_count": len(self._services),
                "websocket_clients": len(self._websockets),
                "events_published": self._event_count,
                "buffered_events": len(self._events),
                "started_at": self._started_at,
            }


HUB = EcosystemHub()

