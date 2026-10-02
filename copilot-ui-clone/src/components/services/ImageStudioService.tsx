import React, { useState } from 'react';
import { Palette, Sparkles, Upload, Download, RefreshCw, X, Video, Sliders } from 'lucide-react';

interface ImageStudioServiceProps {
  onClose?: () => void;
  onAnimateWithVeo?: (imageUrl: string) => void;
  attachedImageUrl?: string | null;
}

export function ImageStudioService({ onClose, onAnimateWithVeo, attachedImageUrl }: ImageStudioServiceProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [mode, setMode] = useState<'create' | 'edit'>(attachedImageUrl ? 'edit' : 'create');
  const [baseImage, setBaseImage] = useState<string | null>(attachedImageUrl || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBaseImage(reader.result as string);
      setMode('edit');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a prompt to create or edit the image.');
      return;
    }
    if (mode === 'edit' && !baseImage) {
      setErrorMsg('Please upload a base image to edit.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const payload: any = {
        prompt: prompt.trim(),
        aspectRatio
      };

      if (mode === 'edit' && baseImage) {
        payload.baseImage = baseImage;
      }

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.image) {
        setGeneratedImage(`data:${data.mimeType || 'image/png'};base64,${data.image}`);
      } else if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err: any) {
      console.error('Image generation error:', err);
      setErrorMsg(err.message || 'Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-3 text-white backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Palette size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide uppercase text-white">Image Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                gemini-3.1-flash-image-preview
              </span>
            </div>
            <p className="text-[11px] text-white/60">Create new images or edit existing photos with text prompts</p>
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
          onClick={() => setMode('create')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
            mode === 'create'
              ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-sm'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Sparkles size={13} />
          Create New Image
        </button>

        <button
          type="button"
          onClick={() => setMode('edit')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
            mode === 'edit'
              ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-sm'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Sliders size={13} />
          Edit Existing Photo
        </button>
      </div>

      {/* Upload Base Image (if in edit mode) */}
      {mode === 'edit' && (
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
          {baseImage ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-400/40 shrink-0">
              <img src={baseImage} alt="Base for edit" className="w-full h-full object-cover" />
              <button
                onClick={() => setBaseImage(null)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center text-[10px]"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="w-16 h-16 rounded-lg border-2 border-dashed border-amber-400/40 hover:border-amber-400 bg-amber-950/20 flex flex-col items-center justify-center text-amber-300 cursor-pointer transition-colors shrink-0">
              <Upload size={18} />
              <span className="text-[9px] mt-1">Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
          <div className="text-xs text-white/70">
            <span className="font-semibold text-white">Base Image for Editing:</span>
            <p className="text-[11px] text-white/50">Upload an image, then describe modifications (e.g. "Add sunglasses", "Make background cyberpunk").</p>
          </div>
        </div>
      )}

      {/* Prompt input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] text-white/70 font-medium">
          {mode === 'edit' ? 'Edit Instructions (Prompt):' : 'Image Description (Prompt):'}
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === 'edit'
              ? 'e.g. Add a glowing mystical dragon aura and change background to starlight...'
              : 'e.g. A majestic panda master standing on a mountain peak in watercolor style, 4k...'
          }
          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-white/35 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Aspect Ratio Selector & Action Button */}
      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-white/60 mr-1">Aspect:</span>
          {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setAspectRatio(ratio)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                aspectRatio === ratio
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              Synthesizing Image...
            </>
          ) : (
            <>
              <Sparkles size={13} />
              {mode === 'edit' ? 'Apply Image Edit' : 'Create Image'}
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Result Display */}
      {generatedImage && (
        <div className="mt-2 flex flex-col gap-2 p-2.5 rounded-xl bg-black/60 border border-amber-400/40">
          <div className="flex items-center justify-between text-xs text-amber-300 font-medium pb-1 border-b border-white/10">
            <span>Result ({aspectRatio})</span>
            <div className="flex items-center gap-2">
              <a
                href={generatedImage}
                download="gemini-generated-image.png"
                className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Download size={12} /> Download
              </a>
              <button
                onClick={() => {
                  setBaseImage(generatedImage);
                  setMode('edit');
                  setPrompt('');
                }}
                className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Sliders size={12} /> Edit This
              </button>
              {onAnimateWithVeo && (
                <button
                  onClick={() => onAnimateWithVeo(generatedImage)}
                  className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-[11px] flex items-center gap-1 cursor-pointer border border-cyan-400/30"
                >
                  <Video size={12} /> Animate with Veo 3
                </button>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center bg-black rounded-lg overflow-hidden max-h-56">
            <img
              src={generatedImage}
              alt="Generated visual"
              className="max-h-56 w-auto rounded-lg object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
