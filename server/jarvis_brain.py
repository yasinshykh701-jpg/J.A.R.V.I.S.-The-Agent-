from __future__ import annotations

import hashlib
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

WORKSPACE_ROOT = Path(
    os.environ.get("JARVIS_WORKSPACE", str(Path(__file__).resolve().parents[2]))
).resolve()
GENERATED_DIR = WORKSPACE_ROOT / "server" / "generated"
GENERATED_DIR.mkdir(parents=True, exist_ok=True)
IMAGE_RAG_GENERATED_DIR = (
    WORKSPACE_ROOT / "image egeneration" / "image-rag-pipeline" / "storage" / "images" / "generated"
)
IMAGE_RAG_GENERATED_DIR.mkdir(parents=True, exist_ok=True)

HOST = os.environ.get("AUTH_HOST", "127.0.0.1")
PORT = int(os.environ.get("AUTH_PORT", "8000"))


def build_jarvis_response(message: str, username: str | None = None) -> dict[str, Any]:
    text = (message or "").strip()
    lowered = text.lower()

    if not text:
        reply = "J.A.R.V.I.S. is online and ready for your next command."
    elif any(keyword in lowered for keyword in ["who are you", "what are you", "your name"]):
        reply = (
            "I am J.A.R.V.I.S., your local AI companion. "
            "I connect the frontend, authentication, and local brain modules into one cohesive assistant."
        )
    elif any(keyword in lowered for keyword in ["status", "health", "online", "ready"]):
        reply = "J.A.R.V.I.S. is online, healthy, and ready to assist with chat, planning, and generation tasks."
    elif any(keyword in lowered for keyword in ["image", "generate", "design", "visual"]):
        reply = (
            "I can help you create visual concepts and image prompts. "
            "Send me a scene, style, or product idea and I will generate a concept card for it."
        )
    elif any(keyword in lowered for keyword in ["voice", "speech", "talk"]):
        reply = "Voice and speech workflows are enabled in the assistant layer for future hands-free control."
    elif any(keyword in lowered for keyword in ["creator", "made you", "built you"]):
        reply = "I was assembled as a local J.A.R.V.I.S. integration for this workspace, combining the frontend UI with backend services and AI modules."
    else:
        reply = (
            f"J.A.R.V.I.S. is processing your request in local brain mode. "
            f"I can help with planning, summarizing, coding, and creative generation."
        )

    if username:
        reply += f" Welcome back, {username}."

    return {
        "response": reply,
        "mode": "local-brain",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def generate_placeholder_image(prompt: str) -> dict[str, Any]:
    text = (prompt or "J.A.R.V.I.S. concept").strip()
    safe_name = re.sub(r"[^a-zA-Z0-9._-]+", "-", text.lower()).strip("-") or "jarvis-concept"
    digest = hashlib.md5(text.encode("utf-8")).hexdigest()[:8]
    filename = f"{safe_name}-{digest}.svg"
    output_path = IMAGE_RAG_GENERATED_DIR / filename

    svg = f"""<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
  <rect width='1200' height='800' fill='#050816'/>
  <rect x='60' y='60' width='1080' height='680' rx='36' fill='url(#g)'/>
  <circle cx='310' cy='300' r='160' fill='#22d3ee' opacity='0.45'/>
  <circle cx='780' cy='270' r='190' fill='#8b5cf6' opacity='0.3'/>
  <rect x='180' y='480' width='840' height='120' rx='24' fill='rgba(255,255,255,0.12)' stroke='rgba(255,255,255,0.42)'/>
  <text x='220' y='240' fill='white' font-size='56' font-family='Segoe UI, Arial, sans-serif'>J.A.R.V.I.S.</text>
  <text x='220' y='320' fill='#e2e8f0' font-size='28' font-family='Segoe UI, Arial, sans-serif'>Concept: {text}</text>
  <text x='220' y='560' fill='white' font-size='34' font-family='Segoe UI, Arial, sans-serif'>Local AI generation ready</text>
  <defs>
    <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#0f172a'/>
      <stop offset='100%' stop-color='#1d4ed8'/>
    </linearGradient>
  </defs>
</svg>"""

    output_path.write_text(svg, encoding="utf-8")
    image_url = f"/image-rag/generated/{filename}"
    return {
        "success": True,
        "image_url": image_url,
        "filename": filename,
        "prompt": text,
    }
