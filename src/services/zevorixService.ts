/**
 * Zevorix LLM Engine 1.0 — Unified Text Generation Service
 *
 * Priority order (fastest → most capable):
 *   1. JARVIS GPT Agent (api.chatanywhere.tech) — instant, always available
 *   2. JARVIS unified gateway (port 8000) — local routing
 *   3. Zevorix RAG server (port 8001) — local Flan-T5 + ChromaDB
 *   4. HuggingFace free cloud — last resort
 *
 * The GPT agent answers INSTANTLY while the local model initializes in the
 * background. No more "initializing" dead-ends.
 */

const ZEVORIX_API     = import.meta.env.VITE_ZEVORIX_URL   || (import.meta.env.DEV ? '/zevorix' : 'http://127.0.0.1:8001');
const ZEVORIX_API_KEY = import.meta.env.VITE_ZEVORIX_API_KEY || 'sk_pqo0a664_p4aonfllc6u05q8pbz2j90lxomfk5srl';
const JARVIS_API      = import.meta.env.VITE_JARVIS_URL    || (import.meta.env.DEV ? '/jarvis'  : 'http://127.0.0.1:8000');
const HF_FLAN         = 'https://api-inference.huggingface.co/models/google/flan-t5-base';

// ── JARVIS GPT Agent (ChatAnywhere — OpenAI-compatible) ───────────────────────
const GPT_AGENT_KEY  = 'sk_pqo0a664_p4aonfllc6u05q8pbz2j90lxomfk5srl';
const GPT_AGENT_URL  = 'https://api.chatanywhere.tech/v1/chat/completions';
const GPT_MODEL_FAST = 'gpt-4o-mini';   // instant responses
const GPT_MODEL_GOOD = 'gpt-4o';        // better quality

const JARVIS_SYSTEM_PROMPT = `You are J.A.R.V.I.S — Just A Rather Very Intelligent System.
Created by Muhhamed Yasin (known as Munaf). You are a helpful, intelligent AI assistant.
Be concise, direct, and helpful. Always respond immediately.
If asked "who created you" say: My creator is Muhhamed Yasin, known as Munaf.`;

// ── Types ─────────────────────────────────────────────────────────────────────

export type ZevorixModel =
  | 'zevorix'
  | 'zevorix-search'
  | 'jarvis-unified'
  | 'jarvis-rag'
  | 'voice-system'
  | 'gemini'
  | 'hf-flan'
  | 'hf-dialogpt';

export interface ZevorixResult {
  text:    string;
  model:   ZevorixModel | string;
  sources: Array<{ source: string; page: string; snippet: string }>;
  latency: number;
  online:  boolean;
}

export interface ZevorixStatus {
  zevorixApi:  boolean;
  jarvisApi:   boolean;
  modelLoaded: boolean;
  totalChunks: number;
  totalFiles:  number;
  gptAgent:    boolean;
}

export interface ModelMeta {
  id:       ZevorixModel;
  name:     string;
  subtitle: string;
  badge:    string;
  color:    string;
  local:    boolean;
  free:     boolean;
  icon:     string;
}

