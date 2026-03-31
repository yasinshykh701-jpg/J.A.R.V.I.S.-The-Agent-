export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'video' | 'audio';
  metadata?: Record<string, unknown>;
}

export interface ChatContent {
  role: 'user' | 'model';
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
    fileData?: {
      mimeType: string;
      fileUri: string;
    };
  }>;
}

export interface ImageGenerationTask {
  taskId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  result?: {
    candidates: Array<{
      content: {
        role: string;
        parts: Array<{
          text: string;
        }>;
      };
    }>;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface VideoGenerationTask {
  task_id: string;
  task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
  task_status_msg?: string;
  task_result?: {
    videos: Array<{
      id: string;
      url: string;
      duration: string;
    }>;
  };
}

export interface TranscriptionResult {
  text: string;
  task?: string;
  language?: string;
  duration?: number;
  segments?: Array<{
    id: number;
    text: string;
    start: number;
    end: number;
    language?: string;
    speaker?: string;
    words?: Array<{
      word: string;
      start: number;
      end: number;
      speaker?: string;
    }>;
  }>;
}

export type AIFeature = 
  | 'chat'
  | 'image-generation'
  | 'video-generation'
  | 'virtual-robot'
  | 'notes-summary'
  | 'resume-analysis'
  | 'interview-prep';
