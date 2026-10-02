/**
 * Hulkbuster control API — local event bridge + optional backend sync.
 * Endpoints mirror: /api/speech/start|stop, /api/gesture, /api/body/walk, /api/eye/beam
 */

import {
  speechEvents,
  type EyeBeamColor,
  type HandGesture,
  type WalkDirection,
  startSpeakingGestureCycle,
} from '@/utils/speechEvents';

const API_KEY =
  (import.meta.env.VITE_HULKBUSTER_API_KEY as string | undefined)?.trim() ||
  'hulkbuster-local-dev-key';

const BACKEND_BASE =
  (import.meta.env.VITE_JARVIS_URL as string | undefined)?.replace(/\/$/, '') || '/jarvis';

async function postBackend(path: string, body: Record<string, unknown>) {
  try {
    await fetch(`${BACKEND_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'X-Jarvis-Token': API_KEY,
      },
      body: JSON.stringify(body),
    });
  } catch {
    // Backend optional — local events still drive the robot
  }
}

let stopGestureCycle: (() => void) | null = null;

export const hulkbusterControl = {
  async speechStart(text?: string, source: 'api-tts' | 'device-tts' | 'manual' = 'manual') {
    speechEvents.emit('speech.start', { text, source, intensity: 0.45 });
    speechEvents.emit('eye.beam', { color: 'blue', beamIntensity: 1.2, source });
    stopGestureCycle?.();
    stopGestureCycle = startSpeakingGestureCycle(2000);
    void postBackend('/api/speech/start', { text, source });
    return { ok: true, event: 'speech.start' };
  },

  async speechStop() {
    stopGestureCycle?.();
    stopGestureCycle = null;
    speechEvents.emit('speech.stop', { intensity: 0 });
    speechEvents.emit('mouth.close', { intensity: 0 });
    speechEvents.emit('hand.idle', { gesture: 'idle' });
    void postBackend('/api/speech/stop', {});
    return { ok: true, event: 'speech.stop' };
  },

  async gesture(gesture: HandGesture = 'wave') {
    speechEvents.emit('gesture.trigger', { gesture });
    const map: Partial<Record<HandGesture, string>> = {
      wave: 'hand.wave',
      point: 'hand.point',
      open_palm: 'hand.open_palm',
      fist: 'hand.fist',
      thumbs_up: 'hand.thumbs_up',
      idle: 'hand.idle',
      explain: 'gesture.explain',
    };
    const ev = map[gesture];
    if (ev) speechEvents.emit(ev as 'hand.wave', { gesture });
    void postBackend('/api/gesture', { gesture });
    return { ok: true, event: 'gesture.trigger', gesture };
  },

  async walk(direction: WalkDirection = 'forward', durationMs = 2500) {
    speechEvents.emit('body.walk', { direction, durationMs });
    void postBackend('/api/body/walk', { direction, durationMs });
    return { ok: true, event: 'body.walk', direction };
  },

  async eyeBeam(color: EyeBeamColor = 'blue', beamIntensity = 1.4, durationMs = 1800) {
    speechEvents.emit('eye.beam', { color, beamIntensity, durationMs });
    void postBackend('/api/eye/beam', { color, intensity: beamIntensity, durationMs });
    return { ok: true, event: 'eye.beam', color };
  },
};

/** Browser-side handler so /api calls from UI work even if gateway is down */
export function handleHulkbusterApiRequest(
  path: string,
  body: Record<string, unknown> = {},
): Promise<{ ok: boolean; event?: string; [k: string]: unknown }> {
  if (path.endsWith('/speech/start')) {
    return hulkbusterControl.speechStart(String(body.text || ''), 'manual');
  }
  if (path.endsWith('/speech/stop')) {
    return hulkbusterControl.speechStop();
  }
  if (path.endsWith('/gesture')) {
    return hulkbusterControl.gesture((body.gesture as HandGesture) || 'wave');
  }
  if (path.endsWith('/body/walk') || path.endsWith('/walk')) {
    return hulkbusterControl.walk(
      (body.direction as WalkDirection) || 'forward',
      Number(body.durationMs) || 2500,
    );
  }
  if (path.endsWith('/eye/beam') || path.endsWith('/beam')) {
    return hulkbusterControl.eyeBeam(
      (body.color as EyeBeamColor) || 'blue',
      Number(body.intensity ?? body.beamIntensity) || 1.4,
      Number(body.durationMs) || 1800,
    );
  }
  return Promise.resolve({ ok: false, error: 'Unknown path' });
}
