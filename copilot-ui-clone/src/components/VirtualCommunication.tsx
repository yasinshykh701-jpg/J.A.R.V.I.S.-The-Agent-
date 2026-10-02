import { Mic, MicOff, Video, VideoOff, PhoneOff, Settings, MessageSquare, Maximize2, Send, X, AudioLines, Users, Play, Pause, Sparkles, Volume2, Sliders, Zap, Check, RotateCcw, Image as ImageIcon, Wand2, Download, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Character = {
  id: string;
  name: string;
  videoSrc: string;
  isPo: boolean;
};

const characters: Character[] = [
  {
    id: 'pandabot',
    name: 'PandaBot',
    videoSrc: '/kungfu panda 3.mp4',
    isPo: true
  }
];

export interface ChatMessageItem {
  role: 'user' | 'assistant';
  content: string;
  isLive?: boolean;
  image?: string;
  imagePrompt?: string;
  isGeneratingImage?: boolean;
  model?: string;
  editedFrom?: string;
}

export function VirtualCommunication({ onClose, globalSelectedVoice = 'Puck' }: { onClose?: () => void, globalSelectedVoice?: string }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessageItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('pandabot');
  const selectedGeminiVoice = globalSelectedVoice;
  const [useGeminiTts, setUseGeminiTts] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // Normal 1.0 speed by default
  const [currentPlaybackSpeed, setCurrentPlaybackSpeed] = useState<number>(1.0);
  const [isListening, setIsListening] = useState(false);
  const isContinuousListeningRef = useRef(false);

  // Image Generation & Editing States
  const [isImageMode, setIsImageMode] = useState(false);
  const [showImagePromptModal, setShowImagePromptModal] = useState(false);
  const [editingBaseImage, setEditingBaseImage] = useState<string | null>(null);
  const [editingImagePrompt, setEditingImagePrompt] = useState<string>('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('1:1');
  const [fullscreenImage, setFullscreenImage] = useState<{ url: string; prompt?: string } | null>(null);
  
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const liveWsRef = useRef<WebSocket | null>(null);
  const nextLiveAudioTimeRef = useRef<number>(0);
  const activeLiveSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const liveStreamRef = useRef<MediaStream | null>(null);

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId) || characters[0];

  // Auto-scroll chat history
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  // Load selected video
  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.load();
      // Ensure it starts paused, we only play when speaking
      videoRef.current.pause();
    }
  }, [selectedCharacter.videoSrc]);

  // Stop audio and live stream on unmount
  useEffect(() => {
    return () => {
      isContinuousListeningRef.current = false;
      if (liveWsRef.current) {
        try { liveWsRef.current.close(); } catch(e){}
      }
      if (liveStreamRef.current) {
        liveStreamRef.current.getTracks().forEach(t => t.stop());
      }
      activeLiveSourcesRef.current.forEach(s => {
        try { s.stop(); } catch(e){}
      });
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (currentAudioSourceRef.current) {
        try { currentAudioSourceRef.current.stop(); } catch(e){}
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Live API for Real-time Voice Conversations with Panda in Gemini Voice (gemini-3.1-flash-live-preview)
  const toggleVoiceAssistantListening = async () => {
    if (isListening) {
      if (liveWsRef.current) {
        try { liveWsRef.current.close(); } catch(e){}
        liveWsRef.current = null;
      }
      if (liveStreamRef.current) {
        liveStreamRef.current.getTracks().forEach(t => t.stop());
        liveStreamRef.current = null;
      }
      activeLiveSourcesRef.current.forEach(s => {
        try { s.stop(); } catch(e){}
      });
      activeLiveSourcesRef.current = [];
      setIsListening(false);
      setIsSpeaking(false);
      if (videoRef.current) videoRef.current.pause();
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveStreamRef.current = stream;

      const wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws';
      const voiceParam = encodeURIComponent(selectedGeminiVoice || 'Puck');
      const actualWs = new WebSocket(`${wsProtocol}://${location.host}/live?voice=${voiceParam}`);
      liveWsRef.current = actualWs;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      } else if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      nextLiveAudioTimeRef.current = audioCtxRef.current.currentTime;
      activeLiveSourcesRef.current = [];

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (actualWs.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            let s = Math.max(-1, Math.min(1, inputData[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
          actualWs.send(JSON.stringify({ audio: base64Audio }));
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      actualWs.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.text) {
            setChatHistory(prev => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant' && (last as any).isLive) {
                return [...prev.slice(0, -1), { role: 'assistant', content: last.content + msg.text, isLive: true }];
              }
              return [...prev, { role: 'assistant', content: msg.text, isLive: true }];
            });
          }

          if (msg.interrupted) {
            activeLiveSourcesRef.current.forEach(s => {
              try { s.stop(); } catch(e){}
            });
            activeLiveSourcesRef.current = [];
            if (audioCtxRef.current) {
              nextLiveAudioTimeRef.current = audioCtxRef.current.currentTime;
            }
            setIsSpeaking(false);
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }

          if (msg.audio) {
            const binary = atob(msg.audio);
            const len = binary.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            const int16 = new Int16Array(bytes.buffer);
            const float32 = new Float32Array(int16.length);
            for (let i = 0; i < int16.length; i++) {
              float32[i] = int16[i] / 32768.0;
            }

            const outCtx = audioCtxRef.current!;
            if (outCtx.state === 'suspended') {
              await outCtx.resume();
            }

            const audioBuffer = outCtx.createBuffer(1, float32.length, 24000);
            audioBuffer.getChannelData(0).set(float32);

            const playSource = outCtx.createBufferSource();
            playSource.buffer = audioBuffer;
            playSource.playbackRate.value = speechRate;
            playSource.connect(outCtx.destination);

            const now = outCtx.currentTime;
            const startTime = Math.max(now, nextLiveAudioTimeRef.current);
            playSource.start(startTime);
            nextLiveAudioTimeRef.current = startTime + (audioBuffer.duration / speechRate);

            activeLiveSourcesRef.current.push(playSource);
            setIsSpeaking(true);

            if (videoRef.current) {
              videoRef.current.loop = true;
              videoRef.current.playbackRate = speechRate;
              videoRef.current.play().catch(() => {});
            }

            playSource.onended = () => {
              if (outCtx.currentTime >= nextLiveAudioTimeRef.current - 0.08) {
                setIsSpeaking(false);
                if (videoRef.current) {
                  videoRef.current.pause();
                }
              }
            };
          }
        } catch (err) {
          console.error("Error processing Live message:", err);
        }
      };

      actualWs.onerror = (err) => {
        console.error("Live WebSocket error:", err);
      };

      actualWs.onclose = () => {
        setIsListening(false);
        setIsSpeaking(false);
        if (liveStreamRef.current) {
          liveStreamRef.current.getTracks().forEach(t => t.stop());
          liveStreamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.pause();
        }
      };

      setIsListening(true);
    } catch (e: any) {
      console.error(e);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Microphone permission is required to chat with Po in real-time Gemini Voice! Please allow microphone access.'
      }]);
    }
  };
  // Speak text with Gemini TTS or Browser Fallback + Real-time Lip Sync Video Speed Sync
  const speakText = async (text: string) => {
    // Stop any existing speech
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (currentAudioSourceRef.current) {
      try { currentAudioSourceRef.current.stop(); } catch(e){}
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setIsSpeaking(true);

    if (useGeminiTts) {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceName: selectedGeminiVoice })
        });

        if (!response.ok) {
          throw new Error('Gemini TTS endpoint returned an error');
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error('Received non-JSON response from TTS endpoint');
        }

        const data = await response.json();
        if (data.fallback && !data.audio) {
          // Gracefully continue to SpeechSynthesis fallback
        } else if (data.audio) {
          // Decode base64 audio
          const binary = atob(data.audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }

          if (!audioCtxRef.current) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
          }
          if (audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
          }

          const audioBuffer = await audioCtxRef.current.decodeAudioData(bytes.buffer);
          const source = audioCtxRef.current.createBufferSource();
          const analyser = audioCtxRef.current.createAnalyser();
          
          analyser.fftSize = 256;
          source.buffer = audioBuffer;
          source.playbackRate.value = speechRate; // Match voice speed to selected rate
          
          source.connect(audioCtxRef.current.destination);

          currentAudioSourceRef.current = source;

          if (videoRef.current) {
            videoRef.current.loop = true;
            videoRef.current.playbackRate = speechRate;
            setCurrentPlaybackSpeed(speechRate);
            videoRef.current.play().catch(e => console.warn('Video play error:', e));
          }

          source.onended = () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            setIsSpeaking(false);
            if (videoRef.current) {
              videoRef.current.pause();
              try { videoRef.current.currentTime = 0.1; } catch(e){}
            }
          };

          source.start(0);
          return;
        }
      } catch (err) {
        // Continue to Web Speech API fallback smoothly
      }
    }

    // Fallback: Web Speech Synthesis API
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = selectedCharacter.isPo ? 0.85 : 1.0;
    utterance.rate = speechRate;

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (videoRef.current) {
        videoRef.current.loop = true;
        videoRef.current.playbackRate = speechRate;
        videoRef.current.play().catch(e => console.warn(e));
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (videoRef.current) {
        videoRef.current.pause();
        try { videoRef.current.currentTime = 0.1; } catch(e){}
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      if (videoRef.current) {
        videoRef.current.pause();
        try { videoRef.current.currentTime = 0.1; } catch(e){}
      }
    };

    (window as any).currentVirtualUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string, overrideBaseImage?: string | null) => {
    const userMsg = textToSend !== undefined ? textToSend : message;
    const baseImgToUse = overrideBaseImage !== undefined ? overrideBaseImage : editingBaseImage;
    if (!userMsg.trim() || isTyping) return;

    setMessage('');

    // Check if the user is requesting image generation or editing
    const lower = userMsg.toLowerCase().trim();
    const isExplicitImageCommand = 
      isImageMode ||
      Boolean(baseImgToUse) ||
      lower.startsWith('/image') ||
      lower.startsWith('/imagine') ||
      lower.startsWith('draw ') ||
      lower.startsWith('paint ') ||
      lower.startsWith('generate image') ||
      lower.startsWith('create image') ||
      lower.startsWith('generate an image') ||
      lower.startsWith('create an image') ||
      lower.startsWith('make an image') ||
      lower.startsWith('make a picture') ||
      lower.includes('generate an image of') ||
      lower.includes('generate image of') ||
      lower.includes('create an image of') ||
      lower.includes('draw an image') ||
      lower.includes('draw a picture') ||
      lower.includes('paint an image');

    if (isExplicitImageCommand) {
      // Clean up prompt command triggers
      let cleanPrompt = userMsg;
      if (cleanPrompt.toLowerCase().startsWith('/image')) cleanPrompt = cleanPrompt.replace(/^\/image\s*/i, '');
      if (cleanPrompt.toLowerCase().startsWith('/imagine')) cleanPrompt = cleanPrompt.replace(/^\/imagine\s*/i, '');
      if (cleanPrompt.toLowerCase().startsWith('generate an image of')) cleanPrompt = cleanPrompt.replace(/^generate an image of\s*/i, '');
      if (cleanPrompt.toLowerCase().startsWith('generate image of')) cleanPrompt = cleanPrompt.replace(/^generate image of\s*/i, '');
      if (cleanPrompt.toLowerCase().startsWith('create an image of')) cleanPrompt = cleanPrompt.replace(/^create an image of\s*/i, '');
      if (cleanPrompt.toLowerCase().startsWith('create image of')) cleanPrompt = cleanPrompt.replace(/^create image of\s*/i, '');
      if (cleanPrompt.toLowerCase().startsWith('draw an image of')) cleanPrompt = cleanPrompt.replace(/^draw an image of\s*/i, '');
      if (cleanPrompt.toLowerCase().startsWith('draw a picture of')) cleanPrompt = cleanPrompt.replace(/^draw a picture of\s*/i, '');
      if (cleanPrompt.toLowerCase().startsWith('draw ')) cleanPrompt = cleanPrompt.replace(/^draw\s+/i, '');
      if (cleanPrompt.toLowerCase().startsWith('paint ')) cleanPrompt = cleanPrompt.replace(/^paint\s+/i, '');
      cleanPrompt = cleanPrompt.trim() || "Kung Fu Panda Dragon Warrior";

      // 1. Append user message
      setChatHistory(prev => [...prev, {
        role: 'user',
        content: userMsg,
        imagePrompt: cleanPrompt
      }]);

      // 2. Append assistant pending message
      const pendingContent = baseImgToUse
        ? `Summoning Chi to edit image with gemini-3.1-flash-image-preview: "${cleanPrompt}"...`
        : `Channeling Dragon Warrior spirit with gemini-3.1-flash-image-preview: "${cleanPrompt}"...`;

      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: pendingContent,
        isGeneratingImage: true,
        imagePrompt: cleanPrompt,
        model: 'gemini-3.1-flash-image-preview'
      }]);

      setIsTyping(true);
      setEditingBaseImage(null);
      setIsImageMode(false);

      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: cleanPrompt,
            baseImage: baseImgToUse || undefined,
            aspectRatio: selectedAspectRatio || "1:1"
          })
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        const generatedImg = data.image 
          ? (data.image.startsWith('data:') ? data.image : `data:${data.mimeType || 'image/png'};base64,${data.image}`)
          : (data.imageUrl || '');

        if (generatedImg) {
          const completionSpeech = baseImgToUse
            ? "Skadoosh! The image has been refined with new Dragon Warrior energy!"
            : "Skadoosh! Behold your masterpiece created with gemini-3.1-flash-image-preview!";

          setChatHistory(prev => {
            const copy = [...prev];
            const lastIdx = copy.length - 1;
            if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
              copy[lastIdx] = {
                role: 'assistant',
                content: completionSpeech,
                image: generatedImg,
                imagePrompt: cleanPrompt,
                isGeneratingImage: false,
                model: 'gemini-3.1-flash-image-preview',
                editedFrom: baseImgToUse || undefined
              };
            }
            return copy;
          });

          speakText(completionSpeech);
        } else {
          throw new Error("No image data returned from image generation model");
        }
      } catch (err: any) {
        console.error("Image generation failure:", err);
        const errMsg = "Skadoosh! My Chi wavered while generating the image. Let's try again with a different prompt!";
        setChatHistory(prev => {
          const copy = [...prev];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
            copy[lastIdx] = {
              role: 'assistant',
              content: errMsg,
              isGeneratingImage: false
            };
          }
          return copy;
        });
        speakText(errMsg);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // Standard Chat flow
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          isRag: true,
          kungfuPanda: selectedCharacter.isPo,
          voiceName: selectedGeminiVoice,
          modelType: 'gemini-3.1-flash-lite' // Enforce fast response model
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error('Received non-JSON response from chat endpoint');
      }

      const botResponse = data.response || "Skadoosh! I didn't get that, try again!";

      setChatHistory(prev => [...prev, { role: 'assistant', content: botResponse }]);
      speakText(botResponse);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.name === 'AbortError' 
        ? "Skadoosh! That took too long. I need a quick dumpling break, try again!" 
        : "Skadoosh! Something went wrong, but the Dragon Warrior never quits. Try again!";
      setChatHistory(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      speakText(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-black relative select-none">
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        {/* Main Video & Live Character Canvas */}
        <div className="absolute inset-0 bg-black flex items-center justify-center group">
          {/* Video Player */}
          <video 
            ref={videoRef}
            id="virtual-panda-video"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              videoError ? 'opacity-0' : 'opacity-100'
            }`}
            src={encodeURI(selectedCharacter.videoSrc)}
            loop 
            muted 
            playsInline
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onError={() => {
              console.warn("Video failed to load:", selectedCharacter.videoSrc);
              setVideoError(true);
            }}
            onLoadedData={(e) => {
              setVideoError(false);
              const target = e.target as HTMLVideoElement;
              target.playbackRate = speechRate;
              if (!isSpeaking && target.paused) {
                try { target.currentTime = 0.1; } catch(err){}
              }
            }}
          />

          {/* Live Audio Status Floating Pill */}
          <div className="absolute top-20 left-4 z-30 pointer-events-auto flex flex-col gap-1.5">
            {isListening ? (
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-500/50 shadow-xl animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <AudioLines size={14} className="text-rose-400" />
                  {isSpeaking ? `Po is speaking (${selectedGeminiVoice})` : "Live Voice Active • Speak now!"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white/80 text-[10px]">
                <Sparkles size={12} className="text-amber-400" />
                <span>Gemini Live API • {selectedGeminiVoice}</span>
              </div>
            )}
          </div>

          {/* Quick Start Live Chat Overlay Button if idle */}
          {!isListening && chatHistory.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <button
                onClick={toggleVoiceAssistantListening}
                className="pointer-events-auto flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:via-rose-400 hover:to-purple-500 text-white font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/30 cursor-pointer"
              >
                <Mic size={18} className="animate-bounce" />
                <span>Start Live Voice Chat with Po</span>
              </button>
            </div>
          )}

          {/* Animated Fallback Display if video is missing or loading */}
          {videoError && (
            <div className="absolute inset-0 bg-gradient-to-b from-amber-950 via-slate-900 to-black flex flex-col items-center justify-center p-6 text-center">
              <div className={`relative w-48 h-48 rounded-full border-4 border-amber-400/40 bg-black/60 flex items-center justify-center shadow-2xl ${isSpeaking ? 'animate-pulse scale-105' : ''}`}>
                <div className="text-8xl">🐼</div>
                {isSpeaking && (
                  <div className="absolute -bottom-2 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-lg flex items-center gap-1">
                    <AudioLines size={14} /> Lip-Sync Active
                  </div>
                )}
              </div>
              <h3 className="text-white text-xl font-bold mt-6">{selectedCharacter.name}</h3>
              <p className="text-amber-300/80 text-xs mt-1">Live AI Voice & Speed Synchronized Avatar</p>
            </div>
          )}

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>

          {/* Top Bar - Instagram Live Style */}
          <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-start z-30 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-lg">
                  <div className="w-full h-full bg-black rounded-full overflow-hidden border-2 border-black flex items-center justify-center">
                    <span className="text-amber-400 text-base font-extrabold">🐼</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow">
                  Live
                </div>
              </div>

              <div>
                <h2 className="text-white font-bold text-sm drop-shadow-md flex items-center gap-1.5">
                  {selectedCharacter.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                  <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-white" />
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-white/90 text-xs drop-shadow-md">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded px-2 py-0.5 border border-white/10">
                    <Zap size={11} className="text-amber-400" />
                    <span className="font-mono text-[10px] text-amber-300">{currentPlaybackSpeed}x Speed</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded px-2 py-0.5 border border-white/10">
                    <Sparkles size={11} className="text-cyan-400" />
                    <span className="text-[10px] text-cyan-300">{selectedGeminiVoice}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 relative">
              <button 
                onClick={() => {
                  setShowCharacterSelect(!showCharacterSelect);
                  setShowSettings(false);
                }}
                className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md flex items-center gap-1.5 text-white text-xs border border-white/20 hover:bg-black/60 transition-colors"
                title="Select Character"
              >
                <Users size={14} className="text-amber-400" />
                <span className="font-semibold">Character</span>
              </button>

              <button 
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowCharacterSelect(false);
                }}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors"
                title="Voice & Speed Settings"
              >
                <Sliders size={16} className="text-cyan-400" />
              </button>

              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Character Selector Dropdown */}
            {showCharacterSelect && (
              <div className="absolute top-16 right-4 w-60 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-40 p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <div className="text-white text-xs font-bold px-3 py-1.5 border-b border-white/10 text-amber-400 uppercase tracking-wider">
                  Select Kung Fu Avatar
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {characters.map(char => (
                    <button 
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacterId(char.id);
                        setShowCharacterSelect(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs font-medium ${
                        selectedCharacterId === char.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span>{char.name}</span>
                      {selectedCharacterId === char.id && <Check size={14} className="text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Voice & Speed Settings Modal */}
            {showSettings && (
              <div className="absolute top-16 right-4 w-72 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden z-40 p-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-cyan-400" /> Gemini Voice & Lip-Sync
                  </span>
                  <button onClick={() => setShowSettings(false)} className="text-white/60 hover:text-white">
                    <X size={14} />
                  </button>
                </div>

                {/* Gemini Voice Toggle */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-white/90">Global Voice Engine</label>
                    <button 
                      onClick={() => setUseGeminiTts(!useGeminiTts)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        useGeminiTts ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {useGeminiTts ? 'Gemini TTS Enabled' : 'Browser Fallback'}
                    </button>
                  </div>
                  <div className="text-[10px] text-white/60">
                    Currently using voice: <span className="font-bold text-cyan-300">{selectedGeminiVoice}</span>
                    <br/>
                    (Change voice in User Settings Menu from Home)
                  </div>
                </div>

                {/* Speech & Video Speed Slider */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-white/90 flex items-center gap-1">
                      <Zap size={12} className="text-amber-400" /> Speech & Lip-Sync Speed
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-300">{speechRate}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2.0" 
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSpeechRate(val);
                      setCurrentPlaybackSpeed(val);
                      if (videoRef.current) videoRef.current.playbackRate = val;
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/40 mt-1">
                    <span>0.5x Slow</span>
                    <span>1.0x Normal</span>
                    <span>2.0x Fast</span>
                  </div>
                </div>

                {/* Preset Speed Buttons */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                  {[0.8, 1.0, 1.1, 1.25, 1.5].map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setSpeechRate(rate);
                        setCurrentPlaybackSpeed(rate);
                        if (videoRef.current) videoRef.current.playbackRate = rate;
                      }}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        speechRate === rate ? 'bg-amber-400 text-black shadow-md' : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Camera PIP */}
          {isVideoOn && (
            <div className="absolute top-20 right-4 w-28 h-40 bg-black/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-2xl z-20 pointer-events-auto">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 text-xs font-semibold p-2 text-center">
                <Video size={20} className="mb-1 text-cyan-400 animate-pulse" />
                <span>Your Camera</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Subtitles & Floating Comments with Image Generation Results */}
        <div className="absolute bottom-20 left-0 right-0 max-h-[50vh] sm:max-h-[58vh] overflow-y-auto px-3 sm:px-5 pb-4 flex flex-col gap-3 z-20 pointer-events-none custom-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="text-white/70 text-xs text-center mb-2 drop-shadow-lg bg-black/50 backdrop-blur-md py-2 px-4 rounded-full max-w-sm mx-auto border border-white/10 pointer-events-auto">
              💬 Speak, comment, or ask PandaBot to <span className="text-amber-300 font-bold">generate an image</span>!
            </div>
          ) : (
            chatHistory.map((chat, idx) => (
              <div key={idx} className="flex gap-2.5 text-xs sm:text-sm pointer-events-auto items-start">
                {chat.role === 'user' ? (
                  <div className="font-bold text-cyan-300 drop-shadow-md shrink-0 bg-black/60 px-2 py-0.5 rounded-md h-fit text-[11px]">You:</div>
                ) : (
                  <div className="font-bold text-amber-300 drop-shadow-md shrink-0 bg-black/60 px-2 py-0.5 rounded-md h-fit text-[11px] flex items-center gap-1">
                    <span>PandaBot</span>
                    {chat.image && <Sparkles size={11} className="text-amber-400" />}
                  </div>
                )}
                <div className="text-white drop-shadow-md break-words bg-black/75 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 max-w-[88%] sm:max-w-[75%] shadow-2xl flex flex-col gap-2">
                  <div>{chat.content}</div>

                  {/* Image Generation in Progress Shimmer */}
                  {chat.isGeneratingImage && (
                    <div className="mt-1 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 border border-amber-400/30 flex flex-col items-center justify-center gap-2 animate-pulse">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <Loader2 size={15} className="animate-spin text-amber-400" />
                        <span>Rendering with gemini-3.1-flash-image-preview</span>
                      </div>
                      <div className="w-full h-32 rounded-lg bg-white/5 border border-dashed border-amber-400/20 flex flex-col items-center justify-center p-3 text-center">
                        <ImageIcon size={28} className="text-amber-400/60 mb-1" />
                        <span className="text-white/60 text-[11px] italic">"{chat.imagePrompt}"</span>
                      </div>
                    </div>
                  )}

                  {/* Generated Image Result Card */}
                  {chat.image && (
                    <div className="mt-1 rounded-xl overflow-hidden border border-amber-400/30 bg-black/80 shadow-2xl flex flex-col group/img">
                      <div 
                        className="relative overflow-hidden cursor-pointer bg-neutral-950 flex items-center justify-center"
                        onClick={() => setFullscreenImage({ url: chat.image!, prompt: chat.imagePrompt })}
                      >
                        <img 
                          src={chat.image} 
                          alt={chat.imagePrompt || "Artwork"} 
                          className="w-full max-h-72 object-contain group-hover/img:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 text-[10px] font-medium text-amber-300 shadow-md">
                          <Sparkles size={11} className="text-amber-400" />
                          <span>gemini-3.1-flash-image-preview</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFullscreenImage({ url: chat.image!, prompt: chat.imagePrompt });
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black transition-colors"
                          title="View Fullscreen"
                        >
                          <Maximize2 size={13} />
                        </button>
                      </div>

                      {/* Image Details and Action Toolbar */}
                      <div className="p-2 sm:p-2.5 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-2 border-t border-white/10">
                        <div className="text-[11px] text-white/80 truncate font-medium max-w-[200px] sm:max-w-xs">
                          {chat.imagePrompt ? `"${chat.imagePrompt}"` : "Masterpiece by Po"}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingBaseImage(chat.image!);
                              setEditingImagePrompt(chat.imagePrompt || "");
                              setMessage("make it: ");
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                            title="Edit this image with gemini-3.1-flash-image-preview"
                          >
                            <Wand2 size={12} />
                            <span>Edit Image</span>
                          </button>
                          <a
                            href={chat.image}
                            download={`panda-artwork-${Date.now()}.png`}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                            title="Download Image"
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isTyping && !chatHistory.some(c => c.isGeneratingImage) && (
            <div className="flex gap-2 text-xs pointer-events-auto">
              <div className="font-bold text-amber-300 drop-shadow-md shrink-0 bg-black/50 px-2 py-0.5 rounded-md h-fit text-[11px]">PandaBot:</div>
              <div className="text-white bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex items-center gap-1.5">
                <span className="text-xs text-amber-300 font-medium">Formulating Dragon Warrior wisdom...</span>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Bar: Comment Input, Voice Assistant, Image Generation & Live Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex flex-col z-30 pointer-events-auto bg-gradient-to-t from-black via-black/90 to-transparent">
          
          {/* Active Image Editing Banner */}
          {editingBaseImage && (
            <div className="flex items-center justify-between gap-2 bg-amber-950/90 backdrop-blur-md border border-amber-400/50 rounded-xl px-3 py-1.5 text-xs text-amber-200 mb-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 truncate">
                <img src={editingBaseImage} alt="Base" className="w-7 h-7 object-cover rounded-lg border border-amber-400/50 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-amber-300 text-[11px]">Editing with gemini-3.1-flash-image-preview:</span>
                  <span className="text-white/80 text-[10px] ml-1.5">Type your edit instructions below (e.g., "add golden chi aura", "night sky")</span>
                </div>
              </div>
              <button 
                onClick={() => setEditingBaseImage(null)} 
                className="text-amber-300 hover:text-white p-1 rounded-md hover:bg-white/10 shrink-0"
                title="Cancel Image Edit"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Image Creator Button */}
            <button
              onClick={() => setShowImagePromptModal(true)}
              className="h-10 px-3 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              title="Create Image with gemini-3.1-flash-image-preview"
            >
              <Sparkles size={15} className="text-amber-400" />
              <span className="hidden sm:inline">Create Image</span>
            </button>

            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={
                  editingBaseImage
                    ? "Type image modifications (e.g. 'add cherry blossom trees')..."
                    : isListening 
                      ? "Listening to your voice..." 
                      : "Comment, or ask 'generate image of Po'..."
                }
                className="w-full bg-white/10 border border-white/30 rounded-full pl-4 pr-12 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 placeholder:text-white/60 transition-all"
              />
              
              {message.trim() && (
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={isTyping}
                  className="absolute right-2 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-full transition-colors shadow-md flex items-center gap-1 cursor-pointer"
                >
                  {editingBaseImage ? <Wand2 size={12} /> : null}
                  <span>{editingBaseImage ? 'Edit' : 'Send'}</span>
                </button>
              )}
            </div>

            {/* Live Voice Assistant Mic Button */}
            <button 
              onClick={toggleVoiceAssistantListening}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-lg shrink-0 ${
                isListening 
                  ? 'bg-rose-500 border-rose-400 text-white animate-pulse scale-110 shadow-rose-500/50' 
                  : 'bg-black/40 backdrop-blur-md border-white/20 text-amber-300 hover:border-amber-400 hover:bg-white/10'
              }`}
              title={isListening ? "Stop Listening" : "Speak to PandaBot with Voice Assistant"}
            >
              {isListening ? <AudioLines size={18} className="animate-bounce" /> : <Mic size={18} />}
            </button>

            {/* Camera Toggle */}
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer border border-white/20 text-white hover:bg-white/10 shrink-0"
              title="Toggle Camera"
            >
              {isVideoOn ? <Video size={18} /> : <VideoOff size={18} className="text-white/40" />}
            </button>
          </div>
        </div>

        {/* Modal: Create Image with gemini-3.1-flash-image-preview */}
        {showImagePromptModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setShowImagePromptModal(false)}
          >
            <div 
              className="w-full max-w-lg bg-neutral-900 border border-amber-400/40 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Create Image with Gemini</h3>
                    <p className="text-[11px] font-mono text-amber-300">gemini-3.1-flash-image-preview</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowImagePromptModal(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: "1:1", label: "1:1 Square" },
                    { id: "16:9", label: "16:9 Wide" },
                    { id: "9:16", label: "9:16 Story" },
                    { id: "4:3", label: "4:3 Classic" },
                    { id: "3:4", label: "3:4 Portrait" },
                  ].map(ar => (
                    <button
                      key={ar.id}
                      onClick={() => setSelectedAspectRatio(ar.id)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                        selectedAspectRatio === ar.id 
                          ? 'bg-amber-400 text-black border-amber-300 shadow'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {ar.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Inspiration Presets */}
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">Kung Fu Inspiration Presets</label>
                <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {[
                    "Po in glowing golden chi dragon armor standing on the Sacred Mountain",
                    "Master Shifu and Po having a steaming dumpling showdown at the Jade Palace",
                    "Tigress executing an acrobatic aerial strike under a glowing full moon",
                    "Po floating in the Spirit Realm surrounded by golden lotus blossoms",
                    "The Furious Five in a legendary team pose overlooking the Valley of Peace",
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        handleSendMessage(preset);
                        setShowImagePromptModal(false);
                      }}
                      className="text-left text-[11px] p-2 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:text-amber-300 hover:border-amber-400/40 border border-white/10 transition-all flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">{preset}</span>
                      <Sparkles size={12} className="opacity-0 group-hover:opacity-100 text-amber-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt Input */}
              <div className="pt-2 border-t border-white/10">
                <label className="text-xs font-semibold text-white/80 block mb-1.5">Or write a custom image prompt:</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    id="modal-image-prompt-input"
                    placeholder="e.g. Master Oogway meditating under peach blossoms..."
                    className="flex-1 bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-white/40"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                        handleSendMessage((e.target as HTMLInputElement).value);
                        setShowImagePromptModal(false);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const inp = document.getElementById('modal-image-prompt-input') as HTMLInputElement;
                      if (inp && inp.value.trim()) {
                        handleSendMessage(inp.value);
                        setShowImagePromptModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    <span>Generate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        {fullscreenImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-in fade-in"
            onClick={() => setFullscreenImage(null)}
          >
            <div 
              className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" 
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={fullscreenImage.url} 
                alt={fullscreenImage.prompt || "Artwork"} 
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-amber-400/30"
              />
              <div className="mt-4 flex flex-wrap items-center justify-between w-full px-2 gap-3">
                <div className="text-white text-xs sm:text-sm font-semibold truncate max-w-md flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono text-[10px]">
                    gemini-3.1-flash-image-preview
                  </span>
                  <span className="truncate">{fullscreenImage.prompt || "Kung Fu Artwork"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingBaseImage(fullscreenImage.url);
                      setEditingImagePrompt(fullscreenImage.prompt || "");
                      setMessage("make it: ");
                      setFullscreenImage(null);
                    }}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <Wand2 size={13} />
                    <span>Edit Image</span>
                  </button>
                  <a
                    href={fullscreenImage.url}
                    download="panda-creation.png"
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-white/20 transition-colors"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                  <button 
                    onClick={() => setFullscreenImage(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
