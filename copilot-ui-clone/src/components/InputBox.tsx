import { ChevronDown, Glasses, AudioLines, MapPin, Music, UserCircle, Headset, Paperclip, Send, Image as ImageIcon, Video, X, Mic, MicOff, Sparkles, FileText, FileCode, File, CheckCircle2, Disc3, Bot, Database, Palette, Check, Download, Zap, Layers } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DeviceMusicPlayer, Song } from './DeviceMusicPlayer';
import chromeBorderImg from '../assets/images/silver_chrome_border_1789300088012.jpg';
import { VeoVideoService } from './services/VeoVideoService';
import { ImageStudioService } from './services/ImageStudioService';
import { AudioTranscribeService } from './services/AudioTranscribeService';
import { ChatHistoryView, CHAT_ROLES, ChatMessageItem, ChatRoleConfig } from './services/ChatHistoryView';
import { MapsGroundingService } from './services/MapsGroundingService';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  rawFile?: File;
}

export interface ModelOption {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  dotColor: string;
  glowColor: string;
  borderColor: string;
  textColor: string;
  icon: 'gemini' | 'gpt' | 'rag' | 'image';
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini',
    name: 'Gemini (gemini-3.5-flash)',
    shortName: '3.5 Flash',
    badge: 'General Tasks',
    description: 'gemini-3.5-flash • Multimodal general assistant & Google Maps grounding',
    dotColor: 'bg-cyan-400',
    glowColor: 'shadow-[0_0_8px_rgba(34,211,238,0.9)]',
    borderColor: 'border-cyan-400/50',
    textColor: 'text-cyan-400',
    icon: 'gemini'
  },
  {
    id: 'gpt',
    name: 'Gemini Pro (gemini-3.1-pro-preview)',
    shortName: '3.1 Pro',
    badge: 'Complex Reasoning',
    description: 'gemini-3.1-pro-preview • STEM reasoning, code architect & structured logic',
    dotColor: 'bg-emerald-400',
    glowColor: 'shadow-[0_0_8px_rgba(52,211,153,0.9)]',
    borderColor: 'border-emerald-400/50',
    textColor: 'text-emerald-400',
    icon: 'gpt'
  },
  {
    id: 'flash_lite',
    name: 'Gemini Lite (gemini-3.1-flash-lite)',
    shortName: 'Flash Lite',
    badge: 'Fast Tasks',
    description: 'gemini-3.1-flash-lite • Low-latency, ultra-fast responses for rapid tasks',
    dotColor: 'bg-blue-400',
    glowColor: 'shadow-[0_0_8px_rgba(96,165,250,0.9)]',
    borderColor: 'border-blue-400/50',
    textColor: 'text-blue-400',
    icon: 'gemini'
  },
  {
    id: 'veo',
    name: 'Veo 3 Video (veo-3.1-fast-generate-preview)',
    shortName: 'Veo 3 Video',
    badge: 'Veo Video',
    description: 'veo-3.1-fast-generate-preview • Text-to-video & Animate photos into video',
    dotColor: 'bg-cyan-400',
    glowColor: 'shadow-[0_0_8px_rgba(34,211,238,0.9)]',
    borderColor: 'border-cyan-400/50',
    textColor: 'text-cyan-400',
    icon: 'gemini'
  },
  {
    id: 'nano_banana',
    name: 'Image Studio (gemini-3.1-flash-image-preview)',
    shortName: 'Image Studio',
    badge: 'Create & Edit',
    description: 'gemini-3.1-flash-image-preview • Create & edit images with text prompts',
    dotColor: 'bg-amber-400',
    glowColor: 'shadow-[0_0_8px_rgba(251,191,36,0.9)]',
    borderColor: 'border-amber-400/50',
    textColor: 'text-amber-400',
    icon: 'image'
  },
  {
    id: 'zevorix_rag',
    name: 'Zevorix RAG Knowledge',
    shortName: 'Zevorix RAG',
    badge: 'RAG Knowledge',
    description: 'Vector & PDF document retrieval knowledge base',
    dotColor: 'bg-purple-400',
    glowColor: 'shadow-[0_0_8px_rgba(192,132,252,0.9)]',
    borderColor: 'border-purple-400/50',
    textColor: 'text-purple-400',
    icon: 'rag'
  }
];

