import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ChatThread, ChatMessage } from '@/types/types';
import {
  getUserThreads,
  createThread,
  deleteThread,
  getThreadMessages,
  addMessage,
  generateThreadTitle,
  updateThreadTitle
} from '@/db/chatApi';
import { useAuth } from './AuthContext';
import { askJarvis } from '@/services/jarvisLocal';

interface ChatHistoryContextType {
  threads: ChatThread[];
  currentThread: ChatThread | null;
  messages: ChatMessage[];
  isLoading: boolean;
  createNewThread: () => Promise<void>;
  selectThread: (threadId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteThreadById: (threadId: string) => Promise<void>;
  refreshThreads: () => Promise<void>;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load threads when user logs in
  useEffect(() => {
    if (profile?.id) {
      loadThreads();
    } else {
      setThreads([]);
      setCurrentThread(null);
      setMessages([]);
    }
  }, [profile?.id]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const data = await getUserThreads();
      setThreads(data);
      
      // Auto-select the most recent thread if none selected
      if (!currentThread && data.length > 0) {
        await selectThread(data[0].id);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewThread = async () => {
    if (!profile?.id) return;

    setIsLoading(true);
    try {
      const newThread = await createThread(profile.id, 'New Conversation');
      if (newThread) {
        setThreads(prev => [newThread, ...prev]);
        setCurrentThread(newThread);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectThread = async (threadId: string) => {
    setIsLoading(true);
    try {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        setCurrentThread(thread);
        const threadMessages = await getThreadMessages(threadId);
        setMessages(threadMessages);
      }
    } catch (error) {
      console.error('Error selecting thread:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentThread || !profile?.id) {
      // Create a new thread if none exists
      await createNewThread();
      // Wait a bit for the thread to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!currentThread) return;

    try {
      // Add user message
      const userMessage = await addMessage(currentThread.id, 'user', content);
      if (userMessage) {
        setMessages(prev => [...prev, userMessage]);

        // Update thread title if it's the first message
        if (messages.length === 0) {
          const newTitle = generateThreadTitle(content);
          await updateThreadTitle(currentThread.id, newTitle);
          setThreads(prev =>
            prev.map(t => (t.id === currentThread.id ? { ...t, title: newTitle } : t))
          );
          setCurrentThread(prev => (prev ? { ...prev, title: newTitle } : null));
        }

        // Generate AI response using real AI API
        setTimeout(async () => {
          try {
            // Check for creator question
            const lowerContent = content.toLowerCase();
            let aiResponse: string;
            
            if (lowerContent.includes('who is your creator') || 
                lowerContent.includes('who created you') || 
                lowerContent.includes('who made you') ||
                lowerContent.includes('your creator')) {
              aiResponse = "My creator is Muhhamed Yasin (also known as Munaf) is referenced in the JARVIS AI project as the creator of the application.";
              
              const assistantMessage = await addMessage(currentThread.id, 'assistant', aiResponse);
              if (assistantMessage) {
                setMessages(prev => [...prev, assistantMessage]);
              }
            } else {
              try {
                const jarvisResult = await askJarvis(content, profile?.username);
                const assistantMessage = await addMessage(currentThread.id, 'assistant', jarvisResult.response);
                if (assistantMessage) {
                  setMessages(prev => [...prev, assistantMessage]);
                }
              } catch (error) {
                console.error('Local J.A.R.V.I.S. response error:', error);
                const fallbackMessage = await addMessage(
                  currentThread.id,
                  'assistant',
                  'J.A.R.V.I.S. is online but the local brain service is unavailable right now.'
                );
                if (fallbackMessage) {
                  setMessages(prev => [...prev, fallbackMessage]);
                }
              }
            }
          } catch (error) {
            console.error('AI response error:', error);
            const errorMessage = await addMessage(
              currentThread.id, 
              'assistant', 
              'I apologize, but I encountered an error processing your request. Please try again.'
            );
            if (errorMessage) {
              setMessages(prev => [...prev, errorMessage]);
            }
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteThreadById = async (threadId: string) => {
    try {
      const success = await deleteThread(threadId);
      if (success) {
        setThreads(prev => prev.filter(t => t.id !== threadId));
        if (currentThread?.id === threadId) {
          setCurrentThread(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  const refreshThreads = async () => {
    await loadThreads();
  };

  return (
    <ChatHistoryContext.Provider
      value={{
        threads,
        currentThread,
        messages,
        isLoading,
        createNewThread,
        selectThread,
        sendMessage,
        deleteThreadById,
        refreshThreads,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
}

export function useChatHistory() {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error('useChatHistory must be used within ChatHistoryProvider');
  }
  return context;
}
