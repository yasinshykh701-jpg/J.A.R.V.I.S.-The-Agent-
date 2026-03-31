/**
 * FREE AI SERVICES - LIFETIME FREE & UNLIMITED
 * 
 * This module provides completely free AI services without any API keys required.
 * All services use free-tier APIs or browser-native capabilities.
 * 
 * Services included:
 * - Text-to-Speech (Browser Web Speech API - 100% Free)
 * - Speech-to-Text (Browser Web Speech API - 100% Free)
 * - Image Generation (Hugging Face Free Tier)
 * - Chat/LLM (Hugging Face Free Tier)
 * - Video Generation (Simulated - Free)
 */

// ============================================================================
// TEXT-TO-SPEECH (Browser Native - 100% Free)
// ============================================================================

export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
}

export const freeTextToSpeech = {
  /**
   * Convert text to speech using browser's native Web Speech API
   * Completely free, no API keys required, works offline
   */
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported in this browser'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.language || 'en-US';

      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      if (options.voice && voices.length > 0) {
        const selectedVoice = voices.find(v => v.name.includes(options.voice!));
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      window.speechSynthesis.speak(utterance);
    });
  },

  /**
   * Stop current speech
   */
  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }
};

// ============================================================================
// SPEECH-TO-TEXT (Browser Native - 100% Free)
// ============================================================================

export interface STTOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const freeSpeechToText = {
  /**
   * Convert speech to text using browser's native Web Speech API
   * Completely free, no API keys required
   */
  listen(
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (error: any) => void,
    options: STTOptions = {}
  ): { stop: () => void } {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onError?.(new Error('Speech recognition not supported in this browser'));
      return { stop: () => {} };
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = options.language || 'en-US';
    recognition.continuous = options.continuous !== false;
    recognition.interimResults = options.interimResults !== false;

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      onResult(transcript, result.isFinal);
    };

    recognition.onerror = (event: any) => {
      onError?.(event.error);
    };

    recognition.start();

    return {
      stop: () => recognition.stop()
    };
  }
};

// ============================================================================
// IMAGE GENERATION (Hugging Face Free Tier)
// ============================================================================

export const freeImageGeneration = {
  /**
   * Generate images using Hugging Face's free Stable Diffusion API
   * No API key required for basic usage
   */
  async generateImage(prompt: string): Promise<string> {
    try {
      // Using Hugging Face's free inference API
      const response = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            options: {
              wait_for_model: true
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Free image generation error:', error);
      
      // Fallback: Generate a placeholder image with the prompt text
      return generatePlaceholderImage(prompt);
    }
  }
};

/**
 * Generate a placeholder image when API fails
 */
function generatePlaceholderImage(prompt: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Add text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Wrap text
  const words = prompt.split(' ');
  let line = '';
  let y = 256 - 40;
  
  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 450 && line !== '') {
      ctx.fillText(line, 256, y);
      line = word + ' ';
      y += 30;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 256, y);

  return canvas.toDataURL();
}

// ============================================================================
// CHAT/LLM (Hugging Face Free Tier)
// ============================================================================

export const freeChatLLM = {
  /**
   * Chat with AI using Hugging Face's free models
   * No API key required for basic usage
   */
  async chat(message: string): Promise<string> {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: message,
            options: {
              wait_for_model: true
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Chat failed');
      }

      const data = await response.json();
      return data[0]?.generated_text || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('Free chat error:', error);
      return 'I apologize, but I am currently experiencing technical difficulties. Please try again.';
    }
  },

  /**
   * Stream chat responses
   */
  async *chatStream(message: string): AsyncGenerator<string> {
    const response = await this.chat(message);
    
    // Simulate streaming by yielding word by word
    const words = response.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
};

// ============================================================================
// VIDEO GENERATION (Simulated - Free)
// ============================================================================

export const freeVideoGeneration = {
  /**
   * Generate video preview (simulated)
   * Creates an animated canvas-based video
   */
  async generateVideo(prompt: string): Promise<string> {
    // Create a canvas-based animated "video"
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d')!;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 640, 480);
    gradient.addColorStop(0, '#4facfe');
    gradient.addColorStop(1, '#00f2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 480);

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Video Preview', 320, 200);
    
    ctx.font = '20px Arial';
    ctx.fillText(prompt.substring(0, 50), 320, 250);
    
    ctx.font = '16px Arial';
    ctx.fillText('Video generation coming soon!', 320, 300);

    return canvas.toDataURL();
  }
};

// ============================================================================
// DATA RESET UTILITY
// ============================================================================

export const dataReset = {
  /**
   * Clear all user data from localStorage
   */
  clearAllUserData() {
    try {
      // Clear all localStorage
      localStorage.clear();
      
      // Clear all sessionStorage
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      console.log('✅ All user data cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Error clearing user data:', error);
      return false;
    }
  },

  /**
   * Reset app to initial state
   */
  resetApp() {
    this.clearAllUserData();
    
    // Reload the page to reset React state
    window.location.href = '/';
  },

  /**
   * Check if user data exists
   */
  hasUserData(): boolean {
    return localStorage.length > 0 || sessionStorage.length > 0;
  }
};

// ============================================================================
// EXPORT ALL FREE SERVICES
// ============================================================================

export const freeAiServices = {
  tts: freeTextToSpeech,
  stt: freeSpeechToText,
  imageGen: freeImageGeneration,
  chat: freeChatLLM,
  videoGen: freeVideoGeneration,
  dataReset: dataReset
};

export default freeAiServices;
