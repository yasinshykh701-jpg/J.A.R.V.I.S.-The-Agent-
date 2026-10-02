import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Paperclip, 
  Send, 
  Sparkles, 
  ChevronDown,
  MessageSquare,
  FileUp,
  Settings as SettingsIcon,
  Check,
  ChevronRight
} from 'lucide-react';
import { aiApi } from '@/db/api';
import type { Message } from '@/types/ai';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';

export default function HomePage() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I assist you today?',
      role: 'model',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4 Model');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Convert messages to ChatContent format
      const chatHistory = messages.map(m => ({
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
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        responseText += decoder.decode(value, { stream: true });
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText || 'Response received',
        role: 'model',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
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

  const handleClearChat = () => {
    setMessages([{
      id: '1',
      content: 'Hello! How can I assist you today?',
      role: 'model',
      timestamp: new Date()
    }]);
    toast.success('Chat cleared');
  };

  const handleExportChat = () => {
    const chatText = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-export.txt';
    a.click();
    toast.success('Chat exported');
  };

  return (
    <AppLayout>
      <div className="h-full flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[#0a0f1a]">
          {/* Toolbar */}
          <div className="border-b border-gray-200 px-6 py-4 bg-[#0a0f1a]">
            <div className="flex items-center justify-between">
              {/* Model Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 rounded-lg border-gray-300">
                    <div className="w-6 h-6 gradient-blue rounded-md flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{selectedModel}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => setSelectedModel('GPT-4 Model')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    GPT-4 Model
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedModel('GPT-3.5 Turbo')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    GPT-3.5 Turbo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedModel('Claude 3')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Claude 3
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearChat}
                  className="gap-2 rounded-lg border-gray-300"
                >
                  <MessageSquare className="w-4 h-4" />
                  Clear Chat
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportChat}
                  className="gap-2 rounded-lg border-gray-300"
                >
                  <FileUp className="w-4 h-4" />
                  Export Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className={message.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    }>
                      {message.role === 'user' 
                        ? (profile?.username?.[0]?.toUpperCase() || 'U')
                        : 'AI'
                      }
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Bubble */}
                  <div className={`flex-1 max-w-2xl ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                    <div className={`rounded-2xl px-5 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#0a0f1a] text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 max-w-2xl">
                    <div className="rounded-2xl px-5 py-3 bg-[#0a0f1a]">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-6 py-4 bg-[#0a0f1a]">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 rounded-full hover:bg-[#0a0f1a]"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full rounded-xl border-gray-300 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 gradient-blue text-white rounded-xl px-6 py-3 hover:opacity-90 transition-opacity"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Assistant Panel */}
        <aside className="w-80 border-l border-gray-200 bg-[#0a0f1a] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#0a0f1a]">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          <Card className="p-5 border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Tips for Better Prompts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <p className="text-sm text-gray-700">Be specific with your request.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <p className="text-sm text-gray-700">Use context or examples.</p>
              </div>
            </div>
          </Card>

          <Button 
            variant="ghost" 
            className="w-full justify-between mt-6 text-gray-600 hover:text-gray-900"
          >
            Need Help?
            <ChevronRight className="w-4 h-4" />
          </Button>
        </aside>
      </div>
    </AppLayout>
  );
}
