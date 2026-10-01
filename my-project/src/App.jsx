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