function PandaIcon({ size = 22, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ears */}
      <circle cx="8.5" cy="8.5" r="5.5" fill="#1e293b" />
      <circle cx="27.5" cy="8.5" r="5.5" fill="#1e293b" />
      <circle cx="8.5" cy="8.5" r="2.8" fill="#0f172a" />
      <circle cx="27.5" cy="8.5" r="2.8" fill="#0f172a" />
      
      {/* Head */}
      <circle cx="18" cy="19" r="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      
      {/* Eye Patches */}
      <ellipse cx="12" cy="18" rx="3.8" ry="4.6" transform="rotate(-15 12 18)" fill="#1e293b" />
      <ellipse cx="24" cy="18" rx="3.8" ry="4.6" transform="rotate(15 24 18)" fill="#1e293b" />
      
      {/* Eyes Pupils */}
      <circle cx="12.5" cy="17.5" r="1.5" fill="#ffffff" />
      <circle cx="13" cy="17.2" r="0.8" fill="#38bdf8" />
      <circle cx="23.5" cy="17.5" r="1.5" fill="#ffffff" />
      <circle cx="23" cy="17.2" r="0.8" fill="#38bdf8" />
      
      {/* Nose */}
      <ellipse cx="18" cy="22.5" rx="2.5" ry="1.8" fill="#1e293b" />
      <ellipse cx="18" cy="22.2" rx="1" ry="0.6" fill="#94a3b8" />
      
      {/* Mouth */}
      <path d="M16 25 Q18 27.2 20 25" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      
      {/* Cheeks blush */}
      <circle cx="9" cy="22.5" r="1.8" fill="#fb7185" opacity="0.45" />
      <circle cx="27" cy="22.5" r="1.8" fill="#fb7185" opacity="0.45" />
    </svg>
  );
}

