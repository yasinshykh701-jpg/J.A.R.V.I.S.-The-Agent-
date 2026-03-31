import { aiApi } from '@/db/api';

class VoiceFeedbackService {
  private audioQueue: HTMLAudioElement[] = [];
  private isPlaying = false;
  private enabled = true;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  async speak(text: string, voice: string = 'heart') {
    if (!this.enabled || !text.trim()) return;

    try {
      const audioData = await aiApi.textToSpeech(text, 'en', voice);
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audio.volume = 0.7;
      
      this.audioQueue.push(audio);
      
      if (!this.isPlaying) {
        this.playNext();
      }
    } catch (error) {
      console.error('Voice feedback error:', error);
    }
  }

  private async playNext() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audio = this.audioQueue.shift()!;
    
    audio.onended = () => {
      URL.revokeObjectURL(audio.src);
      this.playNext();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      this.playNext();
    };

    try {
      await audio.play();
    } catch (error) {
      console.error('Audio play error:', error);
      this.playNext();
    }
  }

  stopAll() {
    this.audioQueue.forEach(audio => {
      audio.pause();
      URL.revokeObjectURL(audio.src);
    });
    this.audioQueue = [];
    this.isPlaying = false;
  }

  // Predefined feedback messages
  async buttonClick() {
    await this.speak('Button activated', 'heart');
  }

  async featureSelected(featureName: string) {
    await this.speak(`Opening ${featureName}`, 'heart');
  }

  async success(message: string) {
    await this.speak(message, 'heart');
  }

  async error(message: string) {
    await this.speak(`Error: ${message}`, 'heart');
  }

  async welcome() {
    await this.speak('Hello! I am Qazyen AI AI. How can I assist you today?', 'heart');
  }

  async goodbye() {
    await this.speak('Goodbye! Have a great day!', 'heart');
  }
}

export const voiceFeedback = new VoiceFeedbackService();
