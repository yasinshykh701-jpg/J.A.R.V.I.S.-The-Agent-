/**
 * J.A.R.V.I.S Backend Context
 *
 * Automatically connects to http://127.0.0.1:8000 on app load.
 * Polls health every 8 seconds. Exposes:
 *  • online         — backend reachable
 *  • health         — full module status
 *  • engineStatus   — per-engine availability
 *  • lastPing       — timestamp of last successful ping
 *  • retry()        — manual reconnect trigger
 *
 * Wrap <App> in <JarvisBackendProvider> to use.
 */

import {
  createContext, useContext, useEffect, useRef,
  useState, useCallback, type ReactNode,
} from 'react';

const BACKEND = 'http://127.0.0.1:8000';
const POLL_MS = 8_000;   // poll every 8 s
const RETRY_MS = 3_000;  // retry faster when offline

export interface ModuleStatus {
  frontend:          boolean;
  auth:              boolean;
  'voice-assistant': boolean;
  'rag-engine':      boolean;
  zevorix:           boolean;
  'jarvis-rag':      boolean;
  'voice-system':    boolean;
  'image-rag':       boolean;
  'image-generator': boolean;
  engines: Array<{
    id:          string;
    name:        string;
    description: string;
    available:   boolean;
    icon:        string;
  }>;
}

export interface BackendHealth {
  status:    string;
  service:   string;
  workspace: string;
  modules:   ModuleStatus;
  paths:     Record<string, { path: string; available: boolean }>;
}

interface BackendCtx {
  online:       boolean;
  health:       BackendHealth | null;
  lastPing:     Date | null;
  connecting:   boolean;
  retry:        () => void;
  baseUrl:      string;
  /** POST helper — auto adds CORS headers */
  post: <T>(endpoint: string, body: Record<string, unknown>) => Promise<T>;
  /** GET helper */
  get:  <T>(endpoint: string) => Promise<T>;
}

const Ctx = createContext<BackendCtx | null>(null);

export function JarvisBackendProvider({ children }: { children: ReactNode }) {
  const [online,     setOnline]     = useState(false);
  const [health,     setHealth]     = useState<BackendHealth | null>(null);
  const [lastPing,   setLastPing]   = useState<Date | null>(null);
  const [connecting, setConnecting] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ping = useCallback(async () => {
    setConnecting(true);
    try {
      const res  = await fetch(`${BACKEND}/health`, { signal: AbortSignal.timeout(4000) });
      const data = await res.json() as BackendHealth;
      setHealth(data);
      setOnline(true);
      setLastPing(new Date());
      // Schedule next poll
      timerRef.current = setTimeout(ping, POLL_MS);
    } catch {
      setOnline(false);
      setHealth(null);
      // Retry sooner when offline
      timerRef.current = setTimeout(ping, RETRY_MS);
    } finally {
      setConnecting(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    ping();
  }, [ping]);

  useEffect(() => {
    ping();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [ping]);

  const post = useCallback(async <T,>(endpoint: string, body: Record<string, unknown>): Promise<T> => {
    const res = await fetch(`${BACKEND}${endpoint}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  }, []);

  const get = useCallback(async <T,>(endpoint: string): Promise<T> => {
    const res = await fetch(`${BACKEND}${endpoint}`, {
      signal: AbortSignal.timeout(10_000),
    });
    return res.json() as Promise<T>;
  }, []);

  return (
    <Ctx.Provider value={{ online, health, lastPing, connecting, retry, baseUrl: BACKEND, post, get }}>
      {children}
    </Ctx.Provider>
  );
}

export function useJarvisBackend(): BackendCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useJarvisBackend must be inside JarvisBackendProvider');
  return ctx;
}
