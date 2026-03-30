import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2, Bot, Globe, Smartphone } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { aiApi } from '@/db/api';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import TitanRobotAdvanced from '@/components/TitanRobotAdvanced';
import { deviceTTS, isDeviceTTSSupported } from '@/utils/deviceTTS';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

// Voice options with descriptions
const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy (Neutral)', description: 'Balanced and clear' },
  { value: 'echo', label: 'Echo (Male)', description: 'Deep and resonant' },
  { value: 'fable', label: 'Fable (British Male)', description: 'Sophisticated and articulate' },
  { value: 'onyx', label: 'Onyx (Strong Male)', description: 'Powerful and authoritative' },
  { value: 'nova', label: 'Nova (Female)', description: 'Warm and friendly' },
  { value: 'shimmer', label: 'Shimmer (Female)', description: 'Bright and energetic' },
];

// Multilingual greetings - 46+ languages supported
const GREETINGS = {
  en: "Hello! I'm Qazyen AI, your advanced AI assistant created by Muhhamed Yasin, known as Munaf. Tell me, how can I help you today?",
  es: "¡Hola! Soy Qazyen AI, tu asistente de IA avanzado creado por Muhhamed Yasin, conocido como Munaf. Dime, ¿cómo puedo ayudarte hoy?",
  fr: "Bonjour! Je suis Qazyen AI, votre assistant IA avancé créé par Muhhamed Yasin, connu sous le nom de Munaf. Dites-moi, comment puis-je vous aider aujourd'hui?",
  de: "Hallo! Ich bin Qazyen AI, Ihr fortschrittlicher KI-Assistent, erstellt von Muhhamed Yasin, bekannt als Munaf. Sagen Sie mir, wie kann ich Ihnen heute helfen?",
  zh: "你好！我是Qazyen AI，由Muhhamed Yasin（人称Munaf）创建的高级AI助手。告诉我，今天我能帮您什么？",
  ja: "こんにちは！私はQazyen AIです。Muhhamed Yasin（Munafとして知られる）によって作成された高度なAIアシスタントです。今日はどのようにお手伝いできますか？",
  ar: "مرحبا! أنا Qazyen AI، مساعدك الذكي المتقدم الذي أنشأه محمد ياسين، المعروف باسم مناف. أخبرني، كيف يمكنني مساعدتك اليوم؟",
  hi: "नमस्ते! मैं Qazyen AI हूं, मुहम्मद यासीन द्वारा बनाया गया आपका उन्नत AI सहायक, जिन्हें मुनाफ के नाम से जाना जाता है। बताइए, आज मैं आपकी कैसे मदद कर सकता हूं?",
  pt: "Olá! Eu sou Qazyen AI, seu assistente de IA avançado criado por Muhhamed Yasin, conhecido como Munaf. Diga-me, como posso ajudá-lo hoje?",
  ru: "Привет! Я Qazyen AI, ваш продвинутый AI-ассистент, созданный Мухаммадом Ясином, известным как Мунаф. Скажите мне, чем я могу вам помочь сегодня?",
  ur: "السلام علیکم! میں Qazyen AI ہوں، محمد یاسین کی تخلیق کردہ آپ کا جدید AI معاون، جنہیں منافع کے نام سے جانا جاتا ہے۔ بتائیں، آج میں آپ کی کیسے مدد کر سکتا ہوں؟",
  mr: "नमस्कार! मी Qazyen AI आहे, मुहम्मद यासीन यांनी तयार केलेला तुमचा प्रगत AI सहाय्यक, ज्यांना मुनाफ म्हणून ओळखले जाते। सांगा, आज मी तुम्हाला कशी मदत करू शकतो?",
  it: "Ciao! Sono Qazyen AI, il tuo assistente IA avanzato creato da Muhhamed Yasin, conosciuto come Munaf. Dimmi, come posso aiutarti oggi?",
  ko: "안녕하세요! 저는 Munaf로 알려진 Muhhamed Yasin이 만든 고급 AI 어시스턴트 Qazyen AI입니다. 오늘 어떻게 도와드릴까요?",
  tr: "Merhaba! Ben Qazyen AI, Munaf olarak bilinen Muhhamed Yasin tarafından oluşturulan gelişmiş AI asistanınızım. Söyleyin, bugün size nasıl yardımcı olabilirim?",
  nl: "Hallo! Ik ben Qazyen AI, uw geavanceerde AI-assistent gemaakt door Muhhamed Yasin, bekend als Munaf. Vertel me, hoe kan ik u vandaag helpen?",
  pl: "Cześć! Jestem Qazyen AI, Twoim zaawansowanym asystentem AI stworzonym przez Muhammada Yasina, znanego jako Munaf. Powiedz mi, jak mogę Ci dzisiaj pomóc?",
  sv: "Hej! Jag är Qazyen AI, din avancerade AI-assistent skapad av Muhhamed Yasin, känd som Munaf. Berätta, hur kan jag hjälpa dig idag?",
  th: "สวัสดี! ฉันคือ Qazyen AI ผู้ช่วย AI ขั้นสูงที่สร้างโดย Muhhamed Yasin ที่รู้จักในนาม Munaf บอกฉันสิ วันนี้ฉันจะช่วยคุณได้อย่างไร?",
  vi: "Xin chào! Tôi là Qazyen AI, trợ lý AI tiên tiến của bạn được tạo bởi Muhhamed Yasin, được biết đến với tên Munaf. Hãy cho tôi biết, hôm nay tôi có thể giúp gì cho bạn?",
};

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'ar', label: 'العربية', flag: '🇸🇦' },
  { value: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { value: 'ur', label: 'اردو', flag: '🇵🇰' },
  { value: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { value: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { value: 'pl', label: 'Polski', flag: '🇵🇱' },
  { value: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { value: 'th', label: 'ไทย', flag: '🇹🇭' },
  { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];

export default function VirtualRobotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [useDeviceTTS, setUseDeviceTTS] = useState(true); // FREE device TTS by default
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Welcome greeting in selected language
    const greetingText = GREETINGS[selectedLanguage as keyof typeof GREETINGS];
    const greeting: Message = {
      id: 'greeting',
      role: 'model',
      content: greetingText,
      timestamp: new Date()
    };
    setMessages([greeting]);
    
    setTimeout(() => {
      if (autoSpeak) {
        speakText(greetingText);
      }
    }, 1000);
  }, [selectedLanguage]);

  // Audio level monitoring for visual feedback
  const monitorAudioLevel = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    microphone.connect(analyser);
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateLevel = () => {
      if (analyserRef.current && isListening) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };
    
    updateLevel();
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAndRespond(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
      };

      monitorAudioLevel(stream);
      recorder.start();
      setMediaRecorder(recorder);
      setIsListening(true);
      toast.success('🎤 Listening... Speak now!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('❌ Failed to access microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    if (mediaRecorder && isListening) {
      mediaRecorder.stop();
      setIsListening(false);
      setMediaRecorder(null);
      toast.info('🛑 Processing your voice...');
    }
  };

  const transcribeAndRespond = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      // Step 1: Transcribe audio to text
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('response_format', 'json');

      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('speech-to-text', {
        body: formData
      });

      if (transcriptionError) {
        const errorMsg = await transcriptionError?.context?.text();
        throw new Error(errorMsg || transcriptionError.message);
      }

      if (!transcriptionData?.text) {
        throw new Error('No transcription received');
      }

      const userText = transcriptionData.text;
      toast.success(`✅ Heard: "${userText.substring(0, 50)}..."`);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Step 2: Get AI response
      const chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      chatHistory.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      const stream = await aiApi.chat(chatHistory);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      // Add placeholder for model response
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessagePlaceholder: Message = {
        id: aiMessageId,
        role: 'model',
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessagePlaceholder]);

      // Stream response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;

            try {
              const data = JSON.parse(jsonStr);
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (text) {
                fullResponse += text;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === aiMessageId ? { ...m, content: fullResponse } : m
                  )
                );
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      // Step 3: Speak the response with strong male robotic voice
      if (autoSpeak && fullResponse) {
        await speakText(fullResponse);
      }

    } catch (error: any) {
      console.error('Conversation error:', error);
      toast.error(`❌ ${error.message || 'Failed to process voice'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    try {
      if (useDeviceTTS && isDeviceTTSSupported()) {
        // FREE: Use device's built-in text-to-speech
        console.log('Using FREE device TTS');
        toast.info('🔊 Speaking with device voice (FREE)');
        
        // Map language codes to device TTS format (46+ languages)
        const langMap: Record<string, string> = {
          'en': 'en-US',
          'es': 'es-ES',
          'fr': 'fr-FR',
          'de': 'de-DE',
          'zh': 'zh-CN',
          'ja': 'ja-JP',
          'ar': 'ar-SA',
          'hi': 'hi-IN',
          'ur': 'ur-PK',
          'mr': 'mr-IN',
          'pt': 'pt-PT',
          'ru': 'ru-RU',
          'it': 'it-IT',
          'ko': 'ko-KR',
          'tr': 'tr-TR',
          'nl': 'nl-NL',
          'pl': 'pl-PL',
          'sv': 'sv-SE',
          'th': 'th-TH',
          'vi': 'vi-VN'
        };

        const deviceLang = langMap[selectedLanguage] || 'en-US';
        
        await deviceTTS.speak(text, {
          lang: deviceLang,
          rate: 1.0,
          pitch: 0.9, // Slightly lower for robotic sound
          volume: 1.0
        });
        
        setIsSpeaking(false);
      } else {
        // PREMIUM: Use API text-to-speech
        console.log('Using API TTS');
        toast.info('🎵 Speaking with premium AI voice');
        
        const audioData = await aiApi.textToSpeech(text, selectedLanguage, selectedVoice);

        if (audioData && audioData.byteLength > 0) {
          const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            
            await audioRef.current.play();
            
            return new Promise<void>((resolve) => {
              if (audioRef.current) {
                audioRef.current.onended = () => {
                  setIsSpeaking(false);
                  URL.revokeObjectURL(audioUrl);
                  resolve();
                };
                audioRef.current.onerror = () => {
                  setIsSpeaking(false);
                  URL.revokeObjectURL(audioUrl);
                  resolve();
                };
              } else {
                setIsSpeaking(false);
                resolve();
              }
            });
          }
        }
      }
    } catch (error: any) {
      console.error('Text-to-speech error:', error);
      
      // Fallback to device TTS if API fails
      if (!useDeviceTTS && isDeviceTTSSupported()) {
        console.log('API TTS failed, falling back to device TTS');
        toast.warning('⚠️ Falling back to device voice (FREE)');
        try {
          const langMap: Record<string, string> = {
            'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
            'zh': 'zh-CN', 'ja': 'ja-JP', 'ar': 'ar-SA', 'hi': 'hi-IN',
            'ur': 'ur-PK', 'mr': 'mr-IN', 'pt': 'pt-PT', 'ru': 'ru-RU',
            'it': 'it-IT', 'ko': 'ko-KR', 'tr': 'tr-TR', 'nl': 'nl-NL',
            'pl': 'pl-PL', 'sv': 'sv-SE', 'th': 'th-TH', 'vi': 'vi-VN'
          };
          const deviceLang = langMap[selectedLanguage] || 'en-US';
          await deviceTTS.speak(text, { lang: deviceLang, rate: 1.0, pitch: 0.9, volume: 1.0 });
        } catch (fallbackError) {
          toast.error(`❌ ${error.message || 'Failed to generate speech'}`);
        }
      } else {
        toast.error(`❌ ${error.message || 'Failed to generate speech'}`);
      }
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    // Stop device TTS
    if (useDeviceTTS) {
      deviceTTS.stop();
    }
    
    // Stop API audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsSpeaking(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      chatHistory.push({
        role: 'user',
        parts: [{ text: currentInput }]
      });

      const stream = await aiApi.chat(chatHistory);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      const aiMessageId = (Date.now() + 1).toString();
      const aiMessagePlaceholder: Message = {
        id: aiMessageId,
        role: 'model',
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessagePlaceholder]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;

            try {
              const data = JSON.parse(jsonStr);
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (text) {
                fullResponse += text;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === aiMessageId ? { ...m, content: fullResponse } : m
                  )
                );
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      if (autoSpeak && fullResponse) {
        await speakText(fullResponse);
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error(`❌ ${error.message || 'Failed to get response'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        {/* Header */}
        <div className="ios-blur border-b border-border/50 ios-shadow bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-aa5142oc9rls.jpg)]">
          <div className="content-column py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ios-shadow">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">Qazyen AI</h1>
                  <p className="text-sm text-[#fbeded]">Advanced AI Voice Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className="gap-2 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqxbvs3e7eo.jpg)]"
                >
                  {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Auto-speak {autoSpeak ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6 p-6 bg-[#000000]">
          {/* 3D Robot */}
          <div className="lg:w-1/3">
            <Card className="ios-card border-0 h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full border-solid rounded-[17px] border-[14.0541px] border-[#2d1b1b42] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqlkrlhtk3k.jpg)]">
                <div className="relative w-full aspect-square max-w-sm">
                  <TitanRobotAdvanced 
                    isListening={isListening} 
                    emotion={isSpeaking ? 'speaking' : isLoading ? 'thinking' : isListening ? 'happy' : 'neutral'}
                  />
                  
                  {/* Status Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 ios-blur px-4 py-2 rounded-full border border-border/50">
                    <p className="text-sm font-medium">
                      {isListening ? (
                        <span className="flex items-center gap-2 text-blue-500">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          Listening...
                        </span>
                      ) : isSpeaking ? (
                        <span className="flex items-center gap-2 text-green-500">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Speaking...
                        </span>
                      ) : isLoading ? (
                        <span className="flex items-center gap-2 text-purple-500">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Thinking...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-2 h-2 bg-gray-400 rounded-full" />
                          Ready
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Voice & Language Settings */}
                <div className="mt-6 w-full space-y-4">
                  {/* FREE Device TTS Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <div>
                        <Label className="text-sm font-semibold text-green-700 dark:text-green-300">
                          FREE Device Voice
                        </Label>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {useDeviceTTS ? 'Using system voice (FREE)' : 'Using premium AI voice'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={useDeviceTTS}
                      onCheckedChange={setUseDeviceTTS}
                      disabled={isLoading || isSpeaking}
                    />
                  </div>

                  {!useDeviceTTS && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Voice Selection (Premium)
                      </Label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isLoading || isSpeaking}>
                        <SelectTrigger className="ios-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VOICE_OPTIONS.map((voice) => (
                            <SelectItem key={voice.value} value={voice.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{voice.label}</span>
                                <span className="text-xs text-muted-foreground">{voice.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Language
                    </Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={isLoading || isSpeaking}>
                      <SelectTrigger className="ios-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqrdwvfnzsw.jpg)]">
                        {LANGUAGE_OPTIONS.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Voice Control */}
                <div className="mt-4 w-full space-y-3">
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading || isSpeaking}
                    className={`w-full h-16 text-lg gap-3 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-6 w-6" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-6 w-6" />
                        Start Talking
                      </>
                    )}
                  </Button>

                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <VolumeX className="h-4 w-4" />
                      Stop Speaking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:w-2/3 flex flex-col">
            <Card className="ios-card border-0 flex-1 flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqu8ihai0ao.jpg)] rounded-[20px]">
                {/* Messages */}
                <div className="flex-1 overflow-auto space-y-4 mb-4 border-solid rounded-[17px] border-[14.0541px] border-[#2d1b1b42] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqluun6kj5s.jpg)]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'ios-blur border border-border/50'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap bg-[#09080800] bg-none rounded-[20px]">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="space-y-3 border-solid rounded-[17px] border-[5px] border-[rgb(234,249,249)] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-afrj019zd7uo.jpg)]">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type or speak your message..."
                    className="ios-input min-h-[80px] resize-none border-none border-[#010f0f] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqvooupr4e8.jpg)] rounded-[20px] border-[0px] border-[#010f0f]"
                    disabled={isLoading || isListening}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading || isListening}
                    className="w-full ios-button gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} className="hidden" />

        {/* Footer */}
        <div className="ios-blur border-t border-border/50 py-3 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqsvuduhzi8.jpg)] rounded-[20px]">
          <div className="content-column">
            <p className="text-center text-[#fdfdfd] text-[16px] border-solid border-[rgb(218,231,231)] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqyshxrj20w.jpg)] border-[2px] rounded-[20px] border-[rgb(218,231,231)]">
              Lifetime Free AI - Unlimited Access
            </p>
            <p className="text-center text-xs mt-1 text-[#f6f6f6] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqxbvs3e7eo.jpg)] rounded-[20px]">
              Presented By: Y A S I N
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
