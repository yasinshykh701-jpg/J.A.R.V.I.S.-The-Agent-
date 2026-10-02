/**
 * Device Text-to-Speech Utility
 * Uses browser's built-in Web Speech Synthesis API
 * FREE - No API costs, no authentication, works offline
 * Emits speechEvents for Hulkbuster mouth / gesture sync
 */

import { speechEvents, visemeFromChar } from '@/utils/speechEvents';

export interface DeviceTTSOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number; // 0.1 to 10 (default: 1)
  pitch?: number; // 0 to 2 (default: 1)
  volume?: number; // 0 to 1 (default: 1)
  lang?: string; // Language code (e.g., 'en-US', 'es-ES')
  onIntensity?: (intensity: number) => void;
}

class DeviceTTS {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private intensityTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  getVoicesByLanguage(lang: string): SpeechSynthesisVoice[] {
    return this.getVoices().filter(voice =>
      voice.lang.startsWith(lang) || voice.lang.startsWith(lang.split('-')[0])
    );
  }

  getBestVoice(lang: string = 'en'): SpeechSynthesisVoice | null {
    const voices = this.getVoicesByLanguage(lang);

    if (voices.length === 0) {
      const englishVoices = this.getVoicesByLanguage('en');
      if (englishVoices.length > 0) return englishVoices[0];

      const allVoices = this.getVoices();
      if (allVoices.length > 0) return allVoices[0];

      return null;
    }

    const localVoice = voices.find(v => v.localService);
    if (localVoice) return localVoice;

    const defaultVoice = voices.find(v => v.default);
    if (defaultVoice) return defaultVoice;

    return voices[0];
  }

  getRoboticVoice(lang: string = 'en'): SpeechSynthesisVoice | null {
    const voices = this.getVoicesByLanguage(lang);

    const maleVoice = voices.find(v =>
      v.name.toLowerCase().includes('male') ||
      v.name.toLowerCase().includes('man') ||
      v.name.toLowerCase().includes('david') ||
      v.name.toLowerCase().includes('james') ||
      v.name.toLowerCase().includes('daniel')
    );

    if (maleVoice) return maleVoice;

    return this.getBestVoice(lang);
  }

  private clearIntensityTimer() {
    if (this.intensityTimer) {
      clearInterval(this.intensityTimer);
      this.intensityTimer = null;
    }
  }

  private emitIntensity(intensity: number, onIntensity?: (n: number) => void) {
    onIntensity?.(intensity);
    speechEvents.emit('speech.intensity', { intensity, source: 'device-tts' });
    speechEvents.emit(intensity > 0.2 ? 'mouth.open' : 'mouth.close', {
      intensity,
      source: 'device-tts',
    });
  }

  speak(
    text: string,
    options: DeviceTTSOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      const rate = options.rate ?? 1.0;

      if (options.voice) {
        utterance.voice = options.voice;
      } else if (options.lang) {
        const voice = this.getRoboticVoice(options.lang);
        if (voice) utterance.voice = voice;
      } else {
        const voice = this.getRoboticVoice('en');
        if (voice) utterance.voice = voice;
      }

      if (options.lang) {
        utterance.lang = options.lang;
      }

      utterance.rate = rate;
      utterance.pitch = options.pitch ?? 0.9;
      utterance.volume = options.volume ?? 1.0;

      utterance.onstart = () => {
        speechEvents.emit('speech.start', {
          text,
          lang: options.lang,
          rate,
          source: 'device-tts',
          intensity: 0.4,
        });
        speechEvents.emit('gesture.explain', { source: 'device-tts' });

        // Fallback rhythmic mouth motion if browser skips boundary events
        this.clearIntensityTimer();
        let tick = 0;
        this.intensityTimer = setInterval(() => {
          if (!this.synth.speaking) return;
          tick += 1;
          const pulse = 0.25 + Math.abs(Math.sin(tick * 0.55)) * 0.55;
          this.emitIntensity(pulse, options.onIntensity);
        }, Math.max(40, 90 / rate));
      };

      utterance.onboundary = (event) => {
        const idx = typeof event.charIndex === 'number' ? event.charIndex : 0;
        const ch = text[idx] || text[Math.min(idx, text.length - 1)] || 'a';
        const intensity = visemeFromChar(ch);
        this.emitIntensity(intensity, options.onIntensity);
      };

      utterance.onend = () => {
        this.clearIntensityTimer();
        this.emitIntensity(0, options.onIntensity);
        speechEvents.emit('speech.stop', { text, source: 'device-tts', intensity: 0 });
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.clearIntensityTimer();
        this.emitIntensity(0, options.onIntensity);
        speechEvents.emit('speech.stop', { text, source: 'device-tts', intensity: 0 });
        this.currentUtterance = null;
        console.error('Device TTS error:', event);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synth.speak(utterance);
    });
  }

  stop() {
    this.clearIntensityTimer();
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    if (this.currentUtterance) {
      speechEvents.emit('speech.stop', { source: 'device-tts', intensity: 0 });
      speechEvents.emit('mouth.close', { intensity: 0, source: 'device-tts' });
    }
    this.currentUtterance = null;
  }

  pause() {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  isPaused(): boolean {
    return this.synth.paused;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const deviceTTS = new DeviceTTS();

export const speakWithDevice = (text: string, lang: string = 'en') => {
  return deviceTTS.speak(text, { lang });
};

export const stopDeviceSpeech = () => {
  deviceTTS.stop();
};

export const getDeviceVoices = () => {
  return deviceTTS.getVoices();
};

export const isDeviceTTSSupported = () => {
  return deviceTTS.isSupported();
};
