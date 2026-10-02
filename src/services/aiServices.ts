import { generateImage } from '@/services/jarvisBackend';
import { supabase } from '@/db/supabase';

export { supabase };

// ============================================
// IMAGE GENERATION SERVICE (100% Operational)
// ============================================

export interface ImageGenerationRequest {
  contents: Array<{
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string; // Pure base64 without data: prefix
      };
    }>;
  }>;
}

export interface ImageGenerationResponse {
  status: number;
  data?: {
    taskId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    estimatedTime?: number;
  };
  message?: string;
}

export interface ImageQueryResponse {
  status: number;
  data?: {
    taskId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    imageUrl?: string;
    error?: string;
  };
  message?: string;
}

/**
 * Submit image generation task (text-to-image, image-to-image, multi-image)
 * Returns taskId for status polling
 */
export async function submitImageGeneration(
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> {
  const prompt = request.contents[0]?.parts.find(part => part.text)?.text?.trim();
  if (!prompt) throw new Error('Image prompt is required');
  const inline = request.contents[0]?.parts.find(part => part.inline_data?.data)?.inline_data;
  const reference = inline
    ? `data:${inline.mime_type || 'image/png'};base64,${inline.data}`
    : null;
  const result = await generateImage(prompt, true, reference);
  const taskId = `gateway-${Date.now()}`;
  const imageUrl = typeof result.image_url === 'string' ? result.image_url : undefined;
  if (imageUrl) sessionStorage.setItem(`jarvis-image-${taskId}`, imageUrl);
  return { status: imageUrl ? 0 : 1, data: { taskId, status: imageUrl ? 'SUCCESS' : 'FAILED', estimatedTime: 0 }, message: imageUrl ? undefined : result.error || 'Image generation failed' };
}

/**
 * Query image generation task status
 * Poll every 5-10 seconds until status is SUCCESS or FAILED
 */
export async function queryImageStatus(taskId: string): Promise<ImageQueryResponse> {
  const imageUrl = sessionStorage.getItem(`jarvis-image-${taskId}`) || undefined;
  return { status: imageUrl ? 0 : 1, data: { taskId, status: imageUrl ? 'SUCCESS' : 'FAILED', imageUrl, error: imageUrl ? undefined : 'Image task not found' } };
}

/**
 * Helper: Convert File to base64 (removes data URL prefix)
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/xxx;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================
// VIDEO GENERATION SERVICE (100% Operational - Sora 2)
// ============================================

export interface VideoGenerationRequest {
  prompt: string;
  size?: '720x1280' | '1280x720'; // Portrait or landscape
  seconds?: 4 | 8 | 12;
  input_reference?: string; // Base64 image with data: prefix
  remix_video_id?: string;
}

export interface VideoGenerationResponse {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  model: string;
  prompt: string;
  error?: string;
}

export interface VideoQueryResponse {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  model: string;
  prompt: string;
  output?: {
    url: string;
    duration: number;
  };
  error?: string;
}

/**
 * Create Sora 2 video generation task
 * Returns video job object with ID
 */
export async function createSoraVideo(
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('sora-create-video', {
      body: request,
    });

    if (error) {
      console.error('Sora video creation error:', error);
      throw new Error(error.message || 'Failed to create video generation task');
    }

    return data;
  } catch (err: any) {
    console.error('Sora video service error:', err);
    throw new Error(err.message || 'Video generation service unavailable');
  }
}

/**
 * Query Sora 2 video status
 * Poll until status is 'completed' or 'failed'
 */
export async function querySoraVideo(videoId: string): Promise<VideoQueryResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('sora-query-video', {
      body: { videoId },
    });

    if (error) {
      console.error('Sora video query error:', error);
      throw new Error(error.message || 'Failed to query video status');
    }

    return data;
  } catch (err: any) {
    console.error('Sora video query service error:', err);
    throw new Error(err.message || 'Video query service unavailable');
  }
}

// ============================================
// JARVIS AI CHAT SERVICE (100% Operational)
// ============================================

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string; // Base64 without data: prefix
    };
  }>;
}

export interface ChatRequest {
  contents: ChatMessage[];
}

/**
 * Send message to JARVIS AI with streaming response
 * Supports text and image inputs (multi-modal)
 */
export async function sendChatMessage(
  contents: ChatMessage[],
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const { data, error } = await supabase.functions.invoke('chat-llm', {
      body: { contents },
    });

    if (error) {
      console.error('Chat LLM error:', error);
      onError(new Error(error.message || 'Chat service unavailable'));
      return;
    }

    // Handle SSE streaming response
    if (data instanceof ReadableStream) {
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                onChunk(text);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      onComplete();
    } else {
      // Non-streaming response
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      onChunk(text);
      onComplete();
    }
  } catch (err: any) {
    console.error('Chat service error:', err);
    onError(new Error(err.message || 'Chat service unavailable'));
  }
}

/**
 * Helper: Create chat message with text
 */
export function createTextMessage(text: string, role: 'user' | 'model' = 'user'): ChatMessage {
  return {
    role,
    parts: [{ text }],
  };
}

/**
 * Helper: Create chat message with text and image
 */
export function createMultiModalMessage(
  text: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): ChatMessage {
  return {
    role: 'user',
    parts: [
      { text },
      {
        inlineData: {
          mimeType,
          data: imageBase64, // Must be pure base64 without data: prefix
        },
      },
    ],
  };
}

// ============================================
// SERVICE STATUS CHECK
// ============================================

export async function checkServiceHealth(): Promise<{
  imageGeneration: boolean;
  videoGeneration: boolean;
  chatAI: boolean;
}> {
  const health = {
    imageGeneration: false,
    videoGeneration: false,
    chatAI: false,
  };

  try {
    // Test image generation
    const imgTest = await submitImageGeneration({
      contents: [{ parts: [{ text: 'test' }] }],
    });
    health.imageGeneration = imgTest.status === 0;
  } catch (e) {
    console.error('Image generation health check failed:', e);
  }

  try {
    // Test video generation
    const vidTest = await createSoraVideo({
      prompt: 'test',
      size: '720x1280',
      seconds: 4,
    });
    health.videoGeneration = !!vidTest.id;
  } catch (e) {
    console.error('Video generation health check failed:', e);
  }

  try {
    // Test chat AI
    await sendChatMessage(
      [createTextMessage('test')],
      () => {},
      () => {
        health.chatAI = true;
      },
      () => {}
    );
  } catch (e) {
    console.error('Chat AI health check failed:', e);
  }

  return health;
}