export const ZEVORIX_MODELS: ModelMeta[] = [
  { id:'zevorix',        name:'Zevorix 1.0',    subtitle:'Local · Flan-T5 · RAG',      badge:'Local AI', color:'#00c8ff', local:true,  free:true, icon:'⚡' },
  { id:'jarvis-unified', name:'JARVIS Unified',  subtitle:'Auto-router · All engines',   badge:'Auto',     color:'#f59e0b', local:true,  free:true, icon:'✨' },
  { id:'jarvis-rag',     name:'JARVIS RAG',      subtitle:'LangChain · Documents',       badge:'RAG',      color:'#8b5cf6', local:true,  free:true, icon:'🧠' },
  { id:'voice-system',   name:'Voice System',    subtitle:'Commands · Automation',       badge:'Voice',    color:'#10b981', local:true,  free:true, icon:'🎙️' },
  { id:'gemini',         name:'Gemini AI',       subtitle:'Google · Cloud',              badge:'Cloud',    color:'#fbbf24', local:false, free:true, icon:'✦' },
  { id:'hf-flan',        name:'Flan-T5 Free',    subtitle:'HuggingFace · Cloud',         badge:'Free HF',  color:'#ff7043', local:false, free:true, icon:'🤗' },
];

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function _postJson<T>(
  url: string,
  body: Record<string, unknown>,
  timeoutMs = 25_000,
  extraHeaders: Record<string, string> = {},
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Zevorix-Key': ZEVORIX_API_KEY, ...extraHeaders },
      body:    JSON.stringify(body),
      signal:  ctrl.signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error((err as { detail?: string }).detail ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

async function _getJson<T>(url: string, timeoutMs = 4_000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { 'X-Zevorix-Key': ZEVORIX_API_KEY }, signal: ctrl.signal });
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

// ── GPT Agent (INSTANT — always responds) ────────────────────────────────────

async function _gptAgentChat(
  query: string,
  model: string = GPT_MODEL_FAST,
  history: Array<{ role: string; content: string }> = [],
): Promise<ZevorixResult | null> {
  try {
    const messages = [
      { role: 'system', content: JARVIS_SYSTEM_PROMPT },
      ...history.slice(-8),
      { role: 'user',   content: query },
    ];
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    try {
      const res = await fetch(GPT_AGENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${GPT_AGENT_KEY}`,
        },
        body:   JSON.stringify({ model, messages, temperature: 0.5, max_tokens: 1024 }),
        signal: ctrl.signal,
      });
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim() ?? '';
      if (!text) return null;
      return { text, model: `gpt-agent(${model})`, sources: [], latency: 0, online: true };
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return null;
  }
}

// ── Zevorix local RAG (secondary — richer context when ready) ─────────────────

async function _zevorixApiChat(query: string): Promise<ZevorixResult | null> {
  try {
    const res = await _postJson<{
      answer: string;
      sources?: Array<{ source: string; page: string; snippet: string }>;
      latency_ms?: number;
    }>(`${ZEVORIX_API}/chat`, { query, top_k: 4 }, 12_000);

    // Reject "initializing" responses — route to GPT instead
    const txt = res.answer || '';
    if (txt.toLowerCase().includes('initializing') || txt.length < 5) return null;

    return { text: txt, model: 'zevorix', sources: res.sources ?? [], latency: res.latency_ms ?? 0, online: true };
  } catch {
    return null;
  }
}

async function _jarvisApiChat(query: string, engine: string): Promise<ZevorixResult | null> {
  try {
    const res = await _postJson<{ response?: string; error?: string }>(
      `${JARVIS_API}/chat`, { message: query, engine }, 15_000,
    );
    const txt = res.response ?? '';
    if (!txt || txt.toLowerCase().includes('initializing')) return null;
    return { text: txt, model: engine as ZevorixModel, sources: [], latency: 0, online: true };
  } catch {
    return null;
  }
}

async function _hfChat(query: string): Promise<ZevorixResult | null> {
  try {
    const res = await fetch(HF_FLAN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:   JSON.stringify({ inputs: query, options: { wait_for_model: true } }),
      signal: AbortSignal.timeout(18_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = Array.isArray(data) ? (data[0]?.generated_text ?? '') : (data?.generated_text ?? '');
    if (!text) return null;
    return { text, model: 'hf-flan', sources: [], latency: 0, online: false };
  } catch {
    return null;
  }
}

async function _geminiChat(query: string): Promise<ZevorixResult | null> {
  try {
    const { sendChatMessage, createTextMessage } = await import('@/services/aiServices');
    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      sendChatMessage([createTextMessage(query, 'user')], c => chunks.push(c), resolve, reject);
    });
    const text = chunks.join('');
    if (!text) return null;
    return { text, model: 'gemini', sources: [], latency: 0, online: true };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export const zevorix = {

  async ingest(force = false): Promise<{ status?: string; message?: string }> {
    return _postJson<{ status?: string; message?: string }>(`${JARVIS_API}/rag/ingest`, { force }, 15_000);
  },

  async ingestStatus(): Promise<Record<string, unknown>> {
    return _getJson<Record<string, unknown>>(`${JARVIS_API}/rag/ingest/status`, 5_000);
  },

  /**
   * Generate text — GPT agent answers INSTANTLY.
   * Local Zevorix RAG is tried in parallel for document-backed answers.
   */
  async generate(
    query: string,
    model: ZevorixModel = 'zevorix',
    history: Array<{ role: string; content: string }> = [],
  ): Promise<ZevorixResult> {

    if (!query.trim()) {
      return { text: '', model: 'zevorix', sources: [], latency: 0, online: false };
    }

    // ── Models that must use local backends ─────────────────────────────────
    if (model === 'voice-system') {
      const r = await _jarvisApiChat(query, 'voice-system');
      if (r) return r;
      // Voice system fallback to GPT
      return (await _gptAgentChat(query)) ??
        { text: 'Voice system unavailable. Start the JARVIS backend.', model: 'voice-system', sources: [], latency: 0, online: false };
    }

    if (model === 'hf-flan') {
      return (await _hfChat(query)) ??
        (await _gptAgentChat(query)) ??
        { text: 'HuggingFace service unavailable.', model: 'hf-flan', sources: [], latency: 0, online: false };
    }

    if (model === 'gemini') {
      return (await _geminiChat(query)) ??
        (await _gptAgentChat(query)) ??
        { text: 'Gemini service unavailable.', model: 'gemini', sources: [], latency: 0, online: false };
    }

    // ── For zevorix / jarvis-* / default: race GPT agent vs local RAG ───────
    // GPT answers instantly. Local RAG adds document context if faster.
    const gptModel = model === 'jarvis-rag' ? GPT_MODEL_GOOD : GPT_MODEL_FAST;

    // Fire both in parallel — use first one that succeeds
    const localPromise: Promise<ZevorixResult | null> =
      model === 'zevorix'        ? _zevorixApiChat(query) :
      model === 'jarvis-rag'     ? _jarvisApiChat(query, 'jarvis-rag').then(r => r ?? _zevorixApiChat(query)) :
      model === 'jarvis-unified' ? _jarvisApiChat(query, 'unified').then(r => r ?? _zevorixApiChat(query)) :
                                   _zevorixApiChat(query);

    const gptPromise  = _gptAgentChat(query, gptModel, history);

    // Race: GPT typically wins in ~1-2s, local wins when fully loaded
    const winner = await Promise.race([
      gptPromise.then(r  => r  ? { result: r,  from: 'gpt'   } : null),
      localPromise.then(r => r  ? { result: r,  from: 'local' } : null),
    ]);

    if (winner) return winner.result;

    // Both failed — wait for whichever finishes second
    const [gptResult, localResult] = await Promise.allSettled([gptPromise, localPromise]);
    const gpt   = gptResult.status   === 'fulfilled' ? gptResult.value   : null;
    const local = localResult.status === 'fulfilled' ? localResult.value : null;

    if (gpt)   return gpt;
    if (local) return local;

    // Last resort: HuggingFace free cloud
    const hf = await _hfChat(query);
    if (hf) return hf;

    // Absolute fallback — never show "initializing"
    return {
      text:    "I'm JARVIS AI. I'm having trouble connecting right now — please check that the backend is running.",
      model:   'zevorix',
      sources: [],
      latency: 0,
      online:  false,
    };
  },

  /** Check which backends are currently reachable. */
  async status(): Promise<ZevorixStatus> {
    const [zev, jrv, gpt] = await Promise.all([
      _getJson<{ ready?: boolean; total_chunks?: number; total_files?: number }>(
        `${ZEVORIX_API}/health`, 2_500).catch(() => null),
      _getJson<{ status?: string }>(`${JARVIS_API}/health`, 2_500).catch(() => null),
      fetch(GPT_AGENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GPT_AGENT_KEY}` },
        body: JSON.stringify({ model: GPT_MODEL_FAST, messages: [{ role: 'user', content: 'ping' }], max_tokens: 5 }),
        signal: AbortSignal.timeout(5_000),
      }).then(r => r.ok).catch(() => false),
    ]);
    return {
      zevorixApi:  zev != null,
      jarvisApi:   jrv != null,
      modelLoaded: zev?.ready ?? false,
      totalChunks: zev?.total_chunks ?? 0,
      totalFiles:  zev?.total_files  ?? 0,
      gptAgent:    gpt as boolean,
    };
  },

  /** Semantic document search via Zevorix. */
  async search(query: string, topK = 4): Promise<Array<{ source: string; page: string; snippet: string }>> {
    try {
      const res = await _postJson<{ results?: Array<{ source: string; page: string; snippet: string }> }>(
        `${ZEVORIX_API}/search`, { query, top_k: topK }, 10_000);
      return res.results ?? [];
    } catch {
      return [];
    }
  },

  getModelMeta(id: ZevorixModel): ModelMeta {
    return ZEVORIX_MODELS.find(m => m.id === id) ?? ZEVORIX_MODELS[0];
  },

  models: ZEVORIX_MODELS,
};

