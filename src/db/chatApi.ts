import { supabase } from './supabase';
import type { ChatThread, ChatMessage } from '@/types/types';

// Get all threads for current user
export async function getUserThreads(): Promise<ChatThread[]> {
  const { data, error } = await supabase
    .from('chat_threads')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching threads:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// Create a new thread
export async function createThread(userId: string, title: string): Promise<ChatThread | null> {
  const { data, error } = await supabase
    .from('chat_threads')
    .insert({ user_id: userId, title })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating thread:', error);
    return null;
  }

  return data;
}

// Update thread title
export async function updateThreadTitle(threadId: string, title: string): Promise<boolean> {
  const { error } = await supabase
    .from('chat_threads')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', threadId);

  if (error) {
    console.error('Error updating thread:', error);
    return false;
  }

  return true;
}

// Delete a thread
export async function deleteThread(threadId: string): Promise<boolean> {
  const { error } = await supabase
    .from('chat_threads')
    .delete()
    .eq('id', threadId);

  if (error) {
    console.error('Error deleting thread:', error);
    return false;
  }

  return true;
}

// Get messages for a thread
export async function getThreadMessages(threadId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// Add a message to a thread
export async function addMessage(
  threadId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatMessage | null> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ thread_id: threadId, role, content })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding message:', error);
    return null;
  }

  return data;
}

// Generate a title from the first message
export function generateThreadTitle(firstMessage: string): string {
  const maxLength = 40;
  const cleaned = firstMessage.trim();
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.substring(0, maxLength - 3) + '...';
}
