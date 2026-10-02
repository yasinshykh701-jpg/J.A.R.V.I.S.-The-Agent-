/**
 * Hulkbuster animation + speech event bus
 */

export type HandGesture = 'idle' | 'wave' | 'point' | 'open_palm' | 'fist' | 'thumbs_up' | 'explain';
export type WalkDirection = 'forward' | 'backward' | 'left' | 'right' | 'stop';
export type EyeBeamColor = 'blue' | 'red' | 'white';

export type SpeechEventName =
  | 'speech.start'
  | 'speech.stop'
  | 'mouth.open'
  | 'mouth.close'
  | 'speech.intensity'
  | 'gesture.wave'
  | 'gesture.explain'
  | 'hand.wave'
  | 'hand.point'
  | 'hand.open_palm'
  | 'hand.fist'
  | 'hand.thumbs_up'
  | 'hand.idle'
  | 'gesture.trigger'
  | 'body.walk'
  | 'eye.beam';

export type SpeechEventDetail = {
  text?: string;
  intensity?: number;
  source?: 'device-tts' | 'api-tts' | 'audio' | 'manual' | 'backend';
  lang?: string;
  rate?: number;
  gesture?: HandGesture;
  direction?: WalkDirection;
  durationMs?: number;
  color?: EyeBeamColor;
  beamIntensity?: number;
};

type Handler = (detail: SpeechEventDetail) => void;

const listeners = new Map<SpeechEventName, Set<Handler>>();

export const speechEvents = {
  on(event: SpeechEventName, handler: Handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler);
    return () => speechEvents.off(event, handler);
  },

  off(event: SpeechEventName, handler: Handler) {
    listeners.get(event)?.delete(handler);
  },

  emit(event: SpeechEventName, detail: SpeechEventDetail = {}) {
    listeners.get(event)?.forEach((h) => {
      try {
        h(detail);
      } catch (err) {
        console.error(`[speechEvents] ${event}`, err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(event, { detail }));
    }
  },
};

/** Map spoken character → mouth openness 0–1 (viseme-ish) */
export function visemeFromChar(ch: string): number {
  const c = ch.toLowerCase();
  if (!c || /\s/.test(c)) return 0.05;
  if ('aeiouáéíóúäëïöüàèìòùâêîôûæøåаеёиоуыэюяاويء'.includes(c)) return 0.85;
  if ('bmp'.includes(c)) return 0.15;
  if ('fv'.includes(c)) return 0.35;
  if ('w'.includes(c)) return 0.45;
  if ('tdnl'.includes(c)) return 0.4;
  if ('szcjg'.includes(c)) return 0.55;
  if ('kgqhx'.includes(c)) return 0.5;
  return 0.35;
}

export function estimateSpeechDurationMs(text: string, rate = 1): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = 160 * Math.max(0.5, rate);
  return Math.max(800, (words / wpm) * 60_000);
}

const SPEAK_GESTURES: HandGesture[] = ['explain', 'open_palm', 'point', 'wave', 'thumbs_up'];

/** Cycle expressive hand gestures while speaking */
export function startSpeakingGestureCycle(intervalMs = 2200): () => void {
  let i = 0;
  speechEvents.emit('gesture.trigger', { gesture: SPEAK_GESTURES[0], source: 'manual' });
  const id = window.setInterval(() => {
    i = (i + 1) % SPEAK_GESTURES.length;
    const g = SPEAK_GESTURES[i];
    speechEvents.emit('gesture.trigger', { gesture: g, source: 'manual' });
    speechEvents.emit(`hand.${g === 'explain' ? 'wave' : g}` as SpeechEventName, { gesture: g });
  }, intervalMs);
  return () => {
    window.clearInterval(id);
    speechEvents.emit('hand.idle', { gesture: 'idle' });
  };
}
