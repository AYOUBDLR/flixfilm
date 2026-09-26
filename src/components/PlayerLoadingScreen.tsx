import React from 'react';

interface PlayerLoadingScreenProps {
  text?: string;
  className?: string;
}

export const PlayerLoadingScreen: React.FC<PlayerLoadingScreenProps> = ({
  text = 'Player is loading...',
  className = 'w-full h-full bg-black flex flex-col items-center justify-center select-none',
}) => {
  return (
    <div className={className} id="player-loading-screen">
      {/* Equalizer Wave / Audio Bars matching uploaded screenshot */}
      <div className="flex items-center justify-center gap-[2.5px] h-[52px]">
        {/* Bar 1 - Tallest */}
        <div className="w-[9px] h-[44px] bg-[#bfbfbf] animate-player-bar-1" />
        {/* Bar 2 - Medium */}
        <div className="w-[9px] h-[32px] bg-[#bfbfbf] animate-player-bar-2" />
        {/* Bar 3 - Short */}
        <div className="w-[9px] h-[20px] bg-[#bfbfbf] animate-player-bar-3" />
        {/* Bar 4 - Short */}
        <div className="w-[9px] h-[20px] bg-[#bfbfbf] animate-player-bar-4" />
        {/* Bar 5 - Short */}
        <div className="w-[9px] h-[20px] bg-[#bfbfbf] animate-player-bar-5" />
      </div>

      {/* Loading Serif Text matching uploaded screenshot */}
      <p className="mt-4 text-[#d1d5db] font-player-serif text-[15px] sm:text-[16px] tracking-normal font-normal">
        {text}
      </p>
    </div>
  );
};
