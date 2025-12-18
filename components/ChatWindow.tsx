import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Trash2, Anchor } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message, ActionButton, WebhookResponse } from '../types';
import { getOrCreateSessionId } from '../utils/session';
import { sendMessageToWebhook } from '../services/chatService';

interface ChatWindowProps {
  onClose: () => void;
}

// Configuration for Venti Charter
const CONFIG = {
  webhookUrl: 'https://n8n.srv1205715.hstgr.cloud/webhook/71b98936-8fd1-4bf7-9e9d-16dc5fca4f15',
  welcomeText: "Welcome to Venti Charter! I'm your virtual concierge. How can I assist you with your yachting experience today?",
  welcomeButtons: [
    { label: "Book a Charter", value: "Book a Charter", type: 'action' }
  ] as ActionButton[],
  placeholder: "Type your message...",
  poweredBy: "Powered by Venti Charter",
  connectionError: "We are having trouble connecting to the concierge service. Please try again shortly."
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const sessionId = useRef(getOrCreateSessionId()).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            text: CONFIG.welcomeText,
            sender: 'bot',
            timestamp: new Date(),
            buttons: CONFIG.welcomeButtons
          }
        ]);
      }, 500);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Focus input on load
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Optimistically add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToWebhook(text, sessionId, CONFIG.webhookUrl);
      processResponse(response);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now().toString() + '-err',
        text: CONFIG.connectionError,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const processResponse = (data: WebhookResponse) => {
    let botText = data.output || data.text || data.message || "I didn't understand that.";
    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];
      botText = first.output || first.text || first.message || JSON.stringify(first);
    } else if (typeof data === 'string') {
        botText = data;
    }

    // Only use buttons if explicitly provided by the webhook
    let botButtons: ActionButton[] = data.buttons || [];

    const botMsg: Message = {
      id: Date.now().toString(),
      text: botText,
      sender: 'bot',
      timestamp: new Date(),
      buttons: botButtons,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const handleClear = () => {
    setMessages([]);
    // useEffect will re-trigger to add welcome message
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] text-[#1E293B] font-inter relative rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Header - Navy & Gold Theme */}
      <div className="flex items-center justify-between px-6 py-5 bg-[#0B2545] border-b border-[#C5A572]/30 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-[#C5A572]/50 backdrop-blur-sm">
              <Anchor size={20} className="text-[#C5A572]" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#0B2545]"></div>
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-wide">Venti Charter</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-[11px] text-[#C5A572] font-medium uppercase tracking-wider">Concierge</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
           <button 
             onClick={handleClear} 
             className="p-2 text-white/70 hover:text-[#C5A572] hover:bg-white/10 rounded-full transition-colors"
             title="Restart Chat"
           >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin bg-[#F8FAFC]">
        <div className="flex flex-col space-y-6">
           
           {messages.map((msg) => (
             <ChatMessage 
                key={msg.id} 
                message={msg} 
                onActionClick={(val) => handleSend(val)}
             />
           ))}

           {isLoading && (
             <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-end gap-2">
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-1 border border-[#E2E8F0] shadow-sm text-[#0B2545]">
                    <Anchor size={14} />
                 </div>
                 <TypingIndicator />
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#E2E8F0]">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative flex items-end gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={CONFIG.placeholder}
            className="w-full bg-[#F1F5F9] text-[#0B2545] placeholder-[#64748B] border border-transparent focus:bg-white focus:border-[#C5A572]/50 rounded-xl py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#C5A572]/20 transition-all text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className={`
                absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200
                ${input.trim() && !isLoading
                    ? 'bg-[#0B2545] hover:bg-[#1E3A8A] text-[#C5A572] shadow-md' 
                    : 'bg-transparent text-[#94A3B8] cursor-not-allowed'
                }
            `}
          >
            <Send size={18} />
          </button>
        </form>
        <div className="flex justify-center mt-3">
            <span className="text-[10px] text-[#94A3B8] font-medium tracking-wide">
                {CONFIG.poweredBy}
            </span>
        </div>
      </div>
    </div>
  );
};