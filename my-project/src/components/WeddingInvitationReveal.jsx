import React from 'react';

export default function WeddingInvitationReveal({ progress = 0, onExploreGallery }) {
  // Reveal starts around progress 0.50 and reaches full grandeur by 0.85 - 1.0
  const revealProgress = Math.max(0, Math.min(1, (progress - 0.50) / 0.40));
  const isVisible = revealProgress > 0.01;

  if (!isVisible) {
    return null;
  }

  // Butter-smooth entrance interpolation with ambient soft radial vignette
  const containerStyle = {
    opacity: revealProgress,
    transform: `translateY(${(1 - revealProgress) * 35}px) scale(${0.86 + revealProgress * 0.14})`,
    filter: `blur(${(1 - revealProgress) * 2}px)`,
    transition: 'opacity 0.5s ease-out, transform 1.2s ease-out, filter 1.2s ease-out',
    // Soft radial ambient shadow directly behind text to maximize contrast on rustic wall
    // background: 'radial-gradient(ellipse 85% 75% at center, rgba(16, 10, 6, 0.76) 0%, rgba(16, 10, 6, 0.48) 55%, rgba(16, 10, 6, 0) 80%)',
  };

  return (
    <div
      className="wedding-reveal-container flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-6 py-6 sm:py-8 relative z-20 pointer-events-none select-none"
      style={containerStyle}
      aria-live="polite"
    >
      {/* Sacred Traditional Top Invocation with High-Contrast Golden Shadow */}
      <div className="wedding-ornament-top flex items-center justify-center gap-3 mb-1.5 w-full" aria-hidden="true">
        <span
          className="h-px flex-1 max-w-24 sm:max-w-32 bg-gradient-to-r from-transparent via-[#e5be7a] to-transparent opacity-80"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9))' }}
        ></span>
        <span
          className="text-[#f5d58d] font-serif text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] uppercase"
          style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 12px rgba(0, 0, 0, 0.9), 0 0 16px rgba(212, 163, 89, 0.5)',
          }}
        >
          || श्री गणेशाय नमः ||
        </span>
        <span
          className="h-px flex-1 max-w-24 sm:max-w-32 bg-gradient-to-r from-transparent via-[#e5be7a] to-transparent opacity-80"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9))' }}
        ></span>
      </div>

      {/* Royal Subheading */}
      <p
        className="font-serif tracking-[0.35em] text-xs sm:text-sm font-semibold text-[#e5be7a] uppercase mb-1"
        style={{
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)',
        }}
      >
        शुभ विवाह
      </p>

      {/* Grand 3D Royal Gold Couple Name: HARISH & LAVINA */}
      <div className="wedding-couple-name-box relative my-1 sm:my-2">
        <h1 className="wedding-couple-name flex flex-col items-center justify-center leading-none tracking-tight">
          {/* Top Line: HARISH & */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <span
              className="font-serif font-extrabold uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider"
              style={{
                fontFamily: "'Cinzel', serif",
                background: 'linear-gradient(180deg, #ffffff 0%, #fff1ba 22%, #ffd066 45%, #d4952b 75%, #885514 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 1px rgba(0, 0, 0, 1)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 28px rgba(212, 163, 89, 0.45))',
              }}
            >
              HARISH
            </span>

            <span
              className="font-serif italic font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl -translate-y-1"
              style={{
                fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
                background: 'linear-gradient(180deg, #fff7d6 0%, #ffd066 50%, #c48c2b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 1px rgba(0, 0, 0, 1)) drop-shadow(0 5px 12px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 22px rgba(212, 163, 89, 0.5))',
              }}
            >
              &amp;
            </span>
          </div>

          {/* Bottom Line: LAVINA */}
          <span
            className="font-serif font-extrabold uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider mt-1 sm:mt-2"
            style={{
              fontFamily: "'Cinzel', serif",
              background: 'linear-gradient(180deg, #ffffff 0%, #fff1ba 22%, #ffd066 45%, #d4952b 75%, #885514 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 1px rgba(0, 0, 0, 1)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 28px rgba(212, 163, 89, 0.45))',
            }}
          >
            LAVINA
          </span>
        </h1>
      </div>

      {/* Sacred Traditional Shlok / Tagline with High Visibility Drop Shadow */}
      <p
        className="font-serif text-xs sm:text-sm md:text-base text-[#fff5e4] max-w-xl mx-auto my-2.5 sm:my-3.5 leading-relaxed tracking-wide"
        style={{
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.98), 0 1px 2px #000000, 0 0 12px rgba(0, 0, 0, 0.9)',
          fontWeight: 500,
        }}
      >
        “नागरिक समर्पे च जीवनं हार्दिक स्वागतं एवं स्नेहेन अभिनन्दनम्”
      </p>

      {/* Luxury Date & Venue Pill Cards (High Contrast, Deep Shadow, Gold Border) */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-2.5">
        {/* Card 1: Date */}
        <div
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-transform duration-300 hover:scale-105"
          style={{
            background: 'rgba(22, 14, 9, 0.88)',
            border: '1.5px solid rgba(212, 163, 89, 0.48)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 230, 180, 0.22)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span className="text-base sm:text-lg" role="img" aria-label="calendar">🗓️</span>
          <div className="flex flex-col text-left">
            <span
              className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#e5be7a] uppercase leading-none mb-1"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
            >
              शुक्रवार
            </span>
            <span
              className="text-xs sm:text-sm md:text-base font-serif font-bold text-[#ffffff] tracking-wider leading-none"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
            >
              12 दिसम्बर 2026
            </span>
          </div>
        </div>

        {/* Card 2: Venue */}
        <div
          className="flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-transform duration-300 hover:scale-105"
          style={{
            background: 'rgba(22, 14, 9, 0.88)',
            border: '1.5px solid rgba(212, 163, 89, 0.48)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 230, 180, 0.22)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span className="text-base sm:text-lg text-[#e5be7a]" role="img" aria-label="location">📍</span>
          <span
            className="text-xs sm:text-sm md:text-base font-serif font-bold text-[#ffffff] tracking-wide"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
          >
            जगमंदिर पैलेस, उदयपुर
          </span>
        </div>
      </div>

      {/* Luxury Action Buttons */}
      <div className="wedding-actions-row flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3 w-full">
        {onExploreGallery && (
          <button
            type="button"
            className="pointer-events-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 rounded-full font-serif text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer text-[#140e0a]"
            style={{
              background: 'linear-gradient(135deg, #fce09a 0%, #d4a359 50%, #ba6238 100%)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 24px rgba(212, 163, 89, 0.45)',
            }}
            onClick={onExploreGallery}
            title="Auspicious Muhurat & Ceremonies"
          >
            <span>शुभ मुहूर्त देखें</span>
            <span className="text-sm font-bold">›</span>
          </button>
        )}

        <button
          type="button"
          className="pointer-events-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-serif text-xs sm:text-sm font-medium text-[#faf6ed] transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{
            background: 'rgba(22, 14, 9, 0.88)',
            border: '1.5px solid rgba(212, 163, 89, 0.48)',
            boxShadow: '0 8px 22px rgba(0, 0, 0, 0.7)',
          }}
          onClick={() => alert("शुभकामनाएं एवं आशीर्वाद के लिए आपका हार्दिक धन्यवाद! — हरिष एवं लविना")}
        >
          <span>आयोजित हैं</span>
          <span className="text-xs">🌸</span>
        </button>
      </div>
    </div>
  );
}

