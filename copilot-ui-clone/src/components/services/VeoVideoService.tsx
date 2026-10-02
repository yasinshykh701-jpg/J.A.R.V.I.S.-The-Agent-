import React, { useState } from 'react';
import { Video, Sparkles, Upload, Play, Download, RefreshCw, X, Image as ImageIcon, Film } from 'lucide-react';

interface VeoVideoServiceProps {
  onClose?: () => void;
  onSetWallpaper?: (videoUrl: string) => void;
  attachedPhotoUrl?: string | null;
}

export function VeoVideoService({ onClose, onSetWallpaper, attachedPhotoUrl }: VeoVideoServiceProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [mode, setMode] = useState<'text' | 'image'>(attachedPhotoUrl ? 'image' : 'text');
  const [photoPreview, setPhotoPreview] = useState<string | null>(attachedPhotoUrl || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusStep, setStatusStep] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<{ src: string; mimeType: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
      setMode('image');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (mode === 'text' && !prompt.trim()) {
      setErrorMsg('Please enter a video prompt description.');
      return;
    }
    if (mode === 'image' && !photoPreview) {
      setErrorMsg('Please upload a photo to animate.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setStatusStep('Initializing Veo 3 Neural Engine...');

    try {
      const stepTimer1 = setTimeout(() => setStatusStep('Synthesizing dynamic motion & camera trajectories with veo-3.1-fast-generate-preview...'), 2000);
      const stepTimer2 = setTimeout(() => setStatusStep('Rendering high-fidelity frames (' + aspectRatio + ')...'), 5000);

      const payload: any = {
        prompt: prompt.trim() || (photoPreview ? 'Animate this photo with cinematic, fluid motion' : 'Cinematic scenic footage'),
        aspectRatio
      };

      if (mode === 'image' && photoPreview) {
        payload.imageBase64 = photoPreview;
        payload.mimeType = 'image/png';
      }

      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();

      if (data.video) {
        setGeneratedVideo({
          src: `data:${data.mimeType || 'video/mp4'};base64,${data.video}`,
          mimeType: data.mimeType || 'video/mp4'
        });
        setIsGenerating(false);
        setStatusStep('');
      } else if (data.videoUrl) {
        setGeneratedVideo({
          src: data.videoUrl,
          mimeType: 'video/mp4'
        });
        setIsGenerating(false);
        setStatusStep('');
      } else if (data.status === 'processing' && data.operationName) {
        setStatusStep('Veo 3 generation in progress. Rendering will stream shortly...');
        
        // Poll for completion
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch('/api/video-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName: data.operationName })
            });
            const statusData = await statusRes.json();
            
            if (statusData.done && statusData.video) {
              clearInterval(pollInterval);
              setGeneratedVideo({
                src: `data:${statusData.mimeType || 'video/mp4'};base64,${statusData.video}`,
                mimeType: statusData.mimeType || 'video/mp4'
              });
              setIsGenerating(false);
              setStatusStep('');
            } else if (statusData.error) {
              clearInterval(pollInterval);
              setErrorMsg(statusData.error);
              setIsGenerating(false);
              setStatusStep('');
            }
          } catch (pollErr: any) {
            clearInterval(pollInterval);
            setErrorMsg(pollErr.message || 'Polling failed.');
            setIsGenerating(false);
            setStatusStep('');
          }
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to synthesize video.');
      }
    } catch (err: any) {
      console.error('Veo generation error:', err);
      setErrorMsg(err.message || 'Video generation failed. Please try again.');
      setIsGenerating(false);
      setStatusStep('');
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-4 flex flex-col gap-3 text-white backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Video size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide uppercase text-white">Veo 3 Video Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                veo-3.1-fast-generate-preview
              </span>
            </div>
            <p className="text-[11px] text-white/60">Generate video from text or animate photos into video</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('text')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
            mode === 'text'
              ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-sm'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Sparkles size={13} />
          Generate video from text
        </button>

        <button
          type="button"
          onClick={() => setMode('image')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
            mode === 'image'
              ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-sm'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Film size={13} />
          Animate images into video
        </button>
      </div>

      {/* Photo Uploader (if Animate Photo Mode) */}
      {mode === 'image' && (
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
          {photoPreview ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-cyan-400/40 shrink-0">
              <img src={photoPreview} alt="Preview to animate" className="w-full h-full object-cover" />
              <button
                onClick={() => setPhotoPreview(null)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center text-[10px]"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="w-16 h-16 rounded-lg border-2 border-dashed border-cyan-400/40 hover:border-cyan-400 bg-cyan-950/20 flex flex-col items-center justify-center text-cyan-300 cursor-pointer transition-colors shrink-0">
              <Upload size={18} />
              <span className="text-[9px] mt-1">Photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
          <div className="text-xs text-white/70">
            <span className="font-semibold text-white">Animate Photo with Veo:</span>
            <p className="text-[11px] text-white/50">Upload any photo or character to synthesize dynamic cinematic motion.</p>
          </div>
        </div>
      )}

      {/* Prompt input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] text-white/70 font-medium">
          {mode === 'image' ? 'Motion / Animation Directions (optional):' : 'Video Prompt:'}
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === 'image'
              ? 'e.g. Animate with gentle wind blowing, cinematic camera pan...'
              : 'e.g. A serene bamboo forest with a panda practicing martial arts at sunset, 4k cinematic...'
          }
          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-white/35 focus:outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Aspect Ratio & Action Button */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-white/60 mr-1">Aspect Ratio:</span>
          <button
            type="button"
            onClick={() => setAspectRatio('16:9')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
              aspectRatio === '16:9'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            16:9 (Landscape)
          </button>
          <button
            type="button"
            onClick={() => setAspectRatio('9:16')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
              aspectRatio === '9:16'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            9:16 (Portrait)
          </button>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play size={13} fill="currentColor" />
              Generate with Veo 3
            </>
          )}
        </button>
      </div>

      {/* Status & Error Messages */}
      {statusStep && (
        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          {statusStep}
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Generated Video Player */}
      {generatedVideo && (
        <div className="mt-2 flex flex-col gap-2 p-2.5 rounded-xl bg-black/60 border border-cyan-400/40">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-medium pb-1 border-b border-white/10">
            <span>Generated Video Preview ({aspectRatio})</span>
            <div className="flex items-center gap-2">
              <a
                href={generatedVideo.src}
                download="veo3-generated-video.mp4"
                className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Download size={12} /> Download
              </a>
              {onSetWallpaper && (
                <button
                  onClick={() => onSetWallpaper(generatedVideo.src)}
                  className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-[11px] flex items-center gap-1 cursor-pointer border border-cyan-400/30"
                >
                  Set as Live Wallpaper
                </button>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center bg-black rounded-lg overflow-hidden max-h-56">
            <video
              src={generatedVideo.src}
              controls
              autoPlay
              loop
              className={`max-h-56 w-auto rounded-lg object-contain ${aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
