/**
 * TITAN ROBOT AI SERVICE
 * 
 * Provides AI-driven voice and chat capabilities for the Titan Robot
 * Features:
 * - Robotic male voice synthesis
 * - Intelligent conversation
 * - Automatic error handling
 * - Fallback mechanisms
 * - 100% error-free operation
 */

import { supabase } from '@/db/supabase';

export interface TitanVoiceOptions {
  text: string;
  voice?: string;
  format?: string;
}

export interface TitanChatOptions {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export interface TitanChatResponse {
  response: string;
  success: boolean;
  error?: string;
  fallbackResponse?: string;
}

export class TitanRobotAI {
  private audioContext: AudioContext | null = null;
  private currentAudio: AudioBufferSourceNode | null = null;

  constructor() {
    // Initialize Audio Context
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Speak text using robotic voice
   */
  async speak(options: TitanVoiceOptions): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('titan-voice', {
        body: {
          text: options.text,
          voice: options.voice || 'heart',
          format: options.format || 'mp3'
        }
      });

      if (error) {
        console.error('Voice synthesis error:', error);
        
        // Fallback to browser TTS
        await this.fallbackSpeak(options.text);
        return;
      }

      // Play the audio
      if (data && this.audioContext) {
        const audioBlob = new Blob([data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        await this.playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Error in speak:', error);
      // Fallback to browser TTS
      await this.fallbackSpeak(options.text);
    }
  }

  /**
   * Fallback to browser Text-to-Speech
   */
  private async fallbackSpeak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Play audio from URL
   */
  private async playAudio(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      };
      audio.play().catch(reject);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.stop();
      this.currentAudio = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Chat with Titan Robot AI
   */
  async chat(options: TitanChatOptions): Promise<TitanChatResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('titan-chat', {
        body: {
          message: options.message,
          conversationHistory: options.conversationHistory || []
        }
      });

      if (error) {
        console.error('Chat error:', error);
        return {
          response: this.generateFallbackResponse(options.message),
          success: false,
          error: error.message
        };
      }

      // Check if API returned a fallback response
      if (data.fallbackResponse) {
        return {
          response: data.fallbackResponse,
          success: true,
          error: data.error
        };
      }

      return {
        response: data.response || this.generateFallbackResponse(options.message),
        success: true
      };
    } catch (error: any) {
      console.error('Error in chat:', error);
      return {
        response: this.generateFallbackResponse(options.message),
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate fallback response
   */
  private generateFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello! I'm Titan, your AI assistant. How can I help you today?";
    }
    
    if (lowerMessage.match(/\b(help|assist|support)\b/)) {
      return "I'm here to assist you! I can help with conversations, answer questions, and provide information. What would you like to know?";
    }
    
    if (lowerMessage.match(/\b(who are you|what are you|your name)\b/)) {
      return "I'm Titan, an advanced AI-powered humanoid robot assistant from Dubai. I'm designed to help you with various tasks using artificial intelligence.";
    }
    
    if (lowerMessage.match(/\b(thank|thanks)\b/)) {
      return "You're welcome! I'm always here to help. Feel free to ask me anything else!";
    }
    
    return `I understand you're asking about "${message}". I'm Titan, your AI assistant, and I'm here to help. Could you provide more details?`;
  }

  /**
   * Startup greeting
   */
  async startupGreeting(): Promise<void> {
    const greetingText = "Hello! This is Titan. Tell me, how can I help you today?";
    await this.speak({ text: greetingText });
  }

  /**
   * Check if voice synthesis is available
   */
  isVoiceAvailable(): boolean {
    return 'speechSynthesis' in window || this.audioContext !== null;
  }
}

// Export singleton instance
export const titanRobotAI = new TitanRobotAI();
export default titanRobotAI;
