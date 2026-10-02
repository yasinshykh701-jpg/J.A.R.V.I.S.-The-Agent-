import re

with open('src/components/InputBox.tsx', 'r') as f:
    code = f.read()

# Add new state variables
new_states = """
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState<{type: string, src: string} | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const liveWsRef = useRef<any>(null);
  const audioCtxRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleGenerateImage = async () => {
    if (!message.trim()) return alert("Please enter a prompt first.");
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message })
      });
      const data = await res.json();
      if (data.image) setGeneratedMedia({ type: 'image', src: `data:${data.mimeType};base64,${data.image}` });
    } catch (e) { console.error(e); }
    setIsGenerating(false);
  };

  const handleGenerateVideo = async () => {
    if (!message.trim()) return alert("Please enter a prompt first.");
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
    if (!message.trim()) return alert("Please enter a prompt first.");
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
"""

code = code.replace('const [isListening, setIsListening] = useState(false);', 'const [isListening, setIsListening] = useState(false);\n' + new_states)

# Replace Wallpaper Button onClick
code = code.replace('onClick={onWallpaperClick}', 'onClick={handleGenerateImage}')

# Replace Video Button onClick
code = code.replace('title="Generate Video"', 'title="Generate Video"\n            onClick={handleGenerateVideo}')

# Replace Music Pill onClick
code = code.replace('onClick={() => setIsMusicPlayerOpen(true)}', 'onClick={handleGenerateMusic}')

# Add a modal for displaying generated media right before the end of the return statement
media_modal = """
      {/* Generated Media Modal */}
      {isGenerating && (
        <div className="absolute inset-x-0 bottom-full mb-4 mx-4 bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col items-center justify-center z-50">
           <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
           <p className="text-white font-medium">Generating your AI content with Gemini & Veo...</p>
        </div>
      )}
      
      {generatedMedia && (
        <div className="absolute inset-x-0 bottom-full mb-4 mx-4 bg-black rounded-2xl p-4 border border-white/20 shadow-xl z-50">
           <button onClick={() => setGeneratedMedia(null)} className="absolute top-2 right-2 text-white/60 hover:text-white"><X size={20}/></button>
           {generatedMedia.type === 'image' && <img src={generatedMedia.src} className="w-full h-48 object-cover rounded-xl" />}
           {generatedMedia.type === 'video' && <video src={generatedMedia.src} controls autoPlay className="w-full h-48 object-cover rounded-xl" />}
           {generatedMedia.type === 'audio' && <audio src={generatedMedia.src} controls autoPlay className="w-full mt-4" />}
        </div>
      )}
"""

code = code.replace('{/* Device Music Player Modal & Floating Widget */}', media_modal + '\n      {/* Device Music Player Modal & Floating Widget */}')

# Replace Microphone button logic with Transcribe
code = code.replace('onClick={toggleListening}', 'onClick={handleTranscribe}')
code = code.replace('isListening', 'isTranscribing')

# Replace Virtual Panda button logic with Live API
code = code.replace('onClick={onVirtualCommunicationClick}', 'onClick={toggleLiveAPI}')
# Fix the Live API button visual
code = code.replace('title="Talk to Panda (Virtual Speak)"', 'title="Talk to Panda (Live API)"')

with open('src/components/InputBox.tsx', 'w') as f:
    f.write(code)

