import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Send, Volume2, Play, Loader2, Trophy, ArrowRight, Bot, Zap } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import TitanRobotAdvanced from '@/components/TitanRobotAdvanced';
import { deviceTTS } from '@/utils/deviceTTS';
import BackToHome from '@/components/BackToHome';

interface Message {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
}

const interviewQuestions = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths and weaknesses?",
  "Why do you want to work for our company?",
  "Describe a challenging situation you faced and how you handled it.",
  "Where do you see yourself in five years?",
  "What is your greatest professional achievement?",
  "How do you handle stress and pressure?",
  "Why should we hire you?",
];

export default function InterviewPrepPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startInterview = () => {
    setInterviewStarted(true);
    const greetingText = 'Hello! I am Qazyen AI, your AI interviewer. I will be conducting your interview today. Are you ready to begin?';
    const greeting: Message = {
      id: 'greeting',
      role: 'interviewer',
      content: greetingText,
      timestamp: new Date()
    };
    setMessages([greeting]);
    speakText(greetingText);
  };

  const askNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length) {
      const question = interviewQuestions[currentQuestionIndex];
      const questionMessage: Message = {
        id: `question-${currentQuestionIndex}`,
        role: 'interviewer',
        content: question,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, questionMessage]);
      setCurrentQuestionIndex(prev => prev + 1);
      speakText(question);
    } else {
      const endMessageText = 'Thank you for completing the interview! You did a great job. I will review your responses and get back to you soon.';
      const endMessage: Message = {
        id: 'end',
        role: 'interviewer',
        content: endMessageText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, endMessage]);
      speakText(endMessageText);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      toast.success('Recording stopped');
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: formData
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        throw new Error(errorMsg || error.message);
      }

      if (data?.text) {
        setInput(data.text);
        toast.success('Voice transcribed successfully');
      } else {
        throw new Error('No transcription received');
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast.error(error.message || 'Failed to transcribe audio');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (!text || isSpeaking) return;

    console.log('Interview TTS - Speaking with strong bass male voice:', text.substring(0, 50));
    setIsSpeaking(true);
    
    try {
      // Call TTS Edge Function with male bass voice
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          input: text,
          voice: 'onyx', // Deep male voice with bass
          response_format: 'mp3'
        }
      });

      if (error) {
        console.error('TTS API error:', error);
        // Fallback to device TTS with lower pitch for bass effect
        await deviceTTS.speak(text, {
          lang: 'en-US',
          rate: 0.9, // Slightly slower for confident speaking
          pitch: 0.7, // Lower pitch for bass male voice
          volume: 1.0
        });
      } else if (data) {
        // Play the audio from TTS API
        const audioBlob = new Blob([data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          toast.error('Audio playback failed');
        };
        
        await audio.play();
        toast.success('🔊 Speaking with strong bass male voice');
      }
      
      console.log('Interview TTS - Voice playback completed');
    } catch (error: any) {
      console.error('Interview TTS error:', error);
      // Fallback to device TTS
      try {
        await deviceTTS.speak(text, {
          lang: 'en-US',
          rate: 0.9,
          pitch: 0.7, // Bass male voice
          volume: 1.0
        });
      } catch (fallbackError) {
        console.error('Fallback TTS error:', fallbackError);
        toast.error('Failed to generate speech');
      }
      setIsSpeaking(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!input.trim() || isLoading) return;

    const answerMessage: Message = {
      id: Date.now().toString(),
      role: 'candidate',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, answerMessage]);
    setInput('');

    // Ask next question after a short delay
    setTimeout(() => {
      askNextQuestion();
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-[#F2F2F7] to-[#E5E5EA] dark:from-[#000000] dark:to-[#1C1C1E]">
        <BackToHome />
        <div className="ios-blur border-b border-border/50 ios-shadow z-10 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agu2w514dwxs.jpg)]">
          <div className="content-column py-5 flex items-center justify-between bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agu34wq2evb4.jpg)] rounded-[20px] border-[5px] border-solid border-[rgb(218,231,231)]">
            <div>
              <h1 className="text-2xl font-bold text-[#ffffff]">Interview Lab</h1>
              <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-wider">Practice Session with Qazyen AI</p>
            </div>
            {interviewStarted && (
              <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                Question {currentQuestionIndex} / {interviewQuestions.length}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {!interviewStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500 overflow-y-auto bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alrxbz6yypkw.jpg)]">
              <div className="w-full max-w-lg h-[400px] mb-8">
                <TitanRobotAdvanced isListening={false} emotion="neutral" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-[#ffffff]">Master Your Interview</h2>
              <p className="text-lg max-w-md mb-10 font-medium text-[#f8f5f5]">
                Our advanced 3D AI recruiter "Qazyen AI" will guide you through a realistic interview simulation.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
                {[
                  { icon: Bot, title: '3D Simulation', desc: 'Real-time humanoid interaction' },
                  { icon: Volume2, title: 'Voice Analysis', desc: 'Audio-based interview responses' },
                  { icon: Trophy, title: 'Expert Feedback', desc: 'Detailed performance review' },
                  { icon: Zap, title: 'Instant Prep', desc: 'Practice anytime, anywhere' },
                ].map((item, i) => (
                  <div key={i} className="ios-card flex items-start gap-4 text-left p-5 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agu4bfu1sqv4.jpg)]">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={startInterview}
                size="lg"
                className="ios-button h-14 px-12 text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 text-[#eee3e3] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agu3sl3f1vcw.jpg)]"
              >{"Launch Session"}</Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-amjzihibma68.jpg)]">
              {/* Chat View */}
              <div className="flex-1 flex flex-col border-r border-border/50">
                <ScrollArea className="flex-1 p-6 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-amjwxyy5ijgg.jpg)]">
                  <div className="content-column space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'interviewer' && (
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">Q</div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-5 py-3 ios-shadow transition-smooth ${
                            message.role === 'candidate'
                              ? 'bg-primary text-primary-foreground'
                              : 'ios-card'
                          }`}
                        >
                          <p className="text-[15px] leading-relaxed font-medium">{message.content}</p>
                          <p className="text-[10px] opacity-60 mt-2 font-bold uppercase tracking-widest">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {message.role === 'candidate' && (
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold text-xs shadow-sm flex-shrink-0">You</div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-4 justify-start">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-md">Q</div>
                        <div className="ios-card rounded-2xl px-5 py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                {/* Response Input */}
                <div className="p-6 ios-blur ios-shadow rounded-[220px] border-solid border-[rgb(51,51,51)] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-als026yctwxs.jpg)] border-[5px] border-[rgb(51,51,51)]">
                  <div className="content-column rounded-[220px] border-[5px] border-solid border-[rgb(51,51,51)] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-amjytxkh6ku8.jpg)]">
                    <div className="flex gap-3 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-amjz4geesl4w.jpg)] rounded-[20px]">
                      <Button
                        variant={isRecording ? 'destructive' : 'secondary'}
                        size="icon"
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isLoading || currentQuestionIndex > interviewQuestions.length}
                        className="h-12 w-12 rounded-full flex-shrink-0 transition-transform active:scale-90 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agu65nbdv11c.jpg)]"
                      >
                        {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Your response..."
                        disabled={isLoading || isRecording || currentQuestionIndex > interviewQuestions.length}
                        className="flex-1 ios-input h-12 min-h-[48px] max-h-[120px] resize-none py-3 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agu5tt4pj6dc.jpg)]"
                        rows={1}
                      />
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={isLoading || !input.trim() || isRecording || currentQuestionIndex > interviewQuestions.length}
                        size="icon"
                        className="h-12 w-12 rounded-full flex-shrink-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-transform active:scale-90"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Visual Area */}
              <div className="hidden lg:flex w-[480px] flex-col bg-secondary/30">
                <div className="flex-1 relative">
                  <TitanRobotAdvanced isListening={isLoading} emotion={isSpeaking ? 'speaking' : isLoading ? 'thinking' : 'neutral'} />
                </div>
                <div className="p-8 text-center ios-blur-dark border-t border-border/50 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agu84offuhog.jpg)]">
                  <h3 className="text-2xl font-bold mb-1">Interviewer Qazyen AI</h3>
                  <p className="text-sm text-muted-foreground mb-6 font-medium tracking-tight">AI Talent Specialist</p>
                  
                  <div className="rounded-2xl p-4 flex flex-col gap-3 bg-[#070808] bg-none">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-primary">
                      <span>Interview Progress</span>
                      <span>{Math.round((currentQuestionIndex / interviewQuestions.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-primary/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${(currentQuestionIndex / interviewQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
