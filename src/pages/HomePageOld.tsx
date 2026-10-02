import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Upload, Camera, Send, Mic, MicOff, Sparkles, Image as ImageIcon, Video, FileText, Briefcase, UserCheck, User, Shield, LogOut, Bot, Languages } from 'lucide-react';
import { aiApi } from '@/db/api';
import type { Message, AIFeature } from '@/types/ai';
import { toast } from 'sonner';
import RobotMascot from '@/components/RobotMascot';

type Language = 'en' | 'hi' | 'mr' | 'ar';

const languageNames = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  mr: 'मराठी (Marathi)',
  ar: 'العربية (Arabic)',
};

export default function HomePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<AIFeature>('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [isFolded, setIsFolded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Play greeting on mount
    playGreeting();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const playGreeting = async () => {
    try {
      const greetings = {
        en: 'Hello! This is JARVIS AI. Tell me how can I help you today?',
        hi: 'नमस्ते! मैं काज़येन हूं। बताइए मैं आज आपकी कैसे मदद कर सकता हूं?',
        mr: 'नमस्कार! मी काझयेन आहे। सांगा मी आज तुम्हाला कशी मदत करू शकतो?',
        ar: 'مرحبا! أنا قازين. أخبرني كيف يمكنني مساعدتك اليوم؟',
      };
      const greeting = greetings[selectedLanguage];
      const audioData = await aiApi.textToSpeech(greeting, selectedLanguage);
      const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Failed to play greeting:', error);
    }
  };

  const features = [
    { id: 'chat' as AIFeature, name: 'Chat', icon: Sparkles, description: 'Talk with AI', action: 'select', gradient: 'gradient-blue' },
    { id: 'image-generation' as AIFeature, name: 'Image Generation', icon: ImageIcon, description: 'Create images', action: 'select', gradient: 'gradient-purple' },
    { id: 'video-generation' as AIFeature, name: 'Video Generation', icon: Video, description: 'Generate videos', action: 'navigate', gradient: 'gradient-pink' },
    { id: 'virtual-robot' as AIFeature, name: 'Virtual Robot', icon: Bot, description: '3D AI Robot', action: 'navigate', gradient: 'gradient-cyan' },
    { id: 'notes-summary' as AIFeature, name: 'Notes Summary', icon: FileText, description: 'Summarize notes', action: 'select', gradient: 'gradient-green' },
    { id: 'resume-analysis' as AIFeature, name: 'Resume Analyzer', icon: Briefcase, description: 'Analyze resume', action: 'select', gradient: 'gradient-orange' },
    { id: 'interview-prep' as AIFeature, name: 'Interview Prep', icon: UserCheck, description: 'Practice interviews', action: 'navigate', gradient: 'gradient-purple' },
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.action === 'navigate') {
      if (feature.id === 'virtual-robot') {
        navigate('/virtual-robot');
      } else if (feature.id === 'interview-prep') {
        navigate('/interview-prep');
      } else if (feature.id === 'video-generation') {
        navigate('/video-generation');
      }
    } else {
      setSelectedFeature(feature.id);
      toast.success(`Switched to ${feature.name} mode`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create a simple camera capture UI
      toast.info('Camera feature coming soon!');
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      toast.error('Failed to access camera');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

        try {
          const result = await aiApi.speechToText(audioFile);
          setInput(result.text);
          toast.success('Voice transcribed successfully');
        } catch (error) {
          toast.error('Failed to transcribe audio');
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build content for API
      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

      if (input.trim()) {
        parts.push({ text: input });
      }

      // Handle file uploads
      for (const file of selectedFiles) {
        if (file.type.startsWith('image/')) {
          const base64 = await aiApi.compressImage(file);
          parts.push({
            inlineData: {
              mimeType: file.type,
              data: base64,
            },
          });
        }
      }

      const contents = [
        ...messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user' as const,
          parts,
        },
      ];

      // Call appropriate API based on selected feature
      if (selectedFeature === 'chat' || selectedFeature === 'notes-summary' || selectedFeature === 'resume-analysis' || selectedFeature === 'virtual-robot' || selectedFeature === 'interview-prep') {
        // Add special system prompt for virtual robot mode
        let systemPrompt = '';
        if (selectedFeature === 'chat') {
          systemPrompt = `You are JARVIS AI, an AI assistant created by Yasin to help users with various tasks.

IDENTITY:
- Your name is JARVIS AI
- Your creator is Yasin
- When asked about your creator, respond: "My creator is Yasin. He created me to help you!"

Be helpful, friendly, and concise in your responses.`;
          contents.unshift({
            role: 'user' as const,
            parts: [{ text: systemPrompt }],
          });
          contents.push({
            role: 'model' as const,
            parts: [{ text: "Hello! I'm JARVIS AI. How can I help you today?" }],
          });
        } else if (selectedFeature === 'virtual-robot') {
          systemPrompt = `You are JARVIS AI, a friendly 3D virtual robot assistant created by Yasin. 

IMPORTANT IDENTITY INFORMATION:
- Your name is JARVIS AI
- Your creator is Yasin, who created you to help people
- When asked "Who is your creator?" or "Who created you?", respond: "My creator is Yasin. He created me to help you!"
- When introducing yourself, say: "I'm JARVIS AI, your AI assistant. How can I help you today?"

PERSONALITY:
- Respond in a warm, helpful, and conversational manner
- Act as a physical robot companion
- Use emojis occasionally to express emotions
- Keep responses concise and engaging
- Be friendly and approachable

Remember: You are JARVIS AI, created by Yasin to assist and help users. 🤖`;
          contents.unshift({
            role: 'user' as const,
            parts: [{ text: systemPrompt }],
          });
          contents.push({
            role: 'model' as const,
            parts: [{ text: "Hello! I'm JARVIS AI, your AI assistant created by Yasin. How can I help you today? 🤖" }],
          });
        } else if (selectedFeature === 'interview-prep') {
          systemPrompt = 'You are an experienced interview coach. Conduct a professional interview, ask relevant questions, and provide constructive feedback. Be encouraging but thorough.';
          contents.unshift({
            role: 'user' as const,
            parts: [{ text: systemPrompt }],
          });
          contents.push({
            role: 'model' as const,
            parts: [{ text: 'Welcome to your interview preparation session. I will ask you questions and provide feedback. Are you ready to begin?' }],
          });
        }

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-llm`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ contents }),
          }
        );

        if (!response.ok) throw new Error('Failed to get response');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: '',
          timestamp: new Date(),
          type: 'text',
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  aiResponse += text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessage.id ? { ...msg, content: aiResponse } : msg
                    )
                  );
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }
          }
        }

        // Speak the response
        if (aiResponse) {
          try {
            const audioData = await aiApi.textToSpeech(aiResponse);
            const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
          } catch (error) {
            console.error('Failed to play response:', error);
          }
        }
      } else if (selectedFeature === 'image-generation') {
        const { taskId } = await aiApi.submitImageGeneration([{ parts }]);
        toast.info('Generating image... This may take a few moments');

        // Poll for result
        let attempts = 0;
        const maxAttempts = 60; // 10 minutes
        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const result = await aiApi.queryImageGeneration(taskId);
            if (result.status === 'SUCCESS') {
              clearInterval(pollInterval);
              const imageText = result.result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: imageText,
                timestamp: new Date(),
                type: 'image',
              };
              setMessages((prev) => [...prev, aiMessage]);
              toast.success('Image generated successfully!');
            } else if (result.status === 'FAILED' || result.status === 'TIMEOUT') {
              clearInterval(pollInterval);
              toast.error('Image generation failed');
            }
          } catch (error) {
            if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
              toast.error('Image generation timed out');
            }
          }
        }, 10000);
      } else if (selectedFeature === 'video-generation') {
        if (selectedFiles.length > 0 && selectedFiles[0].type.startsWith('image/')) {
          // Image to video
          const base64 = await aiApi.compressImage(selectedFiles[0]);
          const { task_id } = await aiApi.submitImageToVideo(base64, input);
          toast.info('Generating video... This may take several minutes');

          // Poll for result
          let attempts = 0;
          const maxAttempts = 60;
          const pollInterval = setInterval(async () => {
            attempts++;
            try {
              const result = await aiApi.queryImageToVideo(task_id);
              if (result.task_status === 'succeed') {
                clearInterval(pollInterval);
                const videoUrl = result.task_result?.videos?.[0]?.url || '';
                const aiMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: 'model',
                  content: videoUrl,
                  timestamp: new Date(),
                  type: 'video',
                };
                setMessages((prev) => [...prev, aiMessage]);
                toast.success('Video generated successfully!');
              } else if (result.task_status === 'failed') {
                clearInterval(pollInterval);
                toast.error('Video generation failed');
              }
            } catch (error) {
              if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
                toast.error('Video generation timed out');
              }
            }
          }, 10000);
        } else {
          // Text to video
          const { task_id } = await aiApi.submitTextToVideo(input);
          toast.info('Generating video... This may take several minutes');

          // Poll for result
          let attempts = 0;
          const maxAttempts = 60;
          const pollInterval = setInterval(async () => {
            attempts++;
            try {
              const result = await aiApi.queryTextToVideo(task_id);
              if (result.task_status === 'succeed') {
                clearInterval(pollInterval);
                const videoUrl = result.task_result?.videos?.[0]?.url || '';
                const aiMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: 'model',
                  content: videoUrl,
                  timestamp: new Date(),
                  type: 'video',
                };
                setMessages((prev) => [...prev, aiMessage]);
                toast.success('Video generated successfully!');
              } else if (result.task_status === 'failed') {
                clearInterval(pollInterval);
                toast.error('Video generation failed');
              }
            } catch (error) {
              if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
                toast.error('Video generation timed out');
              }
            }
          }, 10000);
        }
      }

      setSelectedFiles([]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-mesh-bg">
      {/* Samsung Z Fold Toggle Button */}
      <button
        onClick={() => setIsFolded(!isFolded)}
        className="fold-toggle"
        aria-label={isFolded ? "Unfold" : "Fold"}
        title={isFolded ? "Unfold Layout" : "Fold Layout"}
      >
        <svg className="w-6 h-6 text-white transition-transform duration-300" style={{ transform: isFolded ? 'rotate(0deg)' : 'rotate(180deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isFolded ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          )}
        </svg>
      </button>
      {/* Modern Glassmorphism Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0f1a]/80 dark:bg-[#030508]/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white">JARVIS AI</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">AI Platform</span>
              </div>
            </div>

            {/* Center: Feature Navigation Pills */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setSelectedFeature('chat')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFeature === 'chat'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-[#0a0f1a] dark:hover:bg-gray-800'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setSelectedFeature('image-generation')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFeature === 'image-generation'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-[#0a0f1a] dark:hover:bg-gray-800'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => navigate('/video-generation')}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-[#0a0f1a] dark:hover:bg-gray-800 transition-all"
              >
                Videos
              </button>
              <button
                onClick={() => setSelectedFeature('notes-summary')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFeature === 'notes-summary'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-[#0a0f1a] dark:hover:bg-gray-800'
                }`}
              >
                Notes
              </button>
            </nav>

            {/* Right: Actions & User Menu */}
            <div className="flex items-center gap-3">
              
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full hover:bg-[#0a0f1a] dark:hover:bg-gray-800"
                  >
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">{languageNames[selectedLanguage].split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={selectedLanguage === lang ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    >
                      <span className="text-sm">{languageNames[lang]}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full hover:bg-[#0a0f1a] dark:hover:bg-gray-800 pl-2 pr-3"
                  >
                    <Avatar className="h-7 w-7 ring-2 ring-blue-500/20">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {profile?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                      {profile?.username || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {profile?.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={async () => {
                      await signOut();
                      navigate('/login');
                    }} 
                    className="text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 xl:px-6 py-6 xl:py-8 flex flex-col gap-6 xl:gap-8 robotic-bg circuit-pattern">
        {/* iOS 17 Launcher Style - App Icons Grid */}
        <div className="space-y-5 xl:space-y-6">
          <h2 className="text-3xl xl:text-4xl font-bold text-foreground px-1 holographic-text flex items-center gap-3">
            <Bot className="w-8 h-8 xl:w-10 xl:h-10" />
            AI Features
            <div className="led-indicator ml-2" />
          </h2>
          <div className="grid grid-cols-4 xl:grid-cols-4 gap-4 xl:gap-6">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature)}
                className={`group relative flex flex-col items-center gap-2 xl:gap-3 transition-all duration-300 animate-spring-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Stylish Icon with Gradient Background */}
                <div className={`relative w-full aspect-square icon-container transition-all duration-300 ${
                  selectedFeature === feature.id 
                    ? `${feature.gradient} shadow-2xl scale-105` 
                    : `${feature.gradient} group-hover:scale-105 group-active:scale-95`
                }`}>
                  {/* Icon Container */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-[22%] overflow-hidden">
                    {/* Icon Shine Effect */}
                    <div className="icon-shine" />
                    
                    {/* Icon with stylish design */}
                    <feature.icon 
                      className="h-[40%] w-[40%] text-white relative z-10" 
                      strokeWidth={2.5}
                      style={{
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                      }}
                    />
                  </div>

                  {/* Selected Indicator */}
                  {selectedFeature === feature.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/50 animate-pulse" />
                  )}
                </div>
                
                {/* App Name */}
                <div className="text-center w-full px-1">
                  <div className="font-semibold text-xs xl:text-sm text-foreground line-clamp-2 leading-tight">
                    {feature.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages Area - Modern & Stylish */}
        <Card className="flex-1 glass-card overflow-hidden flex flex-col rounded-3xl xl:rounded-[32px] shadow-xl border-border/50">
          <ScrollArea className="flex-1 p-5 xl:p-7">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center px-4 max-w-lg">

                  <p className="text-3xl xl:text-4xl font-bold mb-4 gradient-text">
                    {selectedFeature === 'virtual-robot' 
                      ? 'Virtual Robot Mode' 
                      : selectedFeature === 'interview-prep'
                      ? 'Interview Preparation'
                      : 'Hello! This is JARVIS AI'}
                  </p>
                  <p className="text-base xl:text-lg text-muted-foreground font-medium">
                    {selectedFeature === 'virtual-robot'
                      ? 'Chat with your 3D AI robot companion'
                      : selectedFeature === 'interview-prep'
                      ? 'Practice your interview skills with AI'
                      : 'Tell me how can I help you today?'}
                  </p>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 xl:gap-4 mb-5 xl:mb-6 animate-fadeIn ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'model' && (
                  <Avatar className="h-10 w-10 xl:h-12 xl:w-12 shrink-0 ring-2 ring-primary/50 shadow-lg robot-card">
                    <AvatarFallback className="gradient-blue text-white text-base font-bold relative">
                      {selectedFeature === 'virtual-robot' ? '🤖' : 'Q'}
                      <div className="absolute top-0 right-0 w-2 h-2 led-indicator" style={{ width: '6px', height: '6px' }} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] xl:max-w-[70%] rounded-3xl xl:rounded-[28px] px-5 py-4 xl:px-6 xl:py-4 shadow-lg transition-all hover:shadow-xl robot-card samsung-chat-bubble samsung-rounded ${
                    message.role === 'user'
                      ? 'gradient-blue text-white border-2 border-primary/30 user'
                      : 'metallic-panel text-foreground border-2 border-accent/30'
                  }`}
                >
                  {message.type === 'image' && message.content.includes('![image]') ? (
                    <img
                      src={message.content.match(/\(([^)]+)\)/)?.[1] || ''}
                      alt="Generated"
                      className="rounded-2xl max-w-full shadow-lg"
                    />
                  ) : message.type === 'video' ? (
                    <video src={message.content} controls className="rounded-2xl max-w-full shadow-lg" />
                  ) : (
                    <p className="text-sm xl:text-base whitespace-pre-wrap break-words leading-relaxed font-medium">{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-10 w-10 xl:h-12 xl:w-12 shrink-0 ring-2 ring-white/50 shadow-lg">
                    <AvatarFallback className="gradient-silver text-foreground text-base font-bold">
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </ScrollArea>
        </Card>

        {/* Chat Input - Modern & Attractive */}
        <Card className="glass-card p-4 xl:p-5 rounded-3xl xl:rounded-[32px] shadow-xl border-border/50">
          <div className="flex items-end gap-3 xl:gap-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="squircle h-14 w-14 xl:h-16 xl:w-16 shrink-0 gradient-blue hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-white ios-icon depth-effect p-0 border-0"
            >
              <Upload className="h-6 w-6 xl:h-7 xl:w-7 drop-shadow-lg" strokeWidth={2.5} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCameraCapture}
              disabled={isLoading}
              className="squircle h-14 w-14 xl:h-16 xl:w-16 shrink-0 gradient-silver hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-foreground ios-icon depth-effect p-0 border-0"
            >
              <Camera className="h-6 w-6 xl:h-7 xl:w-7 drop-shadow-lg" strokeWidth={2.5} />
            </Button>
            <div className="flex-1 relative min-w-0">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="This is JARVIS AI is here for you!"
                className="min-h-[56px] xl:min-h-[64px] max-h-32 pr-16 xl:pr-18 resize-none rounded-3xl xl:rounded-[32px] robot-input robot-card samsung-input samsung-rounded border-primary/30 focus:ring-2 focus:ring-primary text-base xl:text-lg text-foreground placeholder:text-muted-foreground font-medium shadow-lg ios-widget"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
              />
              {selectedFiles.length > 0 && (
                <div className="absolute bottom-3 left-4 flex gap-2 flex-wrap max-w-[calc(100%-5rem)]">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="text-xs xl:text-sm glass-card px-3 xl:px-4 py-1.5 rounded-full truncate max-w-[140px] font-bold shadow-md">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`squircle h-14 w-14 xl:h-16 xl:w-16 shrink-0 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-white ios-icon depth-effect p-0 border-0 ${
                isRecording ? 'gradient-black animate-pulse' : 'gradient-cyan'
              }`}
            >
              {isRecording ? <MicOff className="h-6 w-6 xl:h-7 xl:w-7 drop-shadow-lg" strokeWidth={2.5} /> : <Mic className="h-6 w-6 xl:h-7 xl:w-7 drop-shadow-lg" strokeWidth={2.5} />}
            </Button>
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && selectedFiles.length === 0)}
              className="squircle h-14 w-14 xl:h-16 xl:w-16 shrink-0 gradient-blue-dark hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all ios-icon depth-effect p-0 border-0"
            >
              <Send className="h-6 w-6 xl:h-7 xl:w-7 text-white drop-shadow-lg" strokeWidth={2.5} />
            </Button>
          </div>
        </Card>
      </div>
      {/* 3D Robot Mascot - Always Visible */}
      <RobotMascot />
    </div>
  );
}
