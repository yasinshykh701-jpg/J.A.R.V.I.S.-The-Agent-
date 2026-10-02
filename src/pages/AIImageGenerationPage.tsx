/**
 * J.A.R.V.I.S — AI Image Generation
 *
 * Includes all 5 image generation models:
 *  1. Kling AI           — Fast cloud (Supabase)
 *  2. Gemini Advanced    — Google AI (Supabase)
 *  3. Omni-Image         — Cloud model (Supabase)
 *  4. Image RAG Pipeline — D:\J.A.R.V.I.S\image egeneration  (local backend)
 *  5. Zevorix VAE        — D:\J.A.R.V.I.S\Zevorix LLM Engine 1.0  (local backend)
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ImageIcon, Loader2, Download, CheckCircle2, AlertCircle,
  Upload, Zap, Brain, Cpu, Server, Sparkles, X,
} from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import { supabase } from '@/services/aiServices';
import jarvisApi from '@/services/jarvisBackend';

/* ─── Model definitions ─────────────────────────────────────── */

type ModelId = 'kling' | 'advanced' | 'omni-image' | 'image-rag' | 'zevorix-vae';

interface Model {
  id:          ModelId;
  name:        string;
  subtitle:    string;
  description: string;
  icon:        React.ElementType;
  accent:      string;
  badge:       string;
  local:       boolean;  // requires local backend
  backend?:    string;   // folder description
}

const MODELS: Model[] = [
  {
    id: 'kling',
    name: 'Kling AI',
    subtitle: '⚡ Fast · 1-5 min',
    description: 'High-quality cloud image generation. Fast and reliable.',
    icon: Zap,
    accent: '#00c8ff',
    badge: 'Cloud',
    local: false,
  },
  {
    id: 'advanced',
    name: 'Gemini Advanced',
    subtitle: 'Google AI · Multimodal',
    description: 'Google Gemini AI with image + text understanding.',
    icon: Sparkles,
    accent: '#8b5cf6',
    badge: 'Cloud',
    local: false,
  },
  {
    id: 'omni-image',
    name: 'Omni-Image',
    subtitle: 'High quality · 1-5 min',
    description: 'Premium image generation with reference support.',
    icon: ImageIcon,
    accent: '#f59e0b',
    badge: 'Cloud',
    local: false,
  },
  {
    id: 'image-rag',
    name: 'Image RAG Pipeline',
    subtitle: 'Local · FastAPI · RAG',
    description: 'Prompt-engineered image generation via retrieval-augmented pipeline. Runs locally.',
    icon: Brain,
    accent: '#10b981',
    badge: 'Local',
    local: true,
    backend: 'D:\\J.A.R.V.I.S\\image egeneration\\image-rag-pipeline',
  },
  {
    id: 'zevorix-vae',
    name: 'Zevorix VAE',
    subtitle: 'Local · Text-Conditioned VAE',
    description: 'Zevorix LLM Engine 1.0 — local text-conditioned VAE image generator. No API key needed.',
    icon: Cpu,
    accent: '#f43f5e',
    badge: 'Local',
    local: true,
    backend: 'D:\\J.A.R.V.I.S\\Zevorix LLM Engine 1.0',
  },
];

/* ─── Component ─────────────────────────────────────────────── */

