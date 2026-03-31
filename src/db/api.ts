import { supabase } from './supabase';
import type { ChatContent, ImageGenerationTask, VideoGenerationTask, TranscriptionResult } from '@/types/ai';

export const aiApi = {
  // Chat with LLM
  async chat(contents: ChatContent[]): Promise<ReadableStream> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/chat-llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error in chat-llm:', errorText);
      throw new Error(errorText || 'Failed to chat with AI');
    }

    if (!response.body) {
      throw new Error('No response body received from AI');
    }

    return response.body;
  },

  // Text to Speech with emoji/special character removal - BASS ROBOTIC VOICE - Multilingual Support
  async textToSpeech(input: string, language = 'en', voice = 'onyx'): Promise<ArrayBuffer> {
    // Clean text: remove emojis, markdown formatting, and special characters
    let cleanText = input
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      return new ArrayBuffer(0);
    }

    console.log('TTS Request:', { text: cleanText.substring(0, 50), voice, language });

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/functions/v1/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({ input: cleanText, voice, response_format: 'mp3', language }),
    });

    console.log('TTS Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error in text-to-speech:', errorText);
      throw new Error(errorText || 'Failed to convert text to speech');
    }

    const contentType = response.headers.get('content-type');
    console.log('TTS Response Content-Type:', contentType);

    // Check if response is JSON (error) or binary (audio)
    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      console.error('TTS returned JSON error:', errorData);
      throw new Error(errorData.error || 'Failed to convert text to speech');
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('TTS Audio Buffer Size:', arrayBuffer.byteLength);
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Received empty audio data');
    }

    return arrayBuffer;
  },

  // Speech to Text
  async speechToText(file: File, speakerLabels = false): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('response_format', 'verbose_json');
    if (speakerLabels) {
      formData.append('speaker_labels', 'true');
    }

    const { data, error } = await supabase.functions.invoke('speech-to-text', {
      body: formData,
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in speech-to-text:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to transcribe audio');
    }

    return data;
  },

  // Image Generation - Advanced API with polling
  async generateImage(prompt: string, aspect_ratio = '1:1', n = 1): Promise<{ image_urls: string[]; success_count: number }> {
    // Step 1: Submit image generation task
    const contents = [{
      parts: [{ text: prompt }]
    }];

    const { data: submitData, error: submitError } = await supabase.functions.invoke('image-generation-submit', {
      body: { contents },
    });

    if (submitError) {
      const errorMsg = await submitError?.context?.text();
      console.error('Edge function error in image-generation-submit:', errorMsg || submitError?.message);
      throw new Error(errorMsg || submitError?.message || 'Failed to submit image generation');
    }

    if (submitData.status !== 0) {
      throw new Error(submitData.message || 'Failed to submit image generation');
    }

    const taskId = submitData.data.taskId;
    console.log('Image generation task submitted:', taskId);

    // Step 2: Poll for task completion (every 8 seconds, max 10 minutes)
    const maxAttempts = 75; // 75 * 8 seconds = 10 minutes
    let attempts = 0;

    while (attempts < maxAttempts) {
      // Wait 8 seconds before polling
      await new Promise(resolve => setTimeout(resolve, 8000));
      attempts++;

      const { data: queryData, error: queryError } = await supabase.functions.invoke('image-generation-query', {
        body: { taskId },
      });

      if (queryError) {
        const errorMsg = await queryError?.context?.text();
        console.error('Edge function error in image-generation-query:', errorMsg || queryError?.message);
        throw new Error(errorMsg || queryError?.message || 'Failed to query image generation');
      }

      if (queryData.status !== 0) {
        throw new Error(queryData.message || 'Failed to query image generation');
      }

      const taskStatus = queryData.data.status;
      console.log(`Image generation status (attempt ${attempts}):`, taskStatus);

      if (taskStatus === 'SUCCESS') {
        // Extract image from result
        const result = queryData.data.result;
        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const markdownText = result.candidates[0].content.parts[0].text;
          // Extract Base64 image from markdown format: ![image](data:image/jpeg;base64,XXXXX)
          const match = markdownText.match(/!\[image\]\((data:image\/[^;]+;base64,[^)]+)\)/);
          if (match && match[1]) {
            return {
              image_urls: [match[1]],
              success_count: 1,
            };
          }
        }
        throw new Error('Image generated but could not extract image data');
      } else if (taskStatus === 'FAILED') {
        const errorMsg = queryData.data.error?.message || 'Image generation failed';
        throw new Error(errorMsg);
      } else if (taskStatus === 'TIMEOUT') {
        throw new Error('Image generation timed out');
      }
      // Status is PENDING, continue polling
    }

    throw new Error('Image generation timed out after 10 minutes');
  },

  // Image-to-Image Generation - Advanced API with reference image
  async generateImageFromImage(prompt: string, referenceImageBase64: string, mimeType = 'image/png'): Promise<{ image_urls: string[]; success_count: number }> {
    // Remove data URL prefix if present
    const base64Data = referenceImageBase64.includes('base64,') 
      ? referenceImageBase64.split('base64,')[1] 
      : referenceImageBase64;

    // Step 1: Submit image generation task with reference image
    const contents = [{
      parts: [
        {
          inline_data: {
            mime_type: mimeType,
            data: base64Data,
          }
        },
        { text: prompt }
      ]
    }];

    const { data: submitData, error: submitError } = await supabase.functions.invoke('image-generation-submit', {
      body: { contents },
    });

    if (submitError) {
      const errorMsg = await submitError?.context?.text();
      console.error('Edge function error in image-generation-submit:', errorMsg || submitError?.message);
      throw new Error(errorMsg || submitError?.message || 'Failed to submit image generation');
    }

    if (submitData.status !== 0) {
      throw new Error(submitData.message || 'Failed to submit image generation');
    }

    const taskId = submitData.data.taskId;
    console.log('Image-to-image generation task submitted:', taskId);

    // Step 2: Poll for task completion (every 8 seconds, max 10 minutes)
    const maxAttempts = 75;
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      attempts++;

      const { data: queryData, error: queryError } = await supabase.functions.invoke('image-generation-query', {
        body: { taskId },
      });

      if (queryError) {
        const errorMsg = await queryError?.context?.text();
        console.error('Edge function error in image-generation-query:', errorMsg || queryError?.message);
        throw new Error(errorMsg || queryError?.message || 'Failed to query image generation');
      }

      if (queryData.status !== 0) {
        throw new Error(queryData.message || 'Failed to query image generation');
      }

      const taskStatus = queryData.data.status;
      console.log(`Image-to-image generation status (attempt ${attempts}):`, taskStatus);

      if (taskStatus === 'SUCCESS') {
        const result = queryData.data.result;
        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const markdownText = result.candidates[0].content.parts[0].text;
          const match = markdownText.match(/!\[image\]\((data:image\/[^;]+;base64,[^)]+)\)/);
          if (match && match[1]) {
            return {
              image_urls: [match[1]],
              success_count: 1,
            };
          }
        }
        throw new Error('Image generated but could not extract image data');
      } else if (taskStatus === 'FAILED') {
        const errorMsg = queryData.data.error?.message || 'Image generation failed';
        throw new Error(errorMsg);
      } else if (taskStatus === 'TIMEOUT') {
        throw new Error('Image generation timed out');
      }
    }

    throw new Error('Image generation timed out after 10 minutes');
  },

  // Video Generation - Kling Text-to-Video
  async generateVideo(prompt: string, duration = '5', aspect_ratio = '16:9'): Promise<{ task_id: string }> {
    const { data, error } = await supabase.functions.invoke('kling-text-to-video', {
      body: { prompt, duration, aspect_ratio, model_name: 'kling-v2-5-turbo' },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in kling-text-to-video:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to generate video');
    }

    if (data.code !== 0) {
      throw new Error(data.message || 'Failed to generate video');
    }

    return { task_id: data.data?.task_id };
  },

  // Video Generation - Query Kling Video Status
  async queryVideoStatus(task_id: string): Promise<{ task_status: string; video_url?: string }> {
    const { data, error } = await supabase.functions.invoke('kling-query-video', {
      body: { task_id },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in kling-query-video:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to query video status');
    }

    if (data.code !== 0) {
      throw new Error(data.message || 'Failed to query video status');
    }

    return {
      task_status: data.data?.task_status,
      video_url: data.data?.task_result?.videos?.[0]?.url,
    };
  },

  // Legacy Image Generation - Submit (kept for backward compatibility)
  async submitImageGeneration(contents: Array<{
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }>;
  }>): Promise<{ taskId: string }> {
    const { data, error } = await supabase.functions.invoke('image-generation-submit', {
      body: { contents },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in image-generation-submit:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to submit image generation');
    }

    if (data.status !== 0) {
      throw new Error(data.message || 'Failed to submit image generation');
    }

    return { taskId: data.data.taskId };
  },

  // Legacy Image Generation - Query (kept for backward compatibility)
  async queryImageGeneration(taskId: string): Promise<ImageGenerationTask> {
    const { data, error } = await supabase.functions.invoke('image-generation-query', {
      body: { taskId },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in image-generation-query:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to query image generation');
    }

    if (data.status !== 0) {
      throw new Error(data.message || 'Failed to query image generation');
    }

    return data.data;
  },

  // Legacy Video Generation - Text to Video (kept for backward compatibility)
  async submitTextToVideo(prompt: string, duration = '5'): Promise<{ task_id: string }> {
    const { data, error } = await supabase.functions.invoke('video-text-to-video', {
      body: { prompt, duration },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in video-text-to-video:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to submit video generation');
    }

    if (data.code !== 0) {
      throw new Error(data.message || 'Failed to submit video generation');
    }

    return { task_id: data.data.task_id };
  },

  // Video Generation - Query Text to Video
  async queryTextToVideo(taskId: string): Promise<VideoGenerationTask> {
    const { data, error } = await supabase.functions.invoke('video-query-text-to-video', {
      body: { id: taskId },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in video-query-text-to-video:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to query video generation');
    }

    if (data.code !== 0) {
      throw new Error(data.message || 'Failed to query video generation');
    }

    return data.data;
  },

  // Video Generation - Image to Video
  async submitImageToVideo(image: string, prompt: string, duration = '5'): Promise<{ task_id: string }> {
    const { data, error } = await supabase.functions.invoke('video-image-to-video', {
      body: { image, prompt, duration, model_name: 'kling-v2-1' },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in video-image-to-video:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to submit image to video');
    }

    if (data.code !== 0) {
      throw new Error(data.message || 'Failed to submit image to video');
    }

    return { task_id: data.data.task_id };
  },

  // Video Generation - Query Image to Video
  async queryImageToVideo(taskId: string): Promise<VideoGenerationTask> {
    const { data, error } = await supabase.functions.invoke('video-query-image-to-video', {
      body: { id: taskId },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in video-query-image-to-video:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to query image to video');
    }

    if (data.code !== 0) {
      throw new Error(data.message || 'Failed to query image to video');
    }

    return data.data;
  },

  // Helper function to convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Helper function to compress image
  async compressImage(file: File, maxSizeMB = 1): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize to max 1080p
          const maxDimension = 1080;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Try different quality levels
          let quality = 0.8;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }

                if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
                  const reader2 = new FileReader();
                  reader2.onload = () => {
                    const base64 = (reader2.result as string).split(',')[1];
                    resolve(base64);
                  };
                  reader2.readAsDataURL(blob);
                } else {
                  quality -= 0.1;
                  tryCompress();
                }
              },
              'image/webp',
              quality
            );
          };

          tryCompress();
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};
