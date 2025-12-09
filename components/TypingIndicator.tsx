import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 p-3 items-center bg-white rounded-2xl w-fit rounded-tl-none border border-[#E2E8F0] shadow-sm">
      <div className="w-1.5 h-1.5 bg-[#C5A572] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-[#C5A572] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-[#C5A572] rounded-full animate-bounce"></div>
    </div>
  );
};