import React, { useState, useRef } from 'react';
import ScrollCanvasSequence from './components/ScrollCanvasSequence';
import WeddingInvitationReveal from './components/WeddingInvitationReveal';
import WeddingCountdownSection from './components/WeddingCountdownSection';
import WeddingDateScratchCard from './components/WeddingDateScratchCard';
import WeddingEventsCoverflow from './components/WeddingEventsCoverflow';
import WeddingGalleryMarquee from './components/WeddingGalleryMarquee';
import WeddingFooter from './components/WeddingFooter';
import WeddingInvitationScreen from './components/WeddingInvitationScreen';
import WeddingCornerMusicPlayer from './components/WeddingCornerMusicPlayer';
import './App.css';

export default function App() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleExploreGallery = () => {
    const targetElement = document.getElementById('countdown') || document.getElementById('gallery');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="wedding-page-wrapper relative w-full min-h-screen bg-[#140e0a] overflow-x-hidden text-[#faf6ed]">
      {/* INITIAL SCREEN: Royal Wedding Invitation "Please Click" with Rajasthani Song & Fade-Back Transition */}
      <WeddingInvitationScreen />

      {/* PERSISTENT FLOATING CORNER WIDGET: Royal Rajasthani Folk Music Player (Play/Pause anytime) */}
      <WeddingCornerMusicPlayer />

      {/* SECTION 1: Royal Palace Canvas Sequence & Harish & Lavina Reveal */}
      <section className="hero-scroll-container relative w-full h-screen overflow-hidden bg-[#140e0a]" ref={containerRef}>
        {/* Sticky Full-Screen HTML5 Canvas driven by scroll progress */}
        <ScrollCanvasSequence
          containerRef={containerRef}
          onProgressChange={(progress) => setScrollProgress(progress)}
          onAnimationComplete={handleExploreGallery}
        />

        {/* Pinned Hero Overlay Container */}
        <div className="hero-content-pinned absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
          {/* Initial Scroll Prompt (fades out as user scrolls) */}
          <div
            className="initial-scroll-hint absolute top-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 text-center z-20 cursor-pointer"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 3),
              pointerEvents: scrollProgress > 0.3 ? 'none' : 'auto',
              transform: `translateY(${scrollProgress * -20}px)`,
            }}
            aria-hidden={scrollProgress > 0.3}
            onClick={handleExploreGallery}
            title="Scroll or click to begin"
          >
            <div className="royal-badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-[#e5be7a] border border-[#d4a359]/30 bg-[#251a12]/80 uppercase shadow-lg backdrop-blur-sm">
              <span className="text-[#d4a359]">✦</span>
              <span className="font-serif">|| शुभ विवाह निमंत्रण ||</span>
              <span className="text-[#d4a359]">✦</span>
            </div>

            <div className="scroll-down-action flex flex-col items-center gap-1">
              <span className="scroll-mouse-icon">
                <span className="scroll-wheel-dot"></span>
              </span>
              <span className="scroll-action-label text-[11px] font-medium tracking-[0.25em] text-[#faf6ed]/70">
                SCROLL TO ENTER
              </span>
            </div>
          </div>

          {/* Wedding Invitation Reveal with Harish & Lavina */}
          <WeddingInvitationReveal
            progress={scrollProgress}
            onExploreGallery={handleExploreGallery}
          />
        </div>
      </section>

      {/* SECTION 2: Royal Wedding Muhurat Countdown Section (ezgif-frame-113.jpg palette) */}
      <WeddingCountdownSection />

      {/* SECTION 3: Royal Interactive Wedding Date Scratch Card with Celebration Shots */}
      <WeddingDateScratchCard />

      {/* SECTION 4: 3D Coverflow Wedding Events Carousel (Haldi, Mehendi, Sangeet, Baraat, Pheras, Reception) */}
      <WeddingEventsCoverflow />

      {/* SECTION 5: 3D Arc Infinite Continuous Auto-Running Wedding Gallery Loop */}
      <WeddingGalleryMarquee />

      {/* SECTION 6: Essential Royal Wedding Footer (Location, Contact & RSVP, Instagram, Travel Help) */}
      <WeddingFooter />
    </div>
  );
}
