import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2, Bot, Globe, Smartphone } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import TitanRobotAdvanced from '@/components/TitanRobotAdvanced';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { deviceTTS, isDeviceTTSSupported } from '@/utils/deviceTTS';
import { speechEvents } from '@/utils/speechEvents';
import { hulkbusterControl } from '@/services/hulkbusterControl';
import { isVoiceApiConfigured } from '@/services/voiceRssTts';
import { zevorix, type ZevorixModel } from '@/services/zevorixService';
import { aiApi } from '@/db/api';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy (Neutral)', description: 'Balanced and clear' },
  { value: 'echo', label: 'Echo (Male)', description: 'Deep and resonant' },
  { value: 'fable', label: 'Fable (British Male)', description: 'Sophisticated and articulate' },
  { value: 'onyx', label: 'Onyx (Strong Male)', description: 'Powerful and authoritative' },
  { value: 'nova', label: 'Nova (Female)', description: 'Warm and friendly' },
  { value: 'shimmer', label: 'Shimmer (Female)', description: 'Bright and energetic' },
];

const GREETINGS = {
  en: "Hello! I'm JARVIS AI, your assistant. Tell me, how can I help you today?",
  es: "¡Hola! Soy JARVIS AI. Dime, ¿cómo puedo ayudarte hoy?",
  fr: "Bonjour! Je suis JARVIS AI. Dites-moi, comment puis-je vous aider aujourd'hui?",
  de: "Hallo! Ich bin JARVIS AI. Sagen Sie mir, wie kann ich Ihnen heute helfen?",
  zh: "你好！我是 JARVIS AI。告诉我，今天我能帮您什么？",
  ja: "こんにちは！私は JARVIS AI です。今日はどのようにお手伝いできますか？",
  ar: "مرحبا! أنا JARVIS AI. أخبرني، كيف يمكنني مساعدتك اليوم؟",
  hi: "नमस्ते! मैं JARVIS AI हूं। बताइए, आज मैं आपकी कैसे मदद कर सकता हूं?",
  ur: "السلام علیکم! میں JARVIS AI ہوں۔ بتائیں، آج میں آپ کی کیسے مدد کر سکتا ہوں؟",
  mr: "नमस्कार! मी JARVIS AI आहे। सांगा, आज मी तुम्हाला कशी मदत करू शकतो?",
  pt: "Olá! Eu sou JARVIS AI. Diga-me, como posso ajudá-lo hoje?",
  ru: "Привет! Я JARVIS AI. Скажите мне, чем я могу вам помочь сегодня?",
  it: "Ciao! Sono JARVIS AI. Dimmi, come posso aiutarti oggi?",
  ko: "안녕하세요! 저는 JARVIS AI입니다. 오늘 어떻게 도와드릴까요?",
  tr: "Merhaba! Ben JARVIS AI. Söyleyin, bugün size nasıl yardımcı olabilirim?",
  nl: "Hallo! Ik ben JARVIS AI. Vertel me, hoe kan ik u vandaag helpen?",
  pl: "Cześć! Jestem JARVIS AI. Powiedz mi, jak mogę Ci dzisiaj pomóc?",
  sv: "Hej! Jag är JARVIS AI. Berätta, hur kan jag hjälpa dig idag?",
  th: "สวัสดี! ฉันคือ JARVIS AI บอกฉันสิ วันนี้ฉันจะช่วยคุณได้อย่างไร?",
  vi: "Xin chào! Tôi là JARVIS AI. Hãy cho tôi biết, hôm nay tôi có thể giúp gì cho bạn?",
} as const;

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

const langMap: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ar: 'ar-SA',
  hi: 'hi-IN',
  ur: 'ur-PK',
  mr: 'mr-IN',
  pt: 'pt-PT',
  ru: 'ru-RU',
  it: 'it-IT',
  ko: 'ko-KR',
  tr: 'tr-TR',
  nl: 'nl-NL',
  pl: 'pl-PL',
  sv: 'sv-SE',
  th: 'th-TH',
  vi: 'vi-VN',
};