export function InputBox({ isVoiceEnabled = true, onVirtualCommunicationClick, onRunPythonClick, onMessageSent, globalSelectedVoice, onWallpaperClick }: { isVoiceEnabled?: boolean, onVirtualCommunicationClick?: () => void, onRunPythonClick?: () => void, onMessageSent?: () => void, globalSelectedVoice?: string, onWallpaperClick?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [selectedEngine, setSelectedEngine] = useState("Gemini");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Modular Services State (Veo 3 Video, Image Studio, Transcribe, Chatbot Roles, Maps Grounding)
  const [activeServiceMode, setActiveServiceMode] = useState<'chat' | 'video' | 'image' | 'transcribe' | 'maps' | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessageItem[]>([]);
  const [currentRole, setCurrentRole] = useState<ChatRoleConfig>(CHAT_ROLES[0]);

  const activeModelObj = AVAILABLE_MODELS.find(m => m.name === selectedEngine || (m.id === 'nano_banana' && selectedEngine.includes('Nano Banana')) || (m.id === 'zevorix_rag' && selectedEngine.includes('RAG'))) || AVAILABLE_MODELS[0];

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState<{type: string, src: string} | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const liveWsRef = useRef<any>(null);
  const audioCtxRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleGenerateImage = async (customPrompt?: string) => {
    const promptToUse = (customPrompt || message).trim();
    if (!promptToUse) {
      setChatResponse("Please enter a prompt to generate an image.");
      return;
    }
    
    setIsGenerating(true);
    setChatResponse(""); // clear previous
    setGeneratedMedia(null);
    
    let baseImageBase64 = "";
    if (attachedFiles.length > 0) {
      const imgFile = attachedFiles.find(f => f.type.startsWith('image/') && f.rawFile);
      if (imgFile && imgFile.rawFile) {
        const reader = new FileReader();
        baseImageBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
             const result = reader.result as string;
             resolve(result.split(',')[1] || "");
          };
          reader.readAsDataURL(imgFile.rawFile!);
        });
      }
    }

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToUse, baseImage: baseImageBase64, model: 'nano_banana' })
      });
      const data = await res.json();
      if (data.image) {
        setGeneratedMedia({ type: 'image', src: `data:${data.mimeType || 'image/jpeg'};base64,${data.image}` });
        setChatResponse("Here is your generated image:");
      } else if (data.imageUrl) {
        setGeneratedMedia({ type: 'image', src: data.imageUrl });
        setChatResponse("Here is your generated image:");
      } else {
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptToUse)}?width=1024&height=1024&seed=${Math.floor(Math.random()*10000)}&nologo=true`;
        setGeneratedMedia({ type: 'image', src: fallbackUrl });
        setChatResponse("Here is your generated image:");
      }
      if (!customPrompt) setMessage("");
    } catch (e) { 
      console.error(e);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptToUse)}?width=1024&height=1024&seed=${Math.floor(Math.random()*10000)}&nologo=true`;
      setGeneratedMedia({ type: 'image', src: fallbackUrl });
      setChatResponse("Here is your generated image:");
      if (!customPrompt) setMessage("");
    }
    setIsGenerating(false);
  };

  const handleGenerateVideo = async () => {
    if (!message.trim()) {
      setChatResponse("Please enter a prompt first.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message })
      });
      const data = await res.json();
      if (data.video) setGeneratedMedia({ type: 'video', src: `data:${data.mimeType};base64,${data.video}` });
    } catch (e) { console.error(e); }
    setIsGenerating(false);
  };

  const handleGenerateMusic = async () => {
    if (!message.trim()) {
      setIsMusicPlayerOpen(true);
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message })
      });
      const data = await res.json();
      if (data.audio) setGeneratedMedia({ type: 'audio', src: `data:${data.mimeType};base64,${data.audio}` });
    } catch (e) { console.error(e); }
    setIsGenerating(false);
  };

  const toggleLiveAPI = async () => {
    if (isLiveActive) {
      liveWsRef.current?.close();
      audioCtxRef.current?.close();
      setIsLiveActive(false);
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ws = new WebSocket(`wss://${location.host}/live`);
      // Fallback for dev server using http/ws
      if (location.protocol === 'http:') {
         // ws = new WebSocket(`ws://${location.host}/live`);
      }
      const actualWs = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/live`);
      liveWsRef.current = actualWs;
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioCtxRef.current = inputCtx;
      
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(inputCtx.destination);
      
      processor.onaudioprocess = (e) => {
        if (actualWs.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        // Simple PCM to Base64 (Int16)
        const buffer = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        let binary = '';
        const bytes = new Uint8Array(buffer.buffer);
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        actualWs.send(JSON.stringify({ audio: btoa(binary) }));
      };
      
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      actualWs.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio) {
          const binaryStr = atob(msg.audio);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
          const pcm16 = new Int16Array(bytes.buffer);
          const audioBuffer = outputCtx.createBuffer(1, pcm16.length, 24000);
          const channelData = audioBuffer.getChannelData(0);
          for (let i = 0; i < pcm16.length; i++) channelData[i] = pcm16[i] / 32768;
          const sourceNode = outputCtx.createBufferSource();
          sourceNode.buffer = audioBuffer;
          sourceNode.connect(outputCtx.destination);
          sourceNode.start();
        }
      };
      setIsLiveActive(true);
    } catch(e) { console.error("Live API Error:", e); }
  };

  const handleTranscribe = async () => {
    if (isTranscribing) {
       mediaRecorderRef.current?.stop();
       setIsTranscribing(false);
       return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
           const base64data = (reader.result as string).split(',')[1];
           setChatResponse("Transcribing...");
           try {
             const res = await fetch('/api/transcribe', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ audioBase64: base64data, mimeType: 'audio/webm' })
             });
             const data = await res.json();
             setMessage(prev => prev + (prev ? " " : "") + data.text);
             setChatResponse("");
           } catch(e) { setChatResponse("Error transcribing"); }
        };
      };
      
      mediaRecorder.start();
      setIsTranscribing(true);
    } catch(e) { console.error(e); }
  };

  const [isFocused, setIsFocused] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newAttached: AttachedFile[] = [];

    Array.from(files).forEach(file => {
      const isImg = file.type.startsWith('image/');
      newAttached.push({
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: isImg ? URL.createObjectURL(file) : undefined,
        rawFile: file
      });
    });

    setAttachedFiles(prev => [...prev, ...newAttached]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter(f => f.id !== id);
    });
  };

  const toggleListening = () => {
    if (isTranscribing) {
      if (recognitionRef.current) {
         recognitionRef.current.stop();
      }
      setIsTranscribing(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setChatResponse('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsTranscribing(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setMessage(prev => prev + (prev ? ' ' : '') + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        setChatResponse('Microphone access was denied. Please allow microphone permissions to use voice input.');
      }
      setIsTranscribing(false);
    };

    recognition.onend = () => {
      setIsTranscribing(false);
    };

    try {
        recognition.start();
    } catch(e) {
        console.error(e);
        setIsTranscribing(false);
    }
  };

  useEffect(() => {
    // Ensure voices are loaded early
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);


  const [chatResponse, setChatResponse] = useState("");

  const handleSend = async (isRag: boolean = false, overrideMessage?: string) => {
    let msgToUse = overrideMessage || message;
    if (!msgToUse.trim() && attachedFiles.length === 0) return;
    
    // If Nano Banana image generation engine is selected, generate image directly!
    if (selectedEngine.includes('Nano Banana')) {
      await handleGenerateImage(msgToUse);
      return;
    }

    if (attachedFiles.length > 0 && !overrideMessage) {
      const fileSummary = attachedFiles.map(f => `[Attached File: ${f.name} (${formatFileSize(f.size)})]`).join(', ');
      msgToUse = msgToUse.trim() ? `${msgToUse}\n\n${fileSummary}` : `Analyze the uploaded files: ${fileSummary}`;
    }
    
    const userMsgItem: ChatMessageItem = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: msgToUse,
      timestamp: Date.now()
    };
    setChatHistory(prev => [...prev, userMsgItem]);
    
    if (onMessageSent) onMessageSent(); setIsSubmitting(true);
    setChatResponse("Thinking...");
    try {
      let response;
      const effectiveRag = Boolean(isRag || selectedEngine === 'Zevorix RAG');
      const isMapsActive = activeServiceMode === 'maps' || isMapOpen;
      
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: msgToUse,
          history: chatHistory,
          engine: selectedEngine,
          mapOpen: isMapsActive,
          useMaps: isMapsActive,
          isRag: effectiveRag,
          modelType: isMapsActive ? 'gemini-3.5-flash' : currentRole.model,
          roleTitle: currentRole.id,
          systemInstruction: currentRole.systemInstruction
        })
      });
      
      if (!response.ok) {
        let errorMessage = 'Network response was not ok';
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = `Server Error ${response.status}: Failed to get a valid response.`;
          }
        } catch (e) {
          console.error("Error parsing error response", e);
        }
        throw new Error(errorMessage);
      }
      
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server returned an invalid non-JSON response.");
      }
      
      // Resilient parser to support multiple schema patterns (e.g. response, result, answer, output)
      const responseText = data.response || data.result || data.answer || data.output || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
      
      const modelMsgItem: ChatMessageItem = {
        id: `model_${Date.now()}`,
        role: 'model',
        text: responseText || "No response received.",
        timestamp: Date.now(),
        model: currentRole.model,
        roleTitle: currentRole.title
      };
      setChatHistory(prev => [...prev, modelMsgItem]);

      setChatResponse(responseText || "No response received.");
      setMessage('');
      setAttachedFiles([]);
      
      // Optional text-to-speech for PandaBot too
      if (isVoiceEnabled && responseText) {
        const utterance = new SpeechSynthesisUtterance(responseText);
        const voices = window.speechSynthesis.getVoices();
        
        const preferredVoices = [
          'Google UK English Male',
          'Microsoft David',
          'Microsoft Mark',
          'Daniel',
          'Alex',
          'Fred',
          'Arthur',
          'Oliver',
          'Matthew'
        ];
        
        let maleVoice = null;
        for (const pref of preferredVoices) {
          maleVoice = voices.find(v => v.name.includes(pref));
          if (maleVoice) break;
        }
        
        if (!maleVoice) {
          maleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('guy') ||
            voice.name.toLowerCase().includes('boy')
          ) || voices.find(voice => voice.lang.startsWith('en-'));
        }
        
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.9;
        const ttsRate = 1.0;
        utterance.rate = ttsRate;

        // Store in global window to prevent garbage collection which drops the onend event
        (window as any).currentUtterance = utterance;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (error: any) {
      console.error('Error connecting to backend:', error);
      setChatResponse(error.message || 'Could not connect to backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      
      {/* Main PandaBot InputBox with Silver Glassy Border */}
      <motion.div 
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleDropFiles}
        animate={{
          boxShadow: isFocused 
            ? '0 0 35px 2px rgba(226, 232, 240, 0.4), 0 16px 45px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.85)' 
            : '0 12px 36px rgba(0, 0, 0, 0.45), inset 0 1px 1.5px rgba(255, 255, 255, 0.65), inset 0 -1px 1px rgba(255, 255, 255, 0.1)',
          borderColor: isDraggingFile ? 'rgba(34, 211, 238, 0.9)' : isFocused ? 'rgba(255, 255, 255, 0.85)' : 'rgba(203, 213, 225, 0.45)'
        }}
        className={`relative w-full min-h-[250px] max-h-[85vh] overflow-y-auto bg-slate-950/40 dark:bg-black/50 backdrop-blur-2xl rounded-3xl p-6 flex flex-col border border-slate-300/40 dark:border-slate-400/35 transition-all duration-300 ring-1 ring-white/20 ${isDraggingFile ? 'ring-4 ring-cyan-400/50 bg-cyan-950/20' : ''}`}
      >
        {/* Silver Gloss Top Specular Line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-30" />
        
        {/* Drag Over Visual Indicator */}
        <AnimatePresence>
          {isDraggingFile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-40 border-2 border-dashed border-cyan-400 rounded-3xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 animate-bounce">
                <Paperclip size={28} />
              </div>
              <div className="text-white text-base font-bold">Drop files here to upload</div>
              <div className="text-cyan-300/80 text-xs">Supports images, documents, audio, videos, code & data</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5 relative z-20 flex-wrap">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full px-3.5 py-1 border border-slate-200/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></div>
              <span className="text-white text-[10px] font-bold tracking-wider">ZEVORIX MULTI-AI SERVICES</span>
            </button>
            <span className="text-[10px] text-white/50 hidden sm:inline-block">
              Role: <span className="text-cyan-300 font-semibold">{currentRole.title}</span>
            </span>
          </div>

          {/* Upload Files Quick Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-slate-300/30 text-white/80 hover:text-white text-[11px] font-medium transition-all cursor-pointer shadow-sm"
          >
            <Paperclip size={12} className="text-cyan-300" />
            <span>{attachedFiles.length > 0 ? `${attachedFiles.length} file(s) attached` : 'Attach File'}</span>
          </button>
        </div>

        {/* AI Services Tabs Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 relative z-20 border-b border-white/10 mb-3">
          <button
            type="button"
            onClick={() => setActiveServiceMode(activeServiceMode === 'chat' ? null : 'chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
              activeServiceMode === 'chat' || (!activeServiceMode && chatHistory.length > 0)
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bot size={13} className="text-cyan-300" />
            <span>Gemini Chatbot</span>
            {chatHistory.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-bold flex items-center justify-center">
                {chatHistory.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveServiceMode(activeServiceMode === 'video' ? null : 'video')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
              activeServiceMode === 'video'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Video size={13} className="text-cyan-300" />
            <span>Veo 3 Video Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveServiceMode(activeServiceMode === 'image' ? null : 'image')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
              activeServiceMode === 'image'
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Palette size={13} className="text-amber-300" />
            <span>Image Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveServiceMode(activeServiceMode === 'transcribe' ? null : 'transcribe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
              activeServiceMode === 'transcribe'
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Mic size={13} className="text-emerald-300" />
            <span>Audio Transcribe</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveServiceMode(activeServiceMode === 'maps' ? null : 'maps')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
              activeServiceMode === 'maps'
                ? 'bg-blue-500/25 border-blue-400 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapPin size={13} className="text-blue-300" />
            <span>Maps Grounding</span>
          </button>
        </div>

        {/* Active Sub-Service Embedded View */}
        {activeServiceMode === 'video' && (
          <div className="mb-3">
            <VeoVideoService
              onClose={() => setActiveServiceMode(null)}
              onSetWallpaper={(videoUrl) => {
                if (onWallpaperClick) onWallpaperClick();
              }}
              attachedPhotoUrl={attachedFiles.find(f => f.type.startsWith('image/'))?.url}
            />
          </div>
        )}

        {activeServiceMode === 'image' && (
          <div className="mb-3">
            <ImageStudioService
              onClose={() => setActiveServiceMode(null)}
              onAnimateWithVeo={() => setActiveServiceMode('video')}
              attachedImageUrl={attachedFiles.find(f => f.type.startsWith('image/'))?.url}
            />
          </div>
        )}

        {activeServiceMode === 'transcribe' && (
          <div className="mb-3">
            <AudioTranscribeService
              onClose={() => setActiveServiceMode(null)}
              onApplyTranscript={(transcription) => {
                setMessage(prev => (prev ? `${prev} ${transcription}` : transcription));
              }}
            />
          </div>
        )}

        {activeServiceMode === 'maps' && (
          <div className="mb-3">
            <MapsGroundingService
              onClose={() => setActiveServiceMode(null)}
              onQuerySubmit={(q) => {
                setMessage(q);
                handleSend(false, q);
              }}
            />
          </div>
        )}

        {/* Multi-Turn Chat View (active in chat mode or if conversation exists) */}
        {(activeServiceMode === 'chat' || (!activeServiceMode && chatHistory.length > 0)) && (
          <ChatHistoryView
            messages={chatHistory}
            currentRole={currentRole}
            onSelectRole={(role) => setCurrentRole(role)}
            onClearHistory={() => setChatHistory([])}
            onSpeak={(txt) => {
              const u = new SpeechSynthesisUtterance(txt);
              window.speechSynthesis.speak(u);
            }}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Attached Files Preview Pills */}
        {attachedFiles.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 relative z-20 max-w-full">
            {attachedFiles.map((file) => (
              <div 
                key={file.id}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-400/40 rounded-xl text-white text-xs shrink-0 shadow-md backdrop-blur-md group"
              >
                {file.url ? (
                  <img src={file.url} alt={file.name} className="w-5 h-5 rounded-md object-cover" />
                ) : file.name.endsWith('.pdf') ? (
                  <FileText size={14} className="text-red-400" />
                ) : file.name.match(/\.(js|ts|tsx|jsx|py|html|css|json)$/i) ? (
                  <FileCode size={14} className="text-emerald-400" />
                ) : (
                  <File size={14} className="text-cyan-300" />
                )}
                
                <span className="font-medium truncate max-w-[120px]" title={file.name}>
                  {file.name}
                </span>
                
                <span className="text-[10px] text-white/50">
                  {formatFileSize(file.size)}
                </span>

                <button 
                  onClick={() => removeAttachedFile(file.id)}
                  className="p-0.5 rounded-full hover:bg-white/20 text-white/60 hover:text-white transition-colors cursor-pointer ml-1"
                  title="Remove file"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
          {(chatResponse || generatedMedia || isGenerating) && (
            <div className={`w-full max-h-48 overflow-y-auto ${chatResponse === "Thinking..." || isGenerating ? "bg-slate-900/80 animate-pulse border-cyan-500/50" : "bg-slate-900/60 border-slate-300/30"} backdrop-blur-md border rounded-2xl p-4 flex flex-col gap-3 mb-4 shadow-lg`}>
              <div className="flex justify-between items-start">
                <span className="text-white text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {isGenerating ? "Generating image..." : chatResponse}
                </span>
                <button 
                  onClick={() => { setChatResponse(""); setGeneratedMedia(null); setIsGenerating(false); }}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex shrink-0 items-center justify-center transition-all cursor-pointer ml-4 mt-0.5"
                >
                  <X size={14} className="text-white/80" />
                </button>
              </div>
              
              {generatedMedia && generatedMedia.type === 'image' && (
                 <div className="relative rounded-xl overflow-hidden border border-white/10 group mt-2 self-start max-w-full">
                   <img src={generatedMedia.src} alt="Generated Media" className="h-32 object-contain rounded-xl bg-black" referrerPolicy="no-referrer" />
                   <a href={generatedMedia.src} download="generated-image.png" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-black/70 backdrop-blur text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 hover:bg-black transition-all cursor-pointer shadow-lg flex items-center gap-1.5">
                     <Download size={14} /> Save
                   </a>
                 </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-start w-full h-full">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(false);
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-full bg-transparent border-none outline-none text-white text-xl font-sans resize-none placeholder:text-white/40"
              placeholder={
                selectedEngine.includes('Nano Banana')
                  ? "Describe the image to generate with Nano Banana (e.g. A futuristic cyber panda in 4k)..."
                  : selectedEngine === 'Zevorix RAG'
                  ? "Ask questions based on indexed PDF document knowledge base..."
                  : selectedEngine === 'GPT'
                  ? "Ask GPT-4o anything for deep reasoning, analysis, or code..."
                  : attachedFiles.length > 0 
                  ? "Add message or question about the uploaded file(s)..." 
                  : "Ask Gemini anything or type prompt..."
              }
              spellCheck={false}
              autoFocus
            />
            {message && (
              <button 
                onClick={() => setMessage("")} 
                className="ml-4 shrink-0 bg-white/15 hover:bg-white/25 text-white/90 text-xs px-4 py-1.5 rounded-full transition-colors border border-white/20 cursor-pointer shadow-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-6 right-8 text-white/60 text-xs font-mono z-20">
          {message.length} / 5000
        </div>
      </motion.div>
      
      {/* Bottom Action Bar with Inset Border using Uploaded Liquid Chrome Texture */}
      <div 
        style={{ 
          height: '56.9922px',
          borderWidth: '5px', 
          borderStyle: 'solid',
          borderImageSource: `url(${chromeBorderImg})`,
          borderImageSlice: '30',
          borderImageRepeat: 'round',
          borderRadius: '0px',
          backgroundColor: 'transparent'
        }}
        className="w-full relative !rounded-none overflow-hidden bg-transparent flex justify-between items-center px-4 py-1.5"
      >
        {/* Silver Gloss Top Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none z-20"></div>
        
        {/* Hidden File Input for Paperclip */}
        <input 
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />

        {/* Left Toolbar Items (Unique, No Duplicates) */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative z-10 overflow-x-auto no-scrollbar max-w-[calc(100%-140px)] py-1 bg-transparent">
          {/* Paperclip Upload Button */}
          <button 
            title={attachedFiles.length > 0 ? `${attachedFiles.length} file(s) attached - click to add more` : "Upload files"}
            onClick={() => fileInputRef.current?.click()}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 relative border active:scale-95 backdrop-blur-md shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] ${
              attachedFiles.length > 0
                ? 'bg-black border-cyan-400 text-cyan-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-black hover:bg-neutral-900 text-white/90 hover:text-white border-white/30 hover:border-white/60'
            }`}
          >
            <Paperclip size={16} strokeWidth={2.2} />
            {attachedFiles.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                {attachedFiles.length}
              </span>
            )}
          </button>

          {/* Google Maps Grounding Button */}
          <button 
            title="Google Maps Grounding (gemini-3.5-flash)" 
            onClick={() => setActiveServiceMode(activeServiceMode === 'maps' ? null : 'maps')}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border active:scale-95 backdrop-blur-md shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] ${
              activeServiceMode === 'maps' 
                ? 'bg-black border-blue-400 text-blue-200 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_0_12px_rgba(59,130,246,0.4)] ring-2 ring-blue-400/40' 
                : 'bg-black hover:bg-neutral-900 border-white/30 hover:border-white/60'
            }`}
          >
            <MapPin size={16} color="#4285F4" strokeWidth={2.2} />
          </button>

          {/* Device Music Player Button */}
          <button 
            title={isPlayingMusic ? `Playing: ${activeSong?.title || 'Music'} (Click for Device Player)` : "Device Music Player (Play local device songs)"}
            onClick={handleGenerateMusic}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border active:scale-95 relative backdrop-blur-md shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] ${
              isPlayingMusic 
                ? 'bg-black border-red-400 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_0_15px_rgba(239,68,68,0.6)] ring-2 ring-red-400' 
                : 'bg-black hover:bg-neutral-900 border-white/30 hover:border-white/60'
            }`}
          >
            <Music size={15} color="#ef4444" strokeWidth={2.5} className={isPlayingMusic ? 'animate-bounce' : ''} />
            {isPlayingMusic && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </button>
          
          {/* Avatar Selection Button */}
          <div className="relative">
            <button 
              title="Avatar Selection" 
              onClick={() => setIsAvatarOpen(!isAvatarOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-black hover:bg-neutral-900 border border-white/30 hover:border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-200 overflow-hidden active:scale-95"
            >
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <UserCircle size={18} color="white" strokeWidth={2} />
              )}
            </button>
            {isAvatarOpen && (
              <div className="absolute bottom-full left-0 mb-3 w-52 bg-slate-900/90 border border-slate-300/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl z-50 p-1.5 ring-1 ring-white/20">
                <button 
                  className="w-full text-left px-3.5 py-2.5 text-sm text-white hover:bg-white/15 rounded-xl transition-all flex items-center gap-3 font-medium cursor-pointer"
                  onClick={() => { setSelectedAvatar("https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"); setIsAvatarOpen(false); }}
                >
                  <img src="https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-6 h-6 rounded-full object-cover shadow-sm" />
                  Kung Fu Panda
                </button>
                <button 
                  className="w-full text-left px-3.5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/15 rounded-xl transition-all flex items-center gap-3 font-medium cursor-pointer"
                  onClick={() => { setSelectedAvatar(null); setIsAvatarOpen(false); }}
                >
                  <UserCircle size={18} />
                  Default Avatar
                </button>
              </div>
            )}
          </div>
          
          {/* Spotify Button */}
          <button 
            title="Spotify" 
            onClick={() => setChatResponse("Spotify cannot be opened in this preview. Please open the app in a new tab to use Spotify.")}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-black hover:bg-neutral-900 border border-white/30 hover:border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-200 active:scale-95"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          </button>
          
          {/* Image Studio Button */}
          <button 
            title="Image Studio (gemini-3.1-flash-image-preview)" 
            onClick={() => setActiveServiceMode(activeServiceMode === 'image' ? null : 'image')}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border active:scale-95 backdrop-blur-md shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] ${
              activeServiceMode === 'image'
                ? 'bg-black text-amber-300 border-amber-400 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_0_12px_rgba(251,191,36,0.4)] ring-2 ring-amber-400/40'
                : 'bg-black hover:bg-neutral-900 text-amber-300 hover:text-amber-200 border-white/30 hover:border-white/60'
            }`}
          >
            <ImageIcon size={16} strokeWidth={2.2} />
          </button>

          {/* Veo 3 Video Studio Button */}
          <button 
            title="Veo 3 Video Studio (veo-3.1-fast-generate-preview)"
            onClick={() => setActiveServiceMode(activeServiceMode === 'video' ? null : 'video')} 
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border active:scale-95 backdrop-blur-md shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] ${
              activeServiceMode === 'video'
                ? 'bg-black text-cyan-300 border-cyan-400 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_0_12px_rgba(34,211,238,0.4)] ring-2 ring-cyan-400/40'
                : 'bg-black hover:bg-neutral-900 text-white/90 hover:text-white border-white/30 hover:border-white/60'
            }`}
          >
            <Video size={16} strokeWidth={2.2} />
          </button>
        </div>

        {/* Right Action Items: Voice Input, Virtual Panda Speak & Send */}
        <div className="flex items-center gap-2 relative z-10 shrink-0 pr-1 bg-transparent">
          {/* Microphone Voice Assistant & Transcribe */}
          <button 
            onClick={() => setActiveServiceMode(activeServiceMode === 'transcribe' ? null : 'transcribe')}
            title="Speech-to-Text Transcription (gemini-3.5-transcribe)"
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative border active:scale-95 backdrop-blur-md shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] ${
              activeServiceMode === 'transcribe' 
                ? 'bg-black text-emerald-300 border-emerald-400 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_0_16px_rgba(16,185,129,0.6)] scale-105 ring-2 ring-emerald-400/40' 
                : 'bg-black hover:bg-neutral-900 text-white/90 hover:text-white border-white/30 hover:border-white/60'
            }`}
          >
            {activeServiceMode === 'transcribe' ? (
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <AudioLines size={18} strokeWidth={2} className="relative z-10 text-emerald-300" />
              </span>
            ) : (
              <Mic size={18} strokeWidth={2} />
            )}
          </button>

          {/* Virtual Panda Speak Button (With Custom Panda Logo) */}
          <button 
            onClick={() => {
              if (onVirtualCommunicationClick) onVirtualCommunicationClick();
              else toggleLiveAPI();
            }}
            title="Talk to Panda (Virtual Communication)"
            className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative bg-black hover:bg-neutral-900 border border-white/30 hover:border-cyan-400 active:scale-95 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_0_14px_rgba(34,211,238,0.25)] hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_0_22px_rgba(34,211,238,0.6)] backdrop-blur-md group"
          >
            <PandaIcon size={24} className="relative z-10 group-hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
            <span className="absolute inset-0 rounded-full bg-cyan-400/15 animate-pulse -z-0" />
          </button>

          {/* Send Button */}
          <button 
            onClick={() => handleSend(false)}
            disabled={isSubmitting || (!message.trim() && attachedFiles.length === 0)}
            title="Send Message"
            className="w-9 h-9 rounded-full bg-black hover:bg-neutral-900 border border-white/30 hover:border-white/60 flex items-center justify-center text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md active:scale-95"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={15} className="text-white ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Prompt chips removed per user request */}

      {/* Device Music Player Modal & Floating Widget */}
      <DeviceMusicPlayer
        isOpen={isMusicPlayerOpen}
        onClose={() => setIsMusicPlayerOpen(false)}
        isPlayingGlobal={isPlayingMusic}
        setIsPlayingGlobal={setIsPlayingMusic}
        activeSongGlobal={activeSong}
        setActiveSongGlobal={setActiveSong}
      />
    </div>
  );
}
