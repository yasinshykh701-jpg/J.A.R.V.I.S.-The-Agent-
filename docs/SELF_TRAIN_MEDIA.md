# Kling + self-train media pipeline

## Goal

1. Use **Kling** API keys for best cloud video generation.
2. **Store** successful outputs as training data (video/image + captions + RAG notes).
3. If **balance is insufficient** or **API key errors** occur → use local **RAG pipeline** and local **video/image** models, and still index the prompt/assets for self-training.

## Configure Kling

In `app-8sm6282ej0n5/.env` (loaded by your shell before `python server/jarvis_unified.py`):

```env
KLING_ACCESS_KEY=your_access_key
KLING_SECRET_KEY=your_secret_key
KLING_VIDEO_MODEL=kling-v1
KLING_MODE=std
```

On Windows PowerShell you can also set them for the current session:

```powershell
$env:KLING_ACCESS_KEY="..."
$env:KLING_SECRET_KEY="..."
npm run jarvis:unified
```

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/media/video` | Kling first → store → local fallback |
| POST | `/media/image` | Kling image (if available) → local store |
| GET | `/media/train-status` | Counts of stored training assets |
| POST | `/image` | Image with `self_train=1` (default) |

Example:

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/media/video `
  -ContentType application/json `
  -Body '{"prompt":"a robot walking in rain","duration":"5"}'
```

## Where data is stored

- Videos: `Zevorix LLM Engine 1.0/data/video_generation/training_videos/`
- Video captions CSV: `.../video_captions.csv`
- Images: `Zevorix LLM Engine 1.0/data/image_generation/training_images/`
- RAG notes: `JARVIS/rag/data/self_train/`
- Index: `app-8sm6282ej0n5/server/training_store/media_index.jsonl`

## Frontend

`VideoGenerationPageNew` still tries Sora first. On balance/API/network failure it calls the hub `/media/video` path (Kling → local self-train).

## Local retrain (optional)

After enough Kling (or fallback) samples accumulate:

```powershell
cd "D:\J.A.R.V.I.S\Zevorix LLM Engine 1.0"
python -c "from src.video_gen import VideoGeneratorTrainer; VideoGeneratorTrainer().train()"
```

(Exact train entrypoint may vary; see `JARVIS/rag/video_generation.py` / Zevorix `src/video_gen.py`.)
