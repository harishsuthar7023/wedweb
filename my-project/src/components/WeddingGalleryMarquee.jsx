import React, { useState, useRef, useEffect, useCallback } from 'react';

const WEDDING_MOMENTS = [
  {
    id: 1,
    image: '/wedding/haldi.jpg',
    title: 'Phoolon Ki Haldi',
    event: 'Joyous Auspiciousness',
    caption: 'Laughter, yellow turmeric, and fresh marigold petal shower in royal Udaipur courtyard',
  },
  {
    id: 2,
    image: '/wedding/mehendi.jpg',
    title: 'Henna & Mehendi',
    event: 'Traditional Elegance',
    caption: 'Intricate bridal henna reflecting eternal love under colorful starlit canopies',
  },
  {
    id: 3,
    image: '/wedding/wedding-3.jpg',
    title: 'Sangeet Celebration',
    event: 'Music & Dance',
    caption: 'Joyous family choreography and non-stop dancing under crystalline palace chandeliers',
  },
  {
    id: 4,
    image: '/wedding/baraat.jpg',
    title: 'The Royal Baraat',
    event: 'Festive Procession',
    caption: 'Majestic groom on white horse, dhol drummers, celebration, and grand royal entrance',
  },
  {
    id: 5,
    image: '/wedding/wedding-1.jpg',
    title: 'The Sacred Pheras',
    event: 'Varmala & Pheras',
    caption: 'The sacred union of Harish & Lavina around the holy fire in royal Udaipur palace',
  },
  {
    id: 6,
    image: '/wedding/wedding-2.jpg',
    title: 'Lake Pichola Sunset',
    event: 'Pre-Wedding Romance',
    caption: 'Golden hour romance by the serene palace waters of Lake Pichola at twilight',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    title: 'The Royal Mandap',
    event: 'Sacred Rituals',
    caption: 'Fresh marigolds, Vedic chants, and divine blessings under starlit night',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    title: 'Grand Palace Banquet',
    event: 'Royal Reception',
    caption: 'A regal banquet with family under starlit Udaipur skies to celebrate eternal love',
  },
];

