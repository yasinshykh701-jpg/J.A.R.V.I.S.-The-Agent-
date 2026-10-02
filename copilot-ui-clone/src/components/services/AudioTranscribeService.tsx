import React, { useState, useRef } from 'react';
import { Mic, MicOff, RefreshCw, X, Check, Copy, ArrowDownRight } from 'lucide-react';

interface AudioTranscribeServiceProps {
  onClose?: () => void;
  onApplyTranscript?: (text: string) => void;
}

export function AudioTranscribeService({ onClose, onApplyTranscript }: AudioTranscribeServiceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    setErrorMsg(null);
    setTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendToTranscribe(audioBlob);
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMsg('Microphone access denied or not available. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const sendToTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: 'audio/webm'
          })
        });
        const data = await res.json();
        if (data.text) {
          setTranscript(data.text);
        } else if (data.error) {
          setErrorMsg(data.error);
        } else {
          setTranscript('No speech detected in audio.');
        }
        setIsTranscribing(false);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMsg(err.message || 'Transcription failed.');
      setIsTranscribing(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 flex flex-col gap-3 text-white backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Mic size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide uppercase text-white">Speech-to-Text Transcription</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                gemini-3.5-transcribe
              </span>
            </div>
            <p className="text-[11px] text-white/60">High-accuracy verbatim audio transcription powered by Gemini</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Recording Control Button & Timer */}
      <div className="flex flex-col items-center justify-center gap-3 py-2">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isTranscribing}
          className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border shadow-lg ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 border-red-300 text-white animate-pulse shadow-red-500/50 scale-105'
              : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-300 text-slate-950 shadow-emerald-500/30 hover:scale-105'
          }`}
        >
          {isRecording ? <MicOff size={26} /> : <Mic size={26} />}
        </button>

        <div className="flex flex-col items-center">
          <span className="text-sm font-mono font-bold text-white">
            {isRecording ? `Recording (${formatSeconds(recordSeconds)})` : isTranscribing ? 'Transcribing...' : 'Click to Speak'}
          </span>
          <span className="text-[11px] text-white/50">
            {isRecording
              ? 'Listening to microphone... click to finish'
              : isTranscribing
              ? 'Synthesizing transcription with gemini-3.5-transcribe...'
              : 'Record speech to transcribe directly into text'}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Result Transcription */}
      {transcript && (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-black/60 border border-emerald-400/40">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold border-b border-white/10 pb-1">
            <span>Transcribed Output</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(transcript)}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Copy size={11} /> Copy
              </button>
              {onApplyTranscript && (
                <button
                  type="button"
                  onClick={() => onApplyTranscript(transcript)}
                  className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[11px] font-medium flex items-center gap-1 cursor-pointer border border-emerald-400/40"
                >
                  <ArrowDownRight size={12} /> Use in Prompt
                </button>
              )}
            </div>
          </div>
          <p className="text-white text-xs leading-relaxed max-h-32 overflow-y-auto">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}
