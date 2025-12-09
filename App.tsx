import React, { useState } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* 
        Root Container:
        - Fixed to viewport.
        - z-index high to float above other content.
        - pointer-events-none to let clicks pass through to the website behind it.
      */}
      <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col justify-end items-end sm:p-6 p-4 font-inter">
        
        {/* 
          Chat Window Wrapper:
          - pointer-events-auto so the chat itself is clickable.
          - Transform origins and transitions for a "pop out" effect.
          - Increased height to 750px on desktop and 85vh on mobile for better view.
        */}
        <div 
          className={`
            origin-bottom-right transition-all duration-300 ease-out transform
            ${isChatOpen 
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 scale-90 translate-y-8 pointer-events-none absolute'
            }
          `}
        >
          {/* Only mount/render logic if we want to preserve state, we keep it mounted here but hidden */}
          <div className="w-[calc(100vw-32px)] h-[600px] max-h-[85vh] sm:w-[400px] sm:h-[750px] shadow-2xl shadow-[#0B2545]/20 rounded-2xl overflow-hidden ring-1 ring-[#0B2545]/10 bg-white">
             <ChatWindow onClose={() => setIsChatOpen(false)} />
          </div>
        </div>

        {/* 
          Floating Toggle Button:
          - Only visible when chat is closed.
          - pointer-events-auto to capture the click.
          - Updated to Venti Charter Navy (#0B2545).
        */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`
            pointer-events-auto mt-4 group flex items-center gap-3 px-5 py-4 
            bg-[#0B2545] hover:bg-[#1E3A8A] text-white rounded-full 
            shadow-[0_8px_30px_rgb(11,37,69,0.4)] transition-all duration-300 
            transform hover:scale-105 active:scale-95 border border-[#C5A572]/20
            ${isChatOpen ? 'opacity-0 scale-75 translate-y-10 pointer-events-none absolute' : 'opacity-100 scale-100 translate-y-0'}
          `}
          aria-label="Toggle Chat"
        >
          <div className="relative">
            <MessageSquare size={24} className="text-[#C5A572] fill-current" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A572] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A572]"></span>
            </span>
          </div>
          <span className="font-semibold text-sm tracking-wide text-white">Chat with us</span>
        </button>
      </div>
    </>
  );
};

export default App;