export default function WeddingGalleryMarquee() {
  const [activeCard, setActiveCard] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = scroll left, -1 = scroll right
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const hasMovedRef = useRef(false);
  const rafIdRef = useRef(null);

  const startYRef = useRef(0);
  const lastYRef = useRef(0);

  // Triple set guarantees seamless mathematical infinite wrap with zero seam
  const loopItems = [...WEDDING_MOMENTS, ...WEDDING_MOMENTS, ...WEDDING_MOMENTS];

  // Continuous 60fps/120fps Infinite Animation Loop that NEVER ends
  useEffect(() => {
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      const track = trackRef.current;
      if (track) {
        // Calculate dynamic width of one set of cards
        const singleSetWidth = track.scrollWidth / 3;

        if (singleSetWidth > 50) {
          if (!isDraggingRef.current) {
            // Apply drag inertia momentum if released
            if (Math.abs(velocityRef.current) > 0.08) {
              offsetRef.current += velocityRef.current;
              velocityRef.current *= 0.94; // smooth friction decay
            } else {
              // Butter-smooth continuous auto-run
              offsetRef.current += 1.15 * direction * speedMultiplier;
            }
          }

          // Mathematical Infinite Wrap — Loops forever with ZERO end point
          if (offsetRef.current >= singleSetWidth) {
            offsetRef.current -= singleSetWidth;
          } else if (offsetRef.current < 0) {
            offsetRef.current += singleSetWidth;
          }

          track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [direction, speedMultiplier]);

  // Touch gesture handlers for mobile infinite swipe
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      isDraggingRef.current = true;
      setIsDraggingState(true);
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      lastXRef.current = e.touches[0].clientX;
      lastYRef.current = e.touches[0].clientY;
      velocityRef.current = 0;
      hasMovedRef.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !e.touches || e.touches.length === 0) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = lastXRef.current - currentX;
    const totalDiffX = Math.abs(currentX - startXRef.current);
    const totalDiffY = Math.abs(currentY - startYRef.current);

    lastXRef.current = currentX;
    lastYRef.current = currentY;

    // Only prevent default if horizontal drag is clearly dominant
    if (totalDiffX > 10 && totalDiffX > totalDiffY) {
      hasMovedRef.current = true;
      if (e.cancelable) e.preventDefault();
      offsetRef.current += deltaX;
      velocityRef.current = deltaX;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDraggingState(false);
  };

  // Mouse drag handlers for desktop infinite drag
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    setIsDraggingState(true);
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    hasMovedRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX;
    const deltaX = lastXRef.current - currentX;
    lastXRef.current = currentX;

    if (Math.abs(currentX - startXRef.current) > 8) {
      hasMovedRef.current = true;
    }

    offsetRef.current += deltaX;
    velocityRef.current = deltaX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDraggingState(false);
  };

  // Card click handler: only open modal if not dragging
  const handleCardClick = (item) => {
    if (!hasMovedRef.current) {
      setActiveCard(item);
    }
  };

  // Speed and direction controls
  const toggleDirection = () => {
    setDirection((prev) => -prev);
    velocityRef.current = 0;
  };

  const nudgeLoop = (step) => {
    velocityRef.current = step * 12;
  };

  return (
    <section className="wedding-gallery-section relative w-full py-20 sm:py-24 px-4 sm:px-8 md:px-12 overflow-hidden flex flex-col items-center justify-center" id="moments" aria-label="Wedding Photo Gallery">
      {/* Ambient Atmospheric Glow */}
      <div className="gallery-ambient-glow pointer-events-none" aria-hidden="true"></div>

      {/* Header Container */}
      <div className="gallery-header-wrapper flex flex-col items-center text-center gap-2.5 mb-8 sm:mb-10 max-w-2xl mx-auto">
        <div className="gallery-top-badge inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest text-[#e5be7a] border border-[#d4a359]/30 bg-[#251a12]/80 uppercase shadow-lg backdrop-blur-sm">
          <span className="text-[#d4a359]">✦</span>
          <span className="font-serif">|| अविस्मरणीय स्मृतियाँ ||</span>
          <span className="text-[#d4a359]">✦</span>
        </div>
        <h2 className="gallery-title font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#faf6ed] tracking-wide drop-shadow-xl m-0">
          शाही विवाह स्मृतियाँ
        </h2>
        <p className="gallery-description text-xs sm:text-sm font-serif text-[#faf6ed]/75 max-w-md m-0">
          हरिष एवं लविना के मांगलिक उत्सव की कुछ पावन एवं सुंदर झलकियाँ
        </p>

        {/* Interactive Loop Navigation Bar */}
        <div className="marquee-loop-controls flex flex-wrap items-center justify-center gap-2.5 mt-3">
          <button
            type="button"
            className="loop-control-btn inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif font-medium transition-all duration-200 cursor-pointer text-[#faf6ed] border border-[#d4a359]/30 bg-[#251a12]/60 hover:border-[#e5be7a]"
            onClick={() => nudgeLoop(-2)}
            title="Spin left"
          >
            <span>← बाएँ घुमाएँ</span>
          </button>

          <button
            type="button"
            className="loop-direction-toggle-btn inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif font-medium transition-all duration-200 cursor-pointer text-[#faf6ed] border border-[#d4a359]/30 bg-[#251a12]/60 hover:border-[#e5be7a]"
            onClick={toggleDirection}
            title="Toggle direction"
          >
            <span>{direction === 1 ? 'दिशा: बाएँ ◄' : 'दिशा: दाएँ ►'}</span>
          </button>

          <button
            type="button"
            className="loop-control-btn inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif font-medium transition-all duration-200 cursor-pointer text-[#faf6ed] border border-[#d4a359]/30 bg-[#251a12]/60 hover:border-[#e5be7a]"
            onClick={() => nudgeLoop(2)}
            title="Spin right"
          >
            <span>दाएँ घुमाएँ →</span>
          </button>
        </div>
      </div>

      {/* 3D Arc Infinite Continuous Carousel Viewport */}
      <div 
        className={`gallery-marquee-viewport ${isDraggingState ? 'is-dragging-loop' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Center Vertical Light Beam matching reference */}
        <div className="marquee-center-beam" aria-hidden="true"></div>

        {/* Continuous Infinite Track (Runs forever in requestAnimationFrame with zero end) */}
        <div 
          className="gallery-marquee-track-infinite"
          ref={trackRef}
        >
          {loopItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              className="gallery-card-item"
              onClick={() => handleCardClick(item)}
            >
              <div className="card-image-wrap">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  loading="lazy"
                  className="card-photo"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="card-gradient-overlay"></div>
                <div className="card-hover-info">
                  <span className="card-event-badge">{item.event}</span>
                  <h4 className="card-photo-title">{item.title}</h4>
                  <p className="card-caption">{item.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drag & Loop Interactive Notice */}
      <div className="loop-indicator-bar">
        <span className="loop-icon">♾️</span>
        <span>SEAMLESS INFINITE LOOP • DRAG OR SWIPE FREELY</span>
        <span className="loop-icon">♾️</span>
      </div>

      {/* 3 Bottom Feature Columns matching reference layout */}
      <div className="gallery-features-grid">
        <div className="feature-col-card">
          <div className="col-top-badge">01 • THE WELCOME</div>
          <h3 className="col-heading">The Royal Welcome &amp; Mehendi</h3>
          <p className="col-desc">
            A joyous celebration welcoming family and friends to Udaipur with vibrant music, traditional Rajasthani folk dances, and intricate bridal henna.
          </p>
        </div>

        <div className="feature-col-card highlight-col">
          <div className="col-top-badge">02 • THE UNION</div>
          <h3 className="col-heading">Sangeet &amp; Sacred Pheras</h3>
          <p className="col-desc">
            A magical evening of dance performances, joyous music, followed by the exchange of varmala garlands and the seven sacred vows around the holy fire.
          </p>
        </div>

        <div className="feature-col-card">
          <div className="col-top-badge">03 • THE CELEBRATION</div>
          <h3 className="col-heading">Grand Palace Banquet</h3>
          <p className="col-desc">
            An evening of royal banquets, heartfelt toasts, and dancing under the starlit sky to celebrate Harish &amp; Lavina's eternal beginning.
          </p>
        </div>
      </div>

      {/* Photo Modal Lightbox */}
      {activeCard && (
        <div className="photo-lightbox-modal" onClick={() => setActiveCard(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="lightbox-close-btn"
              onClick={() => setActiveCard(null)}
              aria-label="Close photo"
            >
              ✕
            </button>
            <img src={activeCard.image} alt={activeCard.title} className="lightbox-img" />
            <div className="lightbox-meta">
              <span className="lightbox-event">{activeCard.event}</span>
              <h3 className="lightbox-title">{activeCard.title}</h3>
              <p className="lightbox-caption">{activeCard.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
