"""Small HMAC access-token helper for local clients and the gateway.

Production deployments should replace this implementation with an OIDC/JWT
issuer, but the wire format stays compatible with Bearer authentication.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
from typing import Any


TOKEN_SECRET = os.environ.get("JARVIS_AUTH_SECRET", os.environ.get("JARVIS_HUB_SECRET", "change-me-in-production")).encode()
TOKEN_TTL_SECONDS = int(os.environ.get("JARVIS_TOKEN_TTL_SECONDS", "86400"))


def issue_access_token(username: str) -> str:
    payload = {"sub": username, "iat": int(time.time()), "exp": int(time.time()) + TOKEN_TTL_SECONDS}
    encoded = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).rstrip(b"=")
    signature = hmac.new(TOKEN_SECRET, encoded, hashlib.sha256).digest()
    return encoded.decode() + "." + base64.urlsafe_b64encode(signature).rstrip(b"=").decode()


def verify_access_token(token: str | None) -> dict[str, Any] | None:
    if not token or "." not in token:
        return None
    encoded, supplied = token.split(".", 1)
    expected = base64.urlsafe_b64encode(hmac.new(TOKEN_SECRET, encoded.encode(), hashlib.sha256).digest()).rstrip(b"=").decode()
    if not hmac.compare_digest(supplied, expected):
        return None
    try:
        payload = json.loads(base64.urlsafe_b64decode(encoded + "==="))
    except (ValueError, json.JSONDecodeError):
        return None
    if int(payload.get("exp", 0)) < int(time.time()):
        return None
    return payload
