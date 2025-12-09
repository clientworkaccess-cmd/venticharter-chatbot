import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, ActionButton } from '../types';
import { Anchor, ExternalLink, ArrowRight } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onActionClick: (value: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onActionClick }) => {
  const isUser = message.sender === 'user';
  
  // Luxury Yacht Theme Bubbles
  // User: Navy Blue Bubble with White Text
  // Bot: White Bubble with Dark Text & Subtle Border
  const bubbleClass = isUser
    ? 'bg-[#0B2545] text-white rounded-2xl rounded-tr-sm shadow-md'
    : 'bg-white text-[#1E293B] border border-[#E2E8F0] rounded-2xl rounded-tl-sm shadow-sm';

  return (
    <div className={`group flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar - Top aligned with the message bubble */}
        {!isUser && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center self-start mt-1.5 shadow-sm text-[#0B2545]">
              <Anchor size={14} />
            </div>
        )}
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Sender Name */}
          <span className={`text-[10px] text-[#94A3B8] mb-1 px-1 font-medium tracking-wide ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? 'You' : 'Concierge'}
          </span>

          <div className={`px-5 py-3.5 text-sm leading-relaxed overflow-hidden ${bubbleClass}`}>
            <ReactMarkdown 
              components={{
                a: ({ node, ...props }) => <a {...props} className={`underline underline-offset-2 transition-colors font-medium ${isUser ? 'text-[#C5A572] hover:text-white decoration-[#C5A572]/50' : 'text-[#0B2545] hover:text-[#C5A572] decoration-[#0B2545]/30'}`} target="_blank" rel="noopener noreferrer" />,
                p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-4 mb-2 space-y-1" />,
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-4 mb-2 space-y-1" />,
                strong: ({ node, ...props }) => <strong {...props} className={`font-semibold ${isUser ? 'text-white' : 'text-[#0B2545]'}`} />
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Action Buttons (Only for Bot) */}
          {!isUser && message.buttons && message.buttons.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 ml-1">
              {message.buttons.map((btn, idx) => (
                <ActionBtn key={idx} button={btn} onClick={onActionClick} />
              ))}
            </div>
          )}
          
          {/* Timestamp - visible on hover */}
          <span className="text-[10px] text-[#94A3B8] mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

      </div>
    </div>
  );
};

// Sub-component for buttons - Outline Style with Gold Hover
const ActionBtn: React.FC<{ button: ActionButton; onClick: (val: string) => void }> = ({ button, onClick }) => {
  if (button.type === 'link' && button.url) {
    return (
      <a 
        href={button.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#0B2545] text-[#0B2545] hover:text-[#C5A572] text-xs font-semibold rounded-lg border border-[#0B2545]/20 hover:border-[#0B2545] transition-all hover:shadow-md"
      >
        {button.label}
        <ExternalLink size={12} />
      </a>
    );
  }

  return (
    <button
      onClick={() => onClick(button.value || button.label)}
      className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#0B2545] text-[#0B2545] hover:text-[#C5A572] border border-[#0B2545]/20 hover:border-[#0B2545] text-xs font-semibold rounded-lg transition-all hover:shadow-md active:scale-95"
    >
      {button.label}
      <ArrowRight size={12} className="opacity-70" />
    </button>
  );
};