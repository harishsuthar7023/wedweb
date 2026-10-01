import React, { useState } from 'react';
import weddingAudio from '../utils/weddingAudio';

export default function WeddingInvitationScreen({ onEnter }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const handleOpenInvitation = () => {
    if (isFading || isOpened) return;

    // 1. Immediately trigger Rajasthani Folk Wedding Music
    weddingAudio.start();

    // 2. Start smooth luxury fade-back transition
    setIsFading(true);

    // 3. Complete transition and reveal main page
    setTimeout(() => {
      setIsOpened(true);
      if (onEnter) onEnter();
    }, 1100);
  };

  if (isOpened) return null;

  return (
    <div
      className={`wedding-invitation-overlay fixed inset-0 w-screen h-screen z-[10000] flex items-center justify-center p-4 overflow-hidden select-none cursor-pointer ${isFading ? 'overlay-fade-out' : ''}`}
      onClick={handleOpenInvitation}
      role="button"
      tabIndex={0}
      aria-label="Click to open royal wedding invitation and play music"
    >
      {/* Ambient Royal Gold Glow & Palace Backdrop */}
      <div className="invitation-backdrop-aura pointer-events-none" aria-hidden="true"></div>

      {/* Floating Golden Diyas & Sparkles */}
      <div className="floating-sparkles-container pointer-events-none" aria-hidden="true">
        <span className="sparkle-particle p1">✦</span>
        <span className="sparkle-particle p2">✨</span>
        <span className="sparkle-particle p3">✦</span>
        <span className="sparkle-particle p4">✨</span>
        <span className="sparkle-particle p5">✦</span>
        <span className="sparkle-particle p6">✨</span>
      </div>

      {/* Main Luxury Royal Invitation Card / Envelope */}
      <div className={`royal-invitation-card relative z-10 w-full max-w-lg rounded-3xl p-7 sm:p-10 flex flex-col items-center text-center gap-5 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${isFading ? 'card-opening-anim' : ''}`}>
        {/* Rajasthani Jharokha Arch Border */}
        <div className="card-jharokha-frame pointer-events-none" aria-hidden="true"></div>

        {/* Sacred Sanskrit Invocation */}
        <div className="card-sacred-header inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-[0.2em] text-amber-300">
          <span className="sacred-swastik text-amber-400">卐</span>
          <span className="sacred-shloka font-serif">|| श्री गणेशाय नमः ||</span>
          <span className="sacred-swastik text-amber-400">卐</span>
        </div>

        {/* Royal Monogram Emblem */}
        <div className="royal-crest-wrapper my-0.5">
          <div className="royal-crest-circle flex items-center justify-center gap-1.5 w-16 h-16 rounded-full shadow-lg">
            <span className="crest-initial font-serif text-2xl font-bold text-amber-200">H</span>
            <span className="crest-amp font-serif italic text-amber-300/80 text-lg">&amp;</span>
            <span className="crest-initial font-serif text-2xl font-bold text-amber-200">L</span>
          </div>
        </div>

        {/* Invitation Typography */}
        <div className="card-text-group flex flex-col gap-1.5">
          <span className="invitation-kicker text-[11px] font-extrabold tracking-[0.25em] text-[#d4a359] uppercase">
            || शुभ विवाह निमंत्रण ||
          </span>
          <h1 className="invitation-couple-title font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#faf6ed] drop-shadow-xl">
            Harish &amp; Lavina
          </h1>
          <p className="invitation-destination font-serif text-sm text-[#faf6ed]/80 font-medium">
            जगमंदिर पैलेस • उदयपुर, राजस्थान
          </p>
        </div>

        {/* Center 3D Royal Wax Seal Button with Pulsing Gold Aura */}
        <div className="interactive-seal-section relative w-24 h-24 flex items-center justify-center my-1">
          <div className="wax-seal-pulse-ring pointer-events-none" aria-hidden="true"></div>
          <div className="wax-seal-pulse-ring delay-ring pointer-events-none" aria-hidden="true"></div>

          <div className="royal-wax-seal relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-105">
            <div className="wax-inner-monogram flex flex-col items-center justify-center gap-0.5">
              <span className="seal-text font-serif text-[10px] font-extrabold tracking-widest text-[#251710]">खोलें</span>
              <span className="seal-icon text-lg">💌</span>
            </div>
          </div>
        </div>

        {/* Pulsing CTA Prompt Button */}
        <div className="invitation-action-prompt flex flex-col items-center gap-3 w-full">
          <div
            className="royal-open-btn w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full font-bold text-sm tracking-wider text-[#140e0a] shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #ba6238 0%, #d4a359 50%, #e5be7a 100%)',
              boxShadow: '0 6px 25px rgba(212, 163, 89, 0.4)',
            }}
          >
            <span className="btn-sparkle text-base">✦</span>
            <span className="btn-main-label font-serif font-bold tracking-wider">निमंत्रण पत्र खोलें (OPEN)</span>
            <span className="btn-sparkle text-base">✦</span>
          </div>

          <p className="invitation-sub-prompt flex flex-col items-center gap-1 text-center m-0">
            <span className="music-notice inline-flex items-center gap-1.5 text-xs text-[#faf6ed]/75 font-serif">
              <span className="music-note-icon text-[#d4a359]">🎵</span>
              राजस्थानी लोकगीत: <strong className="text-[#e5be7a]">"उमराव"</strong> (सीमा मिश्रा)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
