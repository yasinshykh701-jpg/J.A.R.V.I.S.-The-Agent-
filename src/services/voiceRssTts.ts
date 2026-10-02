/**
 * Multi-provider TTS using VITE_VOICE_RSS_API_KEY / VITE_VOICE_API_KEY
 * Tries VoiceRSS → ElevenLabs → returns null for caller fallback
 */

const LANG_MAP: Record<string, string> = {
  en: 'en-us', es: 'es-es', fr: 'fr-fr', de: 'de-de', zh: 'zh-cn', ja: 'ja-jp',
  ar: 'ar-sa', hi: 'hi-in', pt: 'pt-pt', ru: 'ru-ru', it: 'it-it', ko: 'ko-kr',
  tr: 'tr-tr', nl: 'nl-nl', pl: 'pl-pl', sv: 'sv-se', th: 'th-th', vi: 'vi-vn',
  ur: 'ur-pk', mr: 'hi-in',
};

const VOICE_RSS_VOICES: Record<string, string> = {
  alloy: 'Mike', echo: 'John', fable: 'Harry', onyx: 'Mike', nova: 'Linda', shimmer: 'Amy',
};

const ELEVEN_VOICES: Record<string, string> = {
  alloy: 'pNInz6obpgDQGcFmaJgB', // Adam
  echo: 'VR6AewLTigWG4xSOukaG',
  fable: 'VR6AewLTigWG4xSOukaG',
  onyx: 'pNInz6obpgDQGcFmaJgB',
  nova: 'EXAVITQu4vr4xnSDxMaL',
  shimmer: '21m00Tcm4TlvDq8ikWAM',
};

function getApiKey(): string {
  return (
    (import.meta.env.VITE_VOICE_RSS_API_KEY as string | undefined)?.trim() ||
    (import.meta.env.VITE_VOICE_API_KEY as string | undefined)?.trim() ||
    (import.meta.env.VITE_TTS_API_KEY as string | undefined)?.trim() ||
    ''
  );
}

export function isVoiceApiConfigured(): boolean {
  return getApiKey().length > 8;
}

async function tryVoiceRss(text: string, language: string, voice: string): Promise<ArrayBuffer | null> {
  const key = getApiKey();
  if (!key) return null;
  const hl = LANG_MAP[language] || LANG_MAP[language.split('-')[0]] || 'en-us';
  const params = new URLSearchParams({
    key,
    hl,
    v: VOICE_RSS_VOICES[voice] || 'Mike',
    src: text.slice(0, 100_000),
    c: 'MP3',
    f: '44khz_16bit_stereo',
    r: '0',
  });
  const res = await fetch(`https://api.voicerss.org/?${params}`, { method: 'GET' });
  if (!res.ok) return null;
  const buf = await res.arrayBuffer();
  const head = new TextDecoder().decode(buf.slice(0, 80));
  if (/ERROR|API key/i.test(head) || buf.byteLength < 128) return null;
  return buf;
}

async function tryElevenLabs(text: string, voice: string): Promise<ArrayBuffer | null> {
  const key = getApiKey();
  if (!key) return null;
  const voiceId = ELEVEN_VOICES[voice] || ELEVEN_VOICES.onyx;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': key,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: text.slice(0, 2500),
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.4, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) return null;
  const buf = await res.arrayBuffer();
  if (buf.byteLength < 128) return null;
  return buf;
}

/** Returns audio buffer from configured voice API key, or null */
export async function speakWithVoiceApiKey(
  text: string,
  language = 'en',
  voice = 'onyx',
): Promise<ArrayBuffer | null> {
  if (!text.trim() || !isVoiceApiConfigured()) return null;
  try {
    const a = await tryVoiceRss(text, language, voice);
    if (a) return a;
  } catch (e) {
    console.warn('VoiceRSS failed:', e);
  }
  try {
    const b = await tryElevenLabs(text, voice);
    if (b) return b;
  } catch (e) {
    console.warn('ElevenLabs failed:', e);
  }
  return null;
}

export { getApiKey as getVoiceApiKey };
