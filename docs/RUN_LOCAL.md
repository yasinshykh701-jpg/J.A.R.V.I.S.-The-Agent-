# Run J.A.R.V.I.S. Hub Locally (`app-8sm6282ej0n5`)

This React app is the frontend hub. The Python gateway in `server/jarvis_unified.py` connects sibling folders under `D:\J.A.R.V.I.S`:

- `SYSTEM CONTROL ON VOICE/Jarvis` — voice commands (`POST /voice`)
- `JARVIS/voice` — fallback voice package
- `JARVIS/rag` — RAG / image generation scripts
- `Zevorix LLM Engine 1.0` — RAG chain (`POST /rag`, used by `/chat` when relevant)
- `image egeneration/image-rag-pipeline` — image pipeline path
- `SYSTEM CONTROL ON VOICE/Jarvis/iot_server` — IoT FastAPI service (`8010`)

Auth (`/signup`, `/login`) and JARVIS (`/chat`, `/image`, …) share **one process on port 8000**.

## Prerequisites

- Node.js 18+ and npm (or pnpm)
- Python 3.11+ on `PATH`
- Optional: Ollama / HuggingFace deps for full RAG answers

## Install

```powershell
cd D:\J.A.R.V.I.S\app-8sm6282ej0n5
npm install
```

`.env` should include:

```env
VITE_JARVIS_URL=http://127.0.0.1:8000
VITE_SQLITE_AUTH_URL=http://127.0.0.1:8000
```

Optional: set `JARVIS_WORKSPACE=D:\J.A.R.V.I.S` if the hub is moved.

## Run everything (recommended on Windows)

From PowerShell:

```powershell
cd D:\J.A.R.V.I.S\app-8sm6282ej0n5
npm install
python -m pip install -r requirements.txt
python -m pip install -r "D:\J.A.R.V.I.S\SYSTEM CONTROL ON VOICE\Jarvis\requirements.txt"
npm run start:all
```

`npm run start:all` starts and connects:

| Service | URL | Role |
| --- | --- | --- |
| React/Vite frontend | http://127.0.0.1:5173 | Browser UI |
| J.A.R.V.I.S gateway | http://127.0.0.1:8000 | Auth, chat, voice, image, orchestration |
| Zevorix | http://127.0.0.1:8001 | Local LLM/RAG |
| IoT FastAPI | http://127.0.0.1:8010 | USB, Wi-Fi/HTTP, MQTT device API |

The Vite frontend proxies `/jarvis` to port 8000, `/zevorix` to port 8001,
and `/iot` to port 8010, so browser code should use those paths instead of
hard-coding backend URLs.

## Run manually (separate terminals)

```powershell
## Terminal 1 — unified gateway
cd D:\J.A.R.V.I.S\app-8sm6282ej0n5
npm run jarvis:unified

## Terminal 2 — Zevorix FastAPI
cd "D:\J.A.R.V.I.S\Zevorix LLM Engine 1.0"
python server.py --host 127.0.0.1 --port 8001

## Terminal 3 — IoT FastAPI
cd "D:\J.A.R.V.I.S\SYSTEM CONTROL ON VOICE\Jarvis\iot_server"
python -m uvicorn main:app --host 127.0.0.1 --port 8010

## Terminal 4 — frontend
cd D:\J.A.R.V.I.S\app-8sm6282ej0n5
npm run dev
```

Or use the repository batch launcher:

```powershell
cd D:\J.A.R.V.I.S
.\START_JARVIS.bat
```

Open the Vite URL (usually `http://localhost:5173`).

## Health check

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
Invoke-RestMethod http://127.0.0.1:8010/health
```

You should see `status: ok`, workspace path, and which modules are available.

## API quick test

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/chat `
  -ContentType application/json -Body '{"message":"status","username":"demo"}'

Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/signup `
  -ContentType application/json -Body '{"username":"demo","password":"secret1"}'
```

## Notes

- Do **not** run `auth:server` and `jarvis:unified` together — both would bind port 8000.
- Do **not** start the IoT service twice — port 8010 must have one owner.
- If RAG deps or vector store are missing, `/chat` still answers via the local rule-based brain; `/rag` returns a clear error with a hint.
- Full image training remains in `JARVIS/rag/image_generation.py`; `/image` returns a concept placeholder when heavy models are not loaded.
