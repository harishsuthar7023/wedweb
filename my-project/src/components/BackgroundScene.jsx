import React, { useEffect, useRef, useState } from 'react';

export default function BackgroundScene() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: e.clientX / innerWidth,
        y: e.clientY / innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = '/hero-bg.jpg';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      // Fallback if not copied yet
      console.log('Background using fallback styling');
    };
  }, []);

  // Subtle parallax transform
  const parallaxX = (mousePos.x - 0.5) * 16;
  const parallaxY = (mousePos.y - 0.5) * 12;

  return (
    <div className="background-scene-container" ref={containerRef} aria-hidden="true">
      {/* Base Cosmic Dark Gradient */}
      <div className="base-cosmic-bg"></div>

      {/* Hero Visual Image Layer */}
      <div 
        className={`hero-image-layer ${imageLoaded ? 'loaded' : ''}`}
        style={{
          transform: `scale(1.05) translate(${parallaxX * -0.5}px, ${parallaxY * -0.5}px)`
        }}
      >
        <img 
          src="/hero-bg.jpg" 
          alt="" 
          className="hero-art-img"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=85";
          }}
        />
      </div>

      {/* Atmospheric Starfield Particles */}
      <div className="stars-layer">
        <span className="star-point s1"></span>
        <span className="star-point s2"></span>
        <span className="star-point s3"></span>
        <span className="star-point s4"></span>
        <span className="star-point s5"></span>
        <span className="star-point s6"></span>
        <span className="star-point s7"></span>
        <span className="star-point s8"></span>
        <span className="star-point s9"></span>
        <span className="star-point s10"></span>
      </div>

      {/* Bioluminescent floating spore particles */}
      <div className="spores-layer">
        <span className="spore-dot sp1"></span>
        <span className="spore-dot sp2"></span>
        <span className="spore-dot sp3"></span>
        <span className="spore-dot sp4"></span>
        <span className="spore-dot sp5"></span>
        <span className="spore-dot sp6"></span>
      </div>

      {/* Ambient Gradient Overlays for perfect editorial contrast */}
      <div className="atmospheric-top-vignette"></div>
      <div className="atmospheric-center-glow" style={{
        left: `${mousePos.x * 100}%`,
        top: `${mousePos.y * 100}%`,
      }}></div>
      <div className="atmospheric-bottom-blend"></div>
    </div>
  );
}
