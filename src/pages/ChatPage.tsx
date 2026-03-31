import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import { Send, Paperclip, Mic, Image as ImageIcon, Sparkles, Lightbulb, Code, FileText } from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import { voiceFeedback } from '@/services/voiceFeedback';
import BackToHome from '@/components/BackToHome';

export default function ChatPage() {
  const { messages, currentThread, sendMessage, createNewThread } = useChatHistory();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      await sendMessage(messageText);
      voiceFeedback.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      voiceFeedback.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionChips = [
    { icon: Sparkles, text: 'Explain quantum computing', color: 'text-primary' },
    { icon: Lightbulb, text: 'Creative writing ideas', color: 'text-success' },
    { icon: Code, text: 'Debug my code', color: 'text-secondary' },
    { icon: FileText, text: 'Summarize this document', color: 'text-accent' },
  ];

  const hasMessages = messages.length > 0;

  return (
    <AppLayout>
      <BackToHome />
      <div className="flex flex-col h-full bg-background">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-ahmi7b70f18g.jpg)]">
          {!hasMessages ? (
            /* Empty State - Google Studio Style */
            (<div className="flex flex-col items-center justify-center h-full px-4 py-12 border-solid rounded-[20px] border-[5px] border-[rgb(218,231,231)] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-akweuykerksg.png)]">
              <div className="max-w-3xl w-full space-y-8">
                {/* Logo with Google Colors */}
                <div className="text-center">
                  <h1 className="text-5xl font-normal tracking-tight mb-2">

                  </h1>
                  <p className="text-muted-foreground text-sm">
                    How can I help you today?
                  </p>
                </div>

                {/* Suggestion Chips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestionChips.map((chip, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(chip.text);
                      }}
                      className="group flex items-start gap-4 p-4 hover:bg-muted/50 rounded-2xl border border-border hover:border-primary/30 transition-all text-left google-shadow hover:google-shadow-lg bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-adxfzm6fu5ts.jpg)]"
                    >
                      <div className={`p-2 rounded-lg bg-muted ${chip.color}`}>
                        <chip.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {chip.text}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>)
          ) : (
            /* Messages View */
            (<div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 animate-fade-in ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-success to-accent flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground google-shadow'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-foreground text-sm font-medium">U</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-success to-accent flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>)
          )}
        </div>

        {/* Bottom Input Bar - Google Studio Style */}
        <div className="p-4 border-solid rounded-[20px] border-[rgb(250,250,250)] border-[5px] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-aguzx8zo4d8g.jpg)] border-[rgb(250,250,250)]">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-card rounded-3xl border border-border shadow-lg focus-within:shadow-xl focus-within:border-primary/50 transition-all">
              <div className="flex items-end gap-2 p-3 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-adxdvrfny800.jpg)] rounded-[20px]">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted"
                  >
                    <Paperclip className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted"
                  >
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Qazyen anything..."
                  className="flex-1 min-h-[40px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-adxchrzh8j5s.jpg)]"
                  rows={1}
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted"
                  >
                    <Mic className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 text-primary-foreground" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Qazyen AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
