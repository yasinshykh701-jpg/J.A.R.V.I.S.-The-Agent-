import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Robot3D from '@/components/Robot3D';
import { aiApi } from '@/db/api';
import type { Message } from '@/types/ai';
import { toast } from 'sonner';

// Clean text: remove emojis and extra spaces
const cleanDisplayText = (text: string): string => {
  return text
    // Remove all emojis
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
    .replace(/[\u{E0020}-\u{E007F}]/gu, '') // Tags
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

export default function VirtualRobotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (!audioEnabled) return;
    try {
      const greeting = "Hello! I'm JARVIS AI, your AI assistant. How can I help you today?";
      const audioData = await aiApi.textToSpeech(greeting, 'en', 'onyx'); // Male voice
      const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setIsSpeaking(true);
      audio.play();
      audio.onended = () => setIsSpeaking(false);
    } catch (error) {
      console.error('Failed to play greeting:', error);
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
      toast.info('Recording... Click again to stop');
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
    if (!input.trim()) return;

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
      const systemPrompt = `You are JARVIS AI, a friendly 3D virtual robot assistant created by Yasin. 

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
      
      const contents = [
        {
          role: 'user' as const,
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model' as const,
          parts: [{ text: "Hello! I'm JARVIS AI, your AI assistant created by Yasin. How can I help you today? 🤖" }],
        },
        ...messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user' as const,
          parts: [{ text: input }],
        },
      ];

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

      // Speak the response with deep male robotic voice
      if (aiResponse && audioEnabled) {
        try {
          const audioData = await aiApi.textToSpeech(aiResponse, 'onyx'); // Deep male voice for clear, bold pronunciation
          const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          setIsSpeaking(true);
          audio.play();
          audio.onended = () => setIsSpeaking(false);
        } catch (error) {
          console.error('Failed to play response:', error);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioRef.current && isSpeaking) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
    toast.success(audioEnabled ? 'Audio disabled' : 'Audio enabled');
  };

  return (
    <div className="min-h-screen flex flex-col bg-fixed border-solid border-[1px] border-[rgb(218,226,231)]">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between bg-[#9f94943d]">
          <div className="flex items-center gap-2 xl:gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg xl:text-2xl font-bold gradient-text flex items-center gap-2">
                🤖 Virtual Robot
              </h1>
              <p className="text-xs text-muted-foreground hidden xl:block">Your 3D AI Robot Companion</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleAudio}>
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-2 xl:px-4 py-4 xl:py-6 flex flex-col xl:flex-row gap-4 xl:gap-6 max-w-7xl border-solid bg-[#342c2c] border-[rgb(70,85,94)] border-[0px] rounded-[0px] ml-[0px] mr-[0px] border-[rgb(70,85,94)]">
        {/* 3D Robot Animation Area */}
        <Card className="xl:w-1/2 flex items-center justify-center bg-card/80 backdrop-blur-sm shadow-card min-h-[300px] xl:min-h-[400px] mt-[125px] mb-[1px]">
          <div className="w-full h-full min-h-[300px] xl:min-h-[400px] relative mt-[126px] mb-[1px]">
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[0, 1.5, 5]} />
              <OrbitControls 
                enableZoom={true} 
                enablePan={false}
                minDistance={3}
                maxDistance={8}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 4}
              />
              <ambientLight intensity={0.3} />
              <directionalLight 
                position={[5, 8, 5]} 
                intensity={1.5} 
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-5, 3, -3]} intensity={0.6} color="#00BFFF" />
              <pointLight position={[5, 3, -3]} intensity={0.6} color="#0080FF" />
              <spotLight 
                position={[0, 6, 3]} 
                angle={0.5} 
                penumbra={1} 
                intensity={isSpeaking ? 2.5 : 1.2}
                color={isSpeaking ? "#00BFFF" : "#0080FF"}
                castShadow
              />
              <Robot3D isSpeaking={isSpeaking} />
              {/* Ground plane for shadows */}
              {/* @ts-ignore */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                {/* @ts-ignore */}
                <planeGeometry args={[20, 20]} />
                {/* @ts-ignore */}
                <shadowMaterial opacity={0.3} />
              </mesh>
            </Canvas>
            <div className="absolute bottom-2 xl:bottom-4 left-1/2 transform -translate-x-1/2 text-center bg-card/90 backdrop-blur-sm px-3 xl:px-4 py-1.5 xl:py-2 rounded-lg">
              <h2 className="text-base xl:text-xl font-bold gradient-text mb-0.5 xl:mb-1 font-['BlinkMacSystemFont']">JARVIS AI</h2>
              <p className="text-xs xl:text-sm text-muted-foreground">
                {isLoading ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Listening...'}
              </p>
            </div>
          </div>
        </Card>

        {/* Chat Area */}
        <div className="xl:w-1/2 flex flex-col gap-4">
          {/* Messages */}
          <Card className="flex-1 bg-card/80 backdrop-blur-sm shadow-card overflow-hidden flex flex-col min-h-[400px] mt-[12px] mb-[1px]">
            <ScrollArea className="flex-1 p-4 border-solid border-[0px] rounded-[0px] ml-[0px] mr-[0px] bg-[transparent00] border-[rgb(70,85,94)] mt-[1px]">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Start a conversation</p>
                    <p className="text-sm">Your robot companion is ready to chat!</p>
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">🤖</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{cleanDisplayText(message.content)}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={scrollRef} />
            </ScrollArea>
          </Card>

          {/* Input Area */}
          <Card className="p-3 xl:p-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm shadow-card">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Talk to your robot companion..."
                  className="min-h-[50px] xl:min-h-[60px] resize-none bg-background/50 text-sm xl:text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`${isRecording ? 'text-destructive' : ''} h-10 w-10 xl:h-10 xl:w-10`}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 h-10 w-10 xl:h-10 xl:w-10"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
