/**
 * Device Text-to-Speech Utility
 * Uses browser's built-in Web Speech Synthesis API
 * FREE - No API costs, no authentication, works offline
 */

export interface DeviceTTSOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number; // 0.1 to 10 (default: 1)
  pitch?: number; // 0 to 2 (default: 1)
  volume?: number; // 0 to 1 (default: 1)
  lang?: string; // Language code (e.g., 'en-US', 'es-ES')
}

class DeviceTTS {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    // Load voices when they become available
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
  }

  /**
   * Get all available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  /**
   * Get voices filtered by language
   */
  getVoicesByLanguage(lang: string): SpeechSynthesisVoice[] {
    return this.getVoices().filter(voice => 
      voice.lang.startsWith(lang) || voice.lang.startsWith(lang.split('-')[0])
    );
  }

  /**
   * Get the best voice for a language
   * Prioritizes: local voices, then default voice, then any voice
   */
  getBestVoice(lang: string = 'en'): SpeechSynthesisVoice | null {
    const voices = this.getVoicesByLanguage(lang);
    
    if (voices.length === 0) {
      // Fallback to any English voice
      const englishVoices = this.getVoicesByLanguage('en');
      if (englishVoices.length > 0) return englishVoices[0];
      
      // Fallback to any voice
      const allVoices = this.getVoices();
      if (allVoices.length > 0) return allVoices[0];
      
      return null;
    }

    // Prefer local voices (better quality)
    const localVoice = voices.find(v => v.localService);
    if (localVoice) return localVoice;

    // Prefer default voice
    const defaultVoice = voices.find(v => v.default);
    if (defaultVoice) return defaultVoice;

    // Return first available voice
    return voices[0];
  }

  /**
   * Get a robotic-sounding voice (male, deep)
   */
  getRoboticVoice(lang: string = 'en'): SpeechSynthesisVoice | null {
    const voices = this.getVoicesByLanguage(lang);
    
    // Look for male voices with keywords
    const maleVoice = voices.find(v => 
      v.name.toLowerCase().includes('male') ||
      v.name.toLowerCase().includes('man') ||
      v.name.toLowerCase().includes('david') ||
      v.name.toLowerCase().includes('james') ||
      v.name.toLowerCase().includes('daniel')
    );
    
    if (maleVoice) return maleVoice;
    
    // Fallback to best voice
    return this.getBestVoice(lang);
  }

  /**
   * Speak text with device TTS
   */
  speak(
    text: string,
    options: DeviceTTSOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Set voice
      if (options.voice) {
        utterance.voice = options.voice;
      } else if (options.lang) {
        const voice = this.getRoboticVoice(options.lang);
        if (voice) utterance.voice = voice;
      } else {
        const voice = this.getRoboticVoice('en');
        if (voice) utterance.voice = voice;
      }

      // Set language
      if (options.lang) {
        utterance.lang = options.lang;
      }

      // Set speech parameters
      utterance.rate = options.rate ?? 1.0; // Normal speed
      utterance.pitch = options.pitch ?? 0.9; // Slightly lower for robotic sound
      utterance.volume = options.volume ?? 1.0; // Full volume

      // Event handlers
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        console.error('Device TTS error:', event);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Speak
      this.synth.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause() {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  /**
   * Check if paused
   */
  isPaused(): boolean {
    return this.synth.paused;
  }

  /**
   * Check if device TTS is supported
   */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Export singleton instance
export const deviceTTS = new DeviceTTS();

// Export helper functions
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
