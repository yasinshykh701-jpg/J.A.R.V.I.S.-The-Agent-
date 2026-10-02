/**
 * J.A.R.V.I.S Unified Backend API Client
 *
 * Uses Vite proxy (/jarvis/*) in development — avoids CORS / NetworkError.
 * In production direct URL is used.
 *
 * Backend: server/jarvis_unified.py  → http://127.0.0.1:8000
 * Vite proxy: /jarvis/*  → http://127.0.0.1:8000/*
 *
 * Endpoints:
 *  GET  /health   — module status
 *  POST /chat     — unified LLM chat (engine selector)
 *  POST /rag      — JARVIS RAG document QA
 *  POST /voice    — voice/system command
 *  POST /image    — image generation (RAG pipeline + Zevorix VAE)
 *  POST /video    — video generation
 */

// In dev Vite proxies /jarvis/* → 127.0.0.1:8000
// In production (built), use the real address
const IS_DEV = import.meta.env.DEV;
const DIRECT = import.meta.env.VITE_JARVIS_BACKEND_URL ?? 'http://127.0.0.1:8000';
const PROXY  = '/jarvis';      // Vite proxy prefix
export const BASE_URL = IS_DEV ? PROXY : DIRECT;

export type Engine =
  | 'unified'
  | 'zevorix'
  | 'jarvis-rag'
  | 'voice-system'
  | 'image-rag';

export interface ChatResponse {
  response?:   string;
  source?:     string;
  engine?:     string;
  sources?:    Array<{ source: string; page: string | number; snippet: string }>;
  image_url?:  string;
  modules?:    string[];
  username?:   string;
  error?:      string;
  success?:    boolean;
}

export interface HealthResponse {
  status:    string;
  service:   string;
  workspace: string;
  modules: {
    frontend:          boolean;
    auth:              boolean;
    'voice-assistant': boolean;
    'rag-engine':      boolean;
    zevorix:           boolean;
    'jarvis-rag':      boolean;
    'voice-system':    boolean;
    'image-rag':       boolean;
    'image-generator': boolean;
    'iot-api': boolean;
    engines: Array<{
      id:          string;
      name:        string;
      description: string;
      available:   boolean;
      icon:        string;
    }>;
  };
  paths: Record<string, { path: string; available: boolean }>;
}

/* ─── HTTP helpers ─────────────────────────────────────────── */

async function post<T>(endpoint: string, body: Record<string, unknown>, timeoutMs = 30_000): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(timeoutMs),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Backend unreachable at ${url}.\n` +
      `Run: npm run jarvis:unified\n` +
      `Detail: ${msg}`
    );
  }
  const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  return data as T;
}

async function get<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(6_000) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Backend unreachable: ${msg}`);
  }
  return res.json() as Promise<T>;
}

/* ─── Public API ────────────────────────────────────────────── */

/** Chat with any LLM engine */
export async function sendChat(
  message: string,
  engine:  Engine = 'unified',
  username?: string,
): Promise<ChatResponse> {
  return post<ChatResponse>('/chat', { message, engine, username });
}

/** JARVIS RAG document question-answering */
export async function queryRAG(query: string): Promise<ChatResponse> {
  return post<ChatResponse>('/rag', { query });
}

/** Voice / system command */
export async function sendVoiceCommand(command: string): Promise<ChatResponse> {
  return post<ChatResponse>('/voice', { command });
}

/**
 * Generate an image.
 *  selfTrain=true  → tries Image RAG Pipeline first, then Zevorix VAE
 *  selfTrain=false → uses Zevorix VAE only
 */
export async function generateImage(
  prompt:    string,
  selfTrain: boolean = true,
  referenceImage?: string | null,
): Promise<ChatResponse> {
  const result = await post<ChatResponse>('/image', {
    prompt,
    engine: selfTrain ? 'image-rag' : 'zevorix-vae',
    self_train: selfTrain ? '1' : '0',
    ...(referenceImage ? { reference_image: referenceImage } : {}),
  }, 180_000);
  if (result.image_url?.startsWith('/')) {
    result.image_url = `${BASE_URL}${result.image_url}`;
  }
  return result;
}

/** Generate a video */
export async function generateVideo(
  prompt:   string,
  duration: string = '5',
): Promise<ChatResponse> {
  return post<ChatResponse>('/video', { prompt, duration });
}

/** Health check — returns module availability */
export async function getHealth(): Promise<HealthResponse> {
  return get<HealthResponse>('/health');
}

/** Quick ping — resolves true if backend is reachable */
export async function ping(): Promise<boolean> {
  try {
    await get('/health');
    return true;
  } catch {
    return false;
  }
}

export const jarvisApi = {
  chat:    sendChat,
  rag:     queryRAG,
  voice:   sendVoiceCommand,
  image:   generateImage,
  video:   generateVideo,
  health:  getHealth,
  ping,
  baseUrl: BASE_URL,
};

export default jarvisApi;
