"""Resolve sibling JARVIS workspace folders relative to this app hub."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any


def get_app_root() -> Path:
    """Return the React hub root (app-8sm6282ej0n5)."""
    return Path(__file__).resolve().parent.parent


def get_workspace_root() -> Path:
    """
    Return D:\\J.A.R.V.I.S (parent of the hub), or JARVIS_WORKSPACE if set.
    """
    override = os.environ.get("JARVIS_WORKSPACE", "").strip()
    if override:
        return Path(override).resolve()
    return Path(__file__).resolve().parents[2]


def module_paths(workspace: Path | None = None) -> dict[str, Path]:
    root = workspace or get_workspace_root()
    return {
        "workspace": root,
        "app": get_app_root(),
        "system_voice": root / "SYSTEM CONTROL ON VOICE" / "Jarvis",
        "jarvis_voice": root / "JARVIS" / "voice",
        "jarvis_rag": root / "JARVIS" / "rag",
        "jarvis_image": root / "JARVIS" / "image",
        "zevorix": root / "Zevorix LLM Engine 1.0",
        "image_pipeline": root / "image egeneration" / "image-rag-pipeline",
    }


def existing_module_status(workspace: Path | None = None) -> dict[str, dict[str, Any]]:
    """Map module name -> {path, available} for /health."""
    paths = module_paths(workspace)
    keys = (
        "system_voice",
        "jarvis_voice",
        "jarvis_rag",
        "jarvis_image",
        "zevorix",
        "image_pipeline",
    )
    status: dict[str, dict[str, Any]] = {}
    for key in keys:
        path = paths[key]
        status[key] = {
            "path": str(path),
            "available": path.exists(),
        }
    status["workspace"] = {
        "path": str(paths["workspace"]),
        "available": paths["workspace"].exists(),
    }
    status["app"] = {
        "path": str(paths["app"]),
        "available": paths["app"].exists(),
    }
    return status


def voice_package_root(workspace: Path | None = None) -> Path | None:
    """Prefer System Control voice; fall back to JARVIS/voice. Only one to avoid clashes."""
    paths = module_paths(workspace)
    if paths["system_voice"].exists():
        return paths["system_voice"]
    if paths["jarvis_voice"].exists():
        return paths["jarvis_voice"]
    return None


def python_path_entries(workspace: Path | None = None) -> list[Path]:
    """
    Safe default sys.path entries (no Zevorix — its src/utils.py shadows voice utils/).
    Zevorix is added only inside RAG helpers.
    """
    paths = module_paths(workspace)
    ordered: list[Path] = []
    voice = voice_package_root(workspace)
    if voice is not None:
        ordered.append(voice)
    ordered.extend(
        [
            paths["jarvis_rag"],
            paths["jarvis_image"],
            paths["image_pipeline"],
            Path(__file__).resolve().parent,  # local server/ (auth, brain)
        ]
    )
    seen: set[str] = set()
    result: list[Path] = []
    for entry in ordered:
        if not entry.exists():
            continue
        key = str(entry.resolve())
        if key in seen:
            continue
        seen.add(key)
        result.append(entry)
    return result


def apply_sys_path(sys_module: Any, workspace: Path | None = None) -> list[str]:
    """Insert existing module roots onto sys.path. Returns paths added."""
    added: list[str] = []
    for entry in python_path_entries(workspace):
        text = str(entry)
        if text not in sys_module.path:
            sys_module.path.insert(0, text)
            added.append(text)
    return added
