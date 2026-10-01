import React, { useState, useEffect } from 'react';
import weddingAudio from '../utils/weddingAudio';

export default function WeddingCornerMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Sync with global wedding audio engine state
    setIsPlaying(weddingAudio.isPlaying());
    const unsubscribe = weddingAudio.subscribe((playingState) => {
      setIsPlaying(playingState);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    weddingAudio.toggle();
  };

  return (
    <div
      className={`floating-wedding-music-widget fixed bottom-6 left-6 z-[9999] flex items-center gap-3 py-2 px-3.5 sm:px-4 rounded-full backdrop-blur-xl shadow-2xl cursor-pointer select-none transition-all duration-300 hover:-translate-y-1 ${isPlaying ? 'is-playing' : 'is-paused'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      title={isPlaying ? 'Pause Wedding Music' : 'Play Wedding Music'}
      aria-label={isPlaying ? 'Pause Rajasthani Folk Music' : 'Play Rajasthani Folk Music'}
    >
      {/* Golden Aura Glow */}
      <div className="music-widget-glow pointer-events-none" aria-hidden="true"></div>

      {/* Rotating Vinyl / Royal Seal Disc */}
      <div className={`music-disc-emblem w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${isPlaying ? 'disc-spinning' : ''}`}>
        <span className="disc-icon text-lg">🪗</span>
      </div>

      {/* Live Equalizer Dancing Sound Waves */}
      <div className="music-equalizer-bars flex items-end gap-1 h-4.5 px-0.5" aria-hidden="true">
        <span className={`eq-bar eq-1 ${isPlaying ? 'active' : ''}`}></span>
        <span className={`eq-bar eq-2 ${isPlaying ? 'active' : ''}`}></span>
        <span className={`eq-bar eq-3 ${isPlaying ? 'active' : ''}`}></span>
        <span className={`eq-bar eq-4 ${isPlaying ? 'active' : ''}`}></span>
      </div>

      {/* Play / Pause Toggle Button */}
      <div className="music-toggle-btn w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors duration-200">
        {isPlaying ? (
          <span className="player-icon pause-icon text-[11px]" aria-label="Pause">❚❚</span>
        ) : (
          <span className="player-icon play-icon text-[11px] ml-0.5" aria-label="Play">▶</span>
        )}
      </div>

      {/* Floating Info Tooltip / Expandable Pill */}
      <div className={`music-widget-tooltip absolute bottom-[calc(100%+12px)] left-0 rounded-xl px-3.5 py-2 whitespace-nowrap shadow-xl backdrop-blur-xl pointer-events-none transition-all duration-200 ${isHovered ? 'tooltip-visible' : ''}`}>
        <div className="tooltip-inner flex flex-col gap-0.5">
          <span className="tooltip-title text-xs font-serif font-bold text-[#e5be7a]">
            {isPlaying ? '🎵 राजस्थानी लोकगीत: "उमराव"' : '🔇 संगीत रुका हुआ है'}
          </span>
          <span className="tooltip-action text-[11px] font-serif text-[#faf6ed]/80">
            {isPlaying ? 'रोकने के लिए क्लिक करें ⏸' : 'बजाने के लिए क्लिक करें ▶'}
          </span>
        </div>
      </div>
    </div>
  );
}
