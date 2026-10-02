#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import hmac
import json
import os
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from access_tokens import issue_access_token
from urllib.parse import urlparse


DB_PATH = os.environ.get("AUTH_DB_PATH", str(Path(__file__).resolve().parent / "auth.db"))
HOST = os.environ.get("AUTH_HOST", "0.0.0.0")
PORT = int(os.environ.get("AUTH_PORT", "8000"))

CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    success INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


def get_connection(db_path: str | None = None) -> sqlite3.Connection:
    connection = sqlite3.connect(db_path or DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db(db_path: str | None = None) -> None:
    connection = get_connection(db_path)
    connection.executescript(CREATE_TABLES_SQL)
    connection.commit()
    connection.close()


def _normalize_username(username: str) -> str:
    return username.strip().lower()


def _hash_password(password: str) -> str:
    salt = os.urandom(16)
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return json.dumps({
        "salt": salt.hex(),
        "hash": derived.hex(),
        "iterations": 100_000,
    })


def _verify_password(password: str, stored_hash: str) -> bool:
    payload = json.loads(stored_hash)
    derived = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(payload["salt"]),
        payload["iterations"],
    )
    return hmac.compare_digest(derived.hex(), payload["hash"])


def create_user(username: str, password: str, db_path: str | None = None) -> dict[str, Any]:
    init_db(db_path)
    normalized_username = _normalize_username(username)

    if not normalized_username or len(password) < 6:
        return {"success": False, "error": "Username and password must be provided"}

    connection = get_connection(db_path)
    try:
        connection.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (normalized_username, _hash_password(password)),
        )
        connection.commit()
        return {"success": True, "username": normalized_username}
    except sqlite3.IntegrityError:
        return {"success": False, "error": "User already exists"}
    finally:
        connection.close()


def authenticate_user(username: str, password: str, db_path: str | None = None) -> dict[str, Any]:
    init_db(db_path)
    normalized_username = _normalize_username(username)
    connection = get_connection(db_path)

    try:
        row = connection.execute(
            "SELECT password_hash FROM users WHERE username = ?",
            (normalized_username,),
        ).fetchone()

        if row is None:
            connection.execute(
                "INSERT INTO login_events (username, success) VALUES (?, ?)",
                (normalized_username, 0),
            )
            connection.commit()
            return {"success": False, "error": "Invalid credentials"}

        success = _verify_password(password, row["password_hash"])
        connection.execute(
            "INSERT INTO login_events (username, success) VALUES (?, ?)",
            (normalized_username, int(success)),
        )
        connection.commit()

        if success:
            return {
                "success": True,
                "username": normalized_username,
                "access_token": issue_access_token(normalized_username),
                "token_type": "Bearer",
            }

        return {"success": False, "error": "Invalid credentials"}
    finally:
        connection.close()


class AuthRequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/health":
            self._send_json(200, {"status": "ok"})
            return

        self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)

        if parsed.path not in {"/signup", "/login"}:
            self._send_json(404, {"error": "Not found"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(content_length).decode("utf-8") or "{}"
            payload = json.loads(body)
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON body"})
            return

        username = str(payload.get("username", "")).strip()
        password = str(payload.get("password", "")).strip()

        if parsed.path == "/signup":
            result = create_user(username, password)
            if result["success"]:
                self._send_json(201, result)
            else:
                self._send_json(409, result)
            return

        result = authenticate_user(username, password)
        if result["success"]:
            self._send_json(200, result)
        else:
            self._send_json(401, result)


def run_server() -> None:
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), AuthRequestHandler)
    print(f"SQLite auth server listening on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