export default function AIImageGenerationPage() {
  const [selectedModel, setSelectedModel] = useState<ModelId>('image-rag');
  const [prompt,        setPrompt]        = useState('');
  const [resolution,    setResolution]    = useState('1k');
  const [aspectRatio,   setAspectRatio]   = useState('16:9');
  const [isGenerating,  setIsGenerating]  = useState(false);
  const [imageUrl,      setImageUrl]      = useState<string | null>(null);
  const [imageBlob,     setImageBlob]     = useState<string | null>(null); // base64 for local models
  const [status,        setStatus]        = useState<'idle'|'generating'|'completed'|'failed'>('idle');
  const [progress,      setProgress]      = useState(0);
  const [refImage,      setRefImage]      = useState<string | null>(null);
  const [errorMsg,      setErrorMsg]      = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const model = MODELS.find(m => m.id === selectedModel)!;

  /* ─── Cloud model helpers ─────────────────────────────────── */

  const pollKling = (id: string) => {
    let attempts = 0;
    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('kling-image-query', { body: { task_id: id } });
        if (error) throw error;
        setProgress(Math.min(95, (attempts / 48) * 100));
        if (data?.data?.task_status === 'succeed') {
          setImageUrl(data.data.task_result.images[0].url);
          setStatus('completed'); setProgress(100); toast.success('Image ready!');
        } else if (data?.data?.task_status === 'failed') {
          throw new Error('Generation failed');
        } else if (++attempts < 48) setTimeout(poll, 5000);
        else throw new Error('Timeout');
      } catch (e: any) { setStatus('failed'); setErrorMsg(e.message); toast.error(e.message); }
    };
    poll();
  };

  const pollAdvanced = (id: string) => {
    let attempts = 0;
    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('advanced-image-query', { body: { taskId: id } });
        if (error) throw error;
        setProgress(Math.min(95, (attempts / 48) * 100));
        if (data?.data?.status === 'SUCCESS') {
          const raw = data.data.result.candidates[0].content.parts[0].text;
          const match = raw.match(/!\[image\]\((data:image\/[^;]+;base64,[^)]+)\)/);
          if (!match) throw new Error('Invalid format');
          setImageUrl(match[1]); setStatus('completed'); setProgress(100); toast.success('Image ready!');
        } else if (data?.data?.status === 'FAILED') {
          throw new Error('Generation failed');
        } else if (++attempts < 48) setTimeout(poll, 5000);
        else throw new Error('Timeout');
      } catch (e: any) { setStatus('failed'); setErrorMsg(e.message); toast.error(e.message); }
    };
    poll();
  };

  const pollOmni = (id: string) => {
    let attempts = 0;
    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('omni-image-query', { body: { task_id: id } });
        if (error) throw error;
        setProgress(Math.min(95, (attempts / 48) * 100));
        if (data?.data?.task_status === 'succeed') {
          setImageUrl(data.data.task_result.images[0].url); setStatus('completed'); setProgress(100); toast.success('Image ready!');
        } else if (data?.data?.task_status === 'failed') {
          throw new Error('Generation failed');
        } else if (++attempts < 48) setTimeout(poll, 5000);
        else throw new Error('Timeout');
      } catch (e: any) { setStatus('failed'); setErrorMsg(e.message); toast.error(e.message); }
    };
    poll();
  };

  /* ─── Generate ────────────────────────────────────────────── */

  const generate = async () => {
    if (!prompt.trim()) { toast.error('Enter an image description'); return; }
    setIsGenerating(true); setStatus('generating'); setProgress(5);
    setImageUrl(null); setImageBlob(null); setErrorMsg('');

    try {
      /* ── Cloud models ── */
      if (selectedModel === 'kling') {
        const body: Record<string, unknown> = { prompt, resolution, aspect_ratio: aspectRatio, n: 1 };
        if (refImage) { body.image = refImage; body.image_fidelity = 0.5; }
        const { data, error } = await supabase.functions.invoke('kling-image-create', { body });
        if (error) throw error;
        if (!data?.data?.task_id) throw new Error('No task ID');
        toast.success('⚡ Kling AI generating…'); pollKling(data.data.task_id);
        return;
      }

      if (selectedModel === 'advanced') {
        const parts: unknown[] = [];
        if (refImage) {
          const b64 = refImage.split(',')[1];
          const mime = refImage.match(/data:([^;]+);/)?.[1] ?? 'image/png';
          parts.push({ inline_data: { mime_type: mime, data: b64 } });
        }
        parts.push({ text: prompt });
        const { data, error } = await supabase.functions.invoke('advanced-image-submit', { body: { contents: [{ parts }] } });
        if (error) throw error;
        if (!data?.data?.taskId) throw new Error('No task ID');
        toast.success('Gemini generating…'); pollAdvanced(data.data.taskId);
        return;
      }

      if (selectedModel === 'omni-image') {
        const body: Record<string, unknown> = { prompt, resolution, aspect_ratio: aspectRatio, n: 1, result_type: 'single' };
        if (refImage) body.image_list = [{ image: refImage }];
        const { data, error } = await supabase.functions.invoke('omni-image-create', { body });
        if (error) throw error;
        if (!data?.data?.task_id) throw new Error('No task ID');
        toast.success('Omni-Image generating…'); pollOmni(data.data.task_id);
        return;
      }

      /* ── Local models via unified backend ── */
      if (selectedModel === 'image-rag') {
        setProgress(20);
        toast.info('📡 Sending to Image RAG Pipeline…');
        const res = await jarvisApi.image(prompt, true, refImage);
        setProgress(90);
        const url = res.image_url;
        if (url) {
          setImageUrl(url);
          setStatus('completed'); setProgress(100);
          toast.success('Image RAG Pipeline: image ready!');
        } else if (res.response) {
          setStatus('completed'); setProgress(100);
          toast.success(res.response);
        } else {
          throw new Error(res.error ?? 'Image RAG failed');
        }
        return;
      }

      if (selectedModel === 'zevorix-vae') {
        setProgress(20);
        toast.info('🔮 Sending to Zevorix VAE Engine…');
        const res = await jarvisApi.image(prompt, false);
        setProgress(90);
        if (res.image_url) {
          setImageUrl(res.image_url);
          setStatus('completed'); setProgress(100);
          toast.success('Zevorix VAE: image generated!');
        } else {
          throw new Error(res.error ?? 'Zevorix VAE generation failed');
        }
        return;
      }

    } catch (e: any) {
      setStatus('failed');
      setErrorMsg(e.message ?? 'Generation failed');
      toast.error(e.message ?? 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const download = () => {
    const url = imageUrl ?? imageBlob;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `JARVIS-image-${selectedModel}-${Date.now()}.png`;
    a.click();
    toast.success('Download started');
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be < 10 MB'); return; }
    const r = new FileReader();
    r.onload = ev => { setRefImage(ev.target?.result as string); toast.success('Reference image loaded'); };
    r.readAsDataURL(file);
  };

  /* ─── Render ─────────────────────────────────────────────── */

  return (
    <AppLayout>
      <BackToHome />
      <div className="h-full overflow-y-auto bg-[#020810]">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center"
              style={{ boxShadow:'0 0 20px rgba(0,200,255,0.5)' }}>
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-[0.12em] uppercase jarvis-gradient-text">
                Image Generation
              </h1>
              <p className="text-[8px] tracking-[0.3em] text-[#00c8ff60] uppercase">
                5 Models · Cloud + Local · Always Free
              </p>
            </div>
          </div>

          {/* ── Model selector ── */}
          <div>
            <p className="text-[9px] font-bold tracking-[0.3em] text-[#00c8ff70] uppercase mb-3">
              Select AI Model
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {MODELS.map(m => {
                const Icon = m.icon;
                const active = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setStatus('idle'); setImageUrl(null); setImageBlob(null); }}
                    className="relative text-left p-3.5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: active ? `${m.accent}14` : 'rgba(0,8,20,0.85)',
                      border: `1.5px solid ${active ? m.accent : 'rgba(255,255,255,0.07)'}`,
                      boxShadow: active ? `0 0 18px ${m.accent}30` : 'none',
                    }}
                  >
                    {/* Local badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                        style={{
                          background: m.local ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                          color: m.local ? '#34d399' : '#60a5fa',
                          border: `1px solid ${m.local ? 'rgba(52,211,153,0.3)' : 'rgba(96,165,250,0.3)'}`,
                        }}>
                        {m.badge}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                      style={{ background:`${m.accent}18`, border:`1px solid ${m.accent}40` }}>
                      <Icon className="w-4 h-4" style={{ color: m.accent }} />
                    </div>
                    <p className="text-[11px] font-bold text-white/90 leading-tight">{m.name}</p>
                    <p className="text-[8px] mt-0.5" style={{ color: m.accent }}>{m.subtitle}</p>
                    {m.local && (
                      <p className="text-[7px] mt-1 text-white/30 font-mono truncate"
                        title={m.backend}>{m.backend?.split('\\').slice(-2).join('\\')}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Local backend notice */}
          {model.local && (
            <div className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.25)' }}>
              <Server className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mb-1">
                  Local Model — Requires Backend
                </p>
                <p className="text-[9px] text-white/50 leading-relaxed">
                  Start the unified backend first: <code className="text-emerald-400 font-mono">npm run jarvis:unified</code>
                  {' '}or{' '}<code className="text-emerald-400 font-mono">python server/jarvis_unified.py</code>
                </p>
                <p className="text-[8px] text-white/35 mt-1 font-mono">{model.backend}</p>
              </div>
            </div>
          )}

          {/* Main two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ── Left: Input ── */}
            <div className="space-y-4 p-5 rounded-2xl"
              style={{ background:'rgba(0,8,20,0.85)', border:'1px solid rgba(0,200,255,0.15)' }}>

              <div>
                <Label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#00c8ff70] mb-2 block">
                  Prompt
                </Label>
                <Textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={
                    selectedModel === 'zevorix-vae'
                      ? 'Zevorix VAE: describe the visual concept (trained on your local images)…'
                      : selectedModel === 'image-rag'
                        ? 'Image RAG: describe what to generate — the pipeline will engineer the optimal prompt…'
                        : 'Describe the image you want to generate…'
                  }
                  rows={5}
                  className="resize-none bg-[#00050f] border-[#00c8ff20] text-white/85 placeholder:text-white/25 focus-visible:ring-[#00c8ff40] focus-visible:ring-1 rounded-xl text-sm"
                />
              </div>

              {/* Resolution + aspect — cloud models only */}
              {(selectedModel === 'kling' || selectedModel === 'omni-image') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#00c8ff70] mb-1.5 block">
                      Resolution
                    </Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger className="bg-[#00050f] border-[#00c8ff20] text-white/80 rounded-xl h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#00050f] border-[#00c8ff25]">
                        <SelectItem value="1k" className="text-white/80">1K (1024px)</SelectItem>
                        <SelectItem value="2k" className="text-white/80">2K (2048px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#00c8ff70] mb-1.5 block">
                      Aspect Ratio
                    </Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="bg-[#00050f] border-[#00c8ff20] text-white/80 rounded-xl h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#00050f] border-[#00c8ff25]">
                        {['16:9','9:16','1:1','4:3','3:4'].map(r => (
                          <SelectItem key={r} value={r} className="text-white/80">{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Reference image */}
              <div>
                <Label className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#00c8ff70] mb-1.5 block">
                  Reference Image (optional)
                </Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"
                    onClick={() => fileRef.current?.click()}
                    className="flex-1 border-[#00c8ff25] bg-[#00c8ff08] text-[#00c8ff80] hover:text-[#00c8ff] rounded-xl h-9 text-xs">
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    {refImage ? 'Change' : 'Upload'}
                  </Button>
                  {refImage && (
                    <Button variant="ghost" size="sm" onClick={() => setRefImage(null)}
                      className="px-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl h-9">
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                {refImage && (
                  <img src={refImage} alt="Reference" className="w-full h-24 object-cover rounded-xl mt-2 opacity-80" />
                )}
              </div>

              {/* Generate button */}
              <Button
                onClick={generate}
                disabled={isGenerating || status === 'generating'}
                className="w-full h-11 rounded-xl font-bold tracking-widest uppercase text-black text-sm transition-all"
                style={{
                  background: isGenerating ? 'rgba(0,200,255,0.4)' : `linear-gradient(135deg, ${model.accent}, ${model.accent}cc)`,
                  boxShadow: isGenerating ? 'none' : `0 0 20px ${model.accent}45`,
                }}
              >
                {isGenerating || status === 'generating' ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                    <span className="text-white">Generating…</span></>
                ) : (
                  <><ImageIcon className="w-4 h-4 mr-2" />Generate with {model.name}</>
                )}
              </Button>

              {/* Progress */}
              {status === 'generating' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-[#00c8ff70]">Progress</span>
                    <span style={{ color: model.accent }} className="font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background:'rgba(0,200,255,0.10)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width:`${progress}%`, background:`linear-gradient(90deg,${model.accent},${model.accent}88)` }} />
                  </div>
                  <p className="text-[8px] text-center text-[#00c8ff50]">
                    {model.local ? 'Processing locally via backend…' : `${model.subtitle} · please wait`}
                  </p>
                </div>
              )}
            </div>

            {/* ── Right: Output ── */}
            <div className="p-5 rounded-2xl flex flex-col"
              style={{ background:'rgba(0,8,20,0.85)', border:'1px solid rgba(0,200,255,0.15)', minHeight:380 }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#00c8ff70] mb-3">
                Generated Image
              </p>

              {status === 'idle' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background:`${model.accent}12`, border:`1px solid ${model.accent}30` }}>
                    <model.icon className="w-7 h-7" style={{ color: model.accent }} />
                  </div>
                  <p className="text-xs text-white/40">{model.description}</p>
                </div>
              )}

              {status === 'generating' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin" style={{ color: model.accent }} />
                  <p className="text-xs text-white/50">Generating with {model.name}…</p>
                </div>
              )}

              {status === 'failed' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                  <p className="text-xs text-red-400 font-semibold">Generation failed</p>
                  {errorMsg && (
                    <p className="text-[9px] text-white/40 text-center max-w-xs">{errorMsg}</p>
                  )}
                  {model.local && (
                    <p className="text-[8px] text-emerald-400/70 text-center">
                      Make sure the backend is running: <code>npm run jarvis:unified</code>
                    </p>
                  )}
                </div>
              )}

              {status === 'completed' && (imageUrl ?? imageBlob) && (
                <div className="flex-1 flex flex-col gap-3">
                  <img
                    src={imageUrl ?? imageBlob ?? ''}
                    alt="Generated"
                    className="w-full rounded-xl object-contain"
                    style={{ maxHeight: 360 }}
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">
                      {model.name} · Generation complete
                    </span>
                  </div>
                  <Button onClick={download} variant="outline" size="sm"
                    className="w-full border-[#00c8ff25] bg-[#00c8ff08] text-[#00c8ff] hover:bg-[#00c8ff18] rounded-xl h-9 text-xs">
                    <Download className="w-3.5 h-3.5 mr-2" />
                    Download Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ── Model status bar ── */}
          <div className="p-4 rounded-2xl"
            style={{ background:'rgba(0,8,20,0.85)', border:'1px solid rgba(0,200,255,0.12)' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#00c8ff60] mb-3">
              All Available Models
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {MODELS.map(m => {
                const Icon = m.icon;
                const active = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setStatus('idle'); setImageUrl(null); setImageBlob(null); }}
                    className="flex items-center gap-2 p-2.5 rounded-xl transition-all"
                    style={{
                      background: active ? `${m.accent}14` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? m.accent + '55' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full animate-pulse shrink-0"
                      style={{ background: m.local ? '#34d399' : m.accent }} />
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: m.accent }} />
                    <span className="text-[9px] font-semibold text-white/70 truncate">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