export default function VirtualRobotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [useDeviceTTS, setUseDeviceTTS] = useState(!isVoiceApiConfigured());
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [model, setModel] = useState<ZevorixModel>('zevorix');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [training, setTraining] = useState(false);
  const [speechIntensity, setSpeechIntensity] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsSpeaking(true);
    setSpeechIntensity(0.4);
    await hulkbusterControl.speechStart(text, useDeviceTTS ? 'device-tts' : 'api-tts');

    try {
      // Prefer keyed Voice API / Supabase TTS when Device Voice is off
      if (!useDeviceTTS) {
        const audioData = await aiApi.textToSpeech(text, selectedLanguage, selectedVoice);
        if (audioData?.byteLength) {
          const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          if (!audioRef.current) throw new Error('Audio element missing');
          audioRef.current.src = audioUrl;

          let tick = 0;
          let pulse: ReturnType<typeof setInterval> | null = null;
          const clearPulse = () => {
            if (pulse) { clearInterval(pulse); pulse = null; }
          };
          const finish = async () => {
            clearPulse();
            setIsSpeaking(false);
            setSpeechIntensity(0);
            await hulkbusterControl.speechStop();
            URL.revokeObjectURL(audioUrl);
          };
          audioRef.current.onplay = () => {
            clearPulse();
            pulse = setInterval(() => {
              tick += 1;
              const intensity = 0.28 + Math.abs(Math.sin(tick * 0.52)) * 0.58;
              setSpeechIntensity(intensity);
              speechEvents.emit('speech.intensity', { intensity, source: 'api-tts' });
              speechEvents.emit(intensity > 0.2 ? 'mouth.open' : 'mouth.close', { intensity, source: 'api-tts' });
            }, 70);
          };
          audioRef.current.onended = () => { void finish(); };
          audioRef.current.onerror = () => { void finish(); };
          await audioRef.current.play();
          return;
        }
      }

      if (isDeviceTTSSupported()) {
        await deviceTTS.speak(text, {
          lang: langMap[selectedLanguage] || 'en-US',
          rate: 1,
          pitch: 0.9,
          volume: 1,
          onIntensity: setSpeechIntensity,
        });
        setIsSpeaking(false);
        setSpeechIntensity(0);
        await hulkbusterControl.speechStop();
        return;
      }

      throw new Error('No TTS provider available');
    } catch (error: any) {
      setIsSpeaking(false);
      setSpeechIntensity(0);
      await hulkbusterControl.speechStop();
      toast.error(error?.message || 'Failed to generate speech');
    }
  }, [selectedLanguage, selectedVoice, useDeviceTTS]);

  const stopSpeaking = () => {
    deviceTTS.stop();
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsSpeaking(false);
    setSpeechIntensity(0);
    void hulkbusterControl.speechStop();
  };

  const streamChat = useCallback(async (userText: string) => {
    const aiMessageId = crypto.randomUUID();
    setMessages(prev => [
      ...prev,
      { id: aiMessageId, role: 'model', content: '', timestamp: new Date() },
    ]);
    setIsLoading(true);
    try {
      const result = await zevorix.generate(userText, model);
      const fullResponse = result.text || 'J.A.R.V.I.S. is online, but no reply was generated.';
      setMessages(prev =>
        prev.map(m => (m.id === aiMessageId ? { ...m, content: fullResponse } : m))
      );
      if (autoSpeak && fullResponse) await speakText(fullResponse);
    } catch (error: any) {
      const msg = error?.message || 'Assistant failed to respond.';
      setMessages(prev =>
        prev.map(m => (m.id === aiMessageId ? { ...m, content: msg } : m))
      );
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [autoSpeak, model, speakText]);

  useEffect(() => {
    const greetingText = GREETINGS[selectedLanguage as keyof typeof GREETINGS] || GREETINGS.en;
    setMessages([{
      id: 'greeting',
      role: 'model',
      content: greetingText,
      timestamp: new Date(),
    }]);
  }, [selectedLanguage]);

  useEffect(() => {
    const greetingText = GREETINGS[selectedLanguage as keyof typeof GREETINGS] || GREETINGS.en;
    if (!autoSpeak) return;
    const t = setTimeout(() => {
      void speakText(greetingText);
    }, 400);
    return () => clearTimeout(t);
    // Speak once per language change, not whenever speakText identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, autoSpeak]);

  const cleanupRecording = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setAudioLevel(0);
  }, []);

  const monitorAudioLevel = useCallback((stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    microphone.connect(analyser);

    audioContextRef.current = audioContext;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      if (!isListening) return;
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 255);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }, [isListening]);

  const transcribeAndRespond = useCallback(async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('response_format', 'json');

      const { data, error } = await supabase.functions.invoke('speech-to-text', { body: formData });
      if (error) throw new Error(error.message || 'Transcription failed');

      const userText = data?.text?.trim();
      if (!userText) throw new Error('No transcription received');

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: userText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      messagesRef.current = [...messagesRef.current, userMessage];

      await streamChat(userText);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to process voice');
    } finally {
      setIsLoading(false);
    }
  }, [streamChat]);

  const startListening = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) throw new Error('Microphone not supported');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      streamRef.current = stream;
      monitorAudioLevel(stream);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAndRespond(audioBlob);
        cleanupRecording();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsListening(true);
      toast.success('🎤 Listening... Speak now!');
    } catch (error: any) {
      cleanupRecording();
      toast.error(error?.message || 'Failed to access microphone');
    }
  };

  const stopListening = () => {
    if (!mediaRecorder) return;
    setIsListening(false);
    mediaRecorder.stop();
    setMediaRecorder(null);
    toast.info('🛑 Processing your voice...');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    messagesRef.current = [...messagesRef.current, userMessage];
    setInput('');
    await streamChat(currentInput);
  };

  const trainRag = async (force = false) => {
    setTraining(true);
    try {
      await zevorix.ingest(force);
      toast.success(force ? 'RAG index rebuild started' : 'RAG indexing started');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'RAG indexing could not start');
    } finally {
      setTraining(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-full min-h-0 flex-col bg-[#0b0b0b] text-white">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold tracking-[0.18em] uppercase text-amber-300">Virtual Robot</h1>
            <p className="text-xs text-white/50">Voice, chat and RAG assistant</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isSpeaking ? 'bg-amber-300 animate-pulse' : isListening ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
            <span className="text-xs text-white/60">{isLoading ? 'Thinking' : isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}</span>
          </div>
        </header>

        <main className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(420px,1.1fr)]">
          <Card className="relative min-h-[560px] overflow-hidden border-white/10 bg-black/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12),transparent_60%)]" />
            <div className="relative h-full min-h-[560px]">
              <ErrorBoundary fallback={
                <div className="flex h-full min-h-[560px] items-center justify-center text-amber-300/80 text-sm tracking-widest uppercase">
                  Robot renderer recovered — try refreshing this panel
                </div>
              }>
                <TitanRobotAdvanced
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  speechIntensity={speechIntensity}
                  emotion={isLoading ? 'thinking' : isSpeaking ? 'speaking' : isListening ? 'happy' : 'neutral'}
                />
              </ErrorBoundary>
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-center text-xs text-white/70">
                {isLoading ? 'Processing your request…' : isSpeaking ? 'J.A.R.V.I.S. is speaking' : 'Ready for your command'}
              </div>
              <div className="pointer-events-auto absolute left-3 top-3 flex flex-wrap gap-1.5">
                <Button type="button" size="sm" variant="outline" className="h-7 border-white/20 bg-black/50 text-[10px] text-white hover:bg-white/10" onClick={() => void hulkbusterControl.gesture('wave')}>Wave</Button>
                <Button type="button" size="sm" variant="outline" className="h-7 border-white/20 bg-black/50 text-[10px] text-white hover:bg-white/10" onClick={() => void hulkbusterControl.gesture('point')}>Point</Button>
                <Button type="button" size="sm" variant="outline" className="h-7 border-white/20 bg-black/50 text-[10px] text-white hover:bg-white/10" onClick={() => void hulkbusterControl.gesture('thumbs_up')}>Thumbs</Button>
                <Button type="button" size="sm" variant="outline" className="h-7 border-white/20 bg-black/50 text-[10px] text-white hover:bg-white/10" onClick={() => void hulkbusterControl.walk('forward')}>Walk</Button>
                <Button type="button" size="sm" variant="outline" className="h-7 border-white/20 bg-black/50 text-[10px] text-white hover:bg-white/10" onClick={() => void hulkbusterControl.eyeBeam('red', 1.6)}>Beam</Button>
              </div>
            </div>
          </Card>

          <Card className="flex min-h-0 flex-col border-white/10 bg-black/30">
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {messages.length === 0 && (
                  <div className="flex h-full min-h-[220px] items-center justify-center text-center text-white/50">
                    <div><Bot className="mx-auto mb-3 h-10 w-10 text-amber-300/70" /><p>Ask J.A.R.V.I.S. anything.</p></div>
                  </div>
                )}
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm ${message.role === 'user' ? 'border-amber-300/30 bg-amber-300/10' : 'border-white/10 bg-white/5'}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-2 border-t border-white/10 pt-3">
                <Textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void handleSend(); } }} placeholder="Type a command or question…" className="min-h-[44px] resize-none border-white/15 bg-white/5 text-white placeholder:text-white/40" />
                <Button onClick={() => void handleSend()} disabled={!input.trim() || isLoading} className="bg-amber-300 text-black hover:bg-amber-200"><Send className="h-4 w-4" /></Button>
                <Button onClick={isListening ? stopListening : startListening} disabled={isLoading} variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                {isSpeaking && <Button onClick={stopSpeaking} variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10"><VolumeX className="h-4 w-4" /></Button>}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                <label className="flex items-center gap-2"><Switch checked={autoSpeak} onCheckedChange={setAutoSpeak} /> Auto speak</label>
                <label className="flex items-center gap-2"><Switch checked={useDeviceTTS} onCheckedChange={setUseDeviceTTS} /> Device voice</label>
                <Button onClick={() => void trainRag(false)} disabled={training} variant="outline" className="h-8 border-white/15 bg-transparent text-xs text-white hover:bg-white/10">
                  {training ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null} Train RAG
                </Button>
                <Button onClick={() => void trainRag(true)} disabled={training} variant="outline" className="h-8 border-white/15 bg-transparent text-xs text-white hover:bg-white/10">Rebuild index</Button>
                <Select value={model} onValueChange={value => setModel(value as ZevorixModel)}>
                  <SelectTrigger className="h-8 w-[150px] border-white/15 bg-white/5"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="zevorix">Zevorix RAG</SelectItem><SelectItem value="jarvis-unified">J.A.R.V.I.S. Unified</SelectItem><SelectItem value="jarvis-rag">J.A.R.V.I.S. RAG</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </main>
        <audio ref={audioRef} className="hidden" />
      </div>
    </AppLayout>
  );
}