import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, MapPin, Search, Music, Video, UserCircle, Send, Plus, Info, Globe, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'me' | 'ai';
  text: string;
  time: string;
  isError?: boolean;
}

export function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>('ai-jack');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [modelType, setModelType] = useState('gemini-3.8-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bots = [
    { id: 'ai-jack', name: 'Jack (Assistant)', handle: 'jack_ai', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=jack', lastMessage: 'How can I help you?', time: 'Now', unread: false, role: 'gemini-3.8-flash' },
    { id: 'ai-pro', name: 'Gemini Pro (Advanced)', handle: 'gemini_pro', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pro', lastMessage: 'Ready for complex tasks.', time: 'Now', unread: false, role: 'gemini-3.1-pro-preview' },
    { id: 'ai-lite', name: 'Gemini Lite (Fast)', handle: 'gemini_lite', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lite', lastMessage: 'Speed is my middle name.', time: 'Now', unread: false, role: 'gemini-3.1-flash-lite' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const selected = bots.find(b => b.id === activeChat);
    if (selected) setModelType(selected.role);
    setMessages([{ id: 'welcome', sender: 'ai', text: `Hi! I'm ${selected?.name}. How can I assist you today?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInteractionId(null);
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          previous_interaction_id: interactionId,
          useSearch,
          useMaps,
          modelType
        })
      });
      const data = await res.json();
      
      if (data.interaction_id) setInteractionId(data.interaction_id);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response || "I couldn't process that.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'ai', text: 'Error connecting to AI server.', time: '', isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderInbox = () => (
    <div className={`w-full md:w-[380px] flex-col border-r border-[#262626] ${activeChat ? 'hidden md:flex' : 'flex'} h-full bg-black`}>
      <header className="p-6 flex justify-between items-center shrink-0">
        <h2 className="text-[1.2rem] font-bold text-white">AI Assistants</h2>
        <Sparkles size={20} className="text-cyan-400" />
      </header>
      
      <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {bots.map(bot => (
          <div 
            key={bot.id}
            className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors ${activeChat === bot.id ? 'bg-[#121212]' : 'hover:bg-[#080808]'}`}
            onClick={() => setActiveChat(bot.id)}
          >
            <img src={bot.avatar} alt={bot.name} className="w-14 h-14 rounded-full object-cover bg-[#1A1A1A] shrink-0 border border-white/10" />
            <div className="flex-1 min-w-0">
              <div className="text-[0.9rem] truncate font-bold text-white">{bot.name}</div>
              <div className="text-[0.8rem] truncate text-[#A8A8A8] mt-0.5">{bot.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderThread = () => {
    if (!activeChat) return <div className="hidden md:flex flex-1 bg-black"></div>;
    const bot = bots.find(b => b.id === activeChat)!;

    return (
      <div className={`flex-1 flex flex-col h-full bg-black ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Thread Header */}
        <header className="h-[75px] shrink-0 border-b border-[#262626] flex items-center justify-between px-6 bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white mr-2" onClick={() => setActiveChat(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <img src={bot.avatar} alt={bot.name} className="w-10 h-10 rounded-full bg-[#1A1A1A]" />
            <div>
              <div className="text-[1rem] font-bold text-white">{bot.name}</div>
              <div className="text-[0.75rem] text-[#A8A8A8] flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setUseSearch(!useSearch)}
              className={`p-2 rounded-full transition-colors ${useSearch ? 'bg-cyan-500/20 text-cyan-400' : 'bg-transparent text-[#A8A8A8] hover:bg-white/5'}`}
              title="Google Search Grounding"
            >
              <Globe size={18} />
            </button>
            <button 
              onClick={() => setUseMaps(!useMaps)}
              className={`p-2 rounded-full transition-colors ${useMaps ? 'bg-emerald-500/20 text-emerald-400' : 'bg-transparent text-[#A8A8A8] hover:bg-white/5'}`}
              title="Google Maps Grounding"
            >
              <MapPin size={18} />
            </button>
          </div>
        </header>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'me' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-[#262626]">
                {msg.sender === 'me' ? (
                  <UserCircle size={32} className="text-[#A8A8A8]" />
                ) : (
                  <img src={bot.avatar} className="w-full h-full object-cover" />
                )}
              </div>
              <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-[0.95rem] ${
                  msg.sender === 'me' 
                    ? 'bg-[#3797F0] text-white rounded-br-sm' 
                    : msg.isError ? 'bg-red-500/20 text-red-200 border border-red-500/50 rounded-bl-sm' : 'bg-[#262626] text-white rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
                {msg.time && <div className="text-[0.7rem] text-[#737373] mt-1">{msg.time}</div>}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center shrink-0">
                <Loader2 size={16} className="text-[#A8A8A8] animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#262626] rounded-bl-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A8A8A8] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#A8A8A8] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#A8A8A8] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#262626] bg-black">
          <div className="flex items-center gap-3 bg-[#262626] rounded-full px-4 py-2 border border-transparent focus-within:border-[#3797F0] transition-colors">
            <input 
              type="text" 
              placeholder={`Message ${bot.name}...`}
              className="flex-1 bg-transparent border-none outline-none text-[0.95rem] text-white placeholder-[#737373] py-1.5"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            />
            {inputText.trim() && (
              <button onClick={handleSendMessage} className="text-[#3797F0] font-semibold text-[0.95rem] hover:text-white transition-colors cursor-pointer">
                Send
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex bg-black overflow-hidden font-sans">
      {renderInbox()}
      {renderThread()}
    </div>
  );
}
