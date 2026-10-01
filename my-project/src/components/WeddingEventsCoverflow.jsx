import React, { useState, useRef, useEffect, useCallback } from 'react';

const WEDDING_EVENTS = [
  {
    id: 1,
    name: 'Ganesh Pujan & Mehendi',
    hindi: 'मेहंदी की रस्म',
    date: '10 Dec 2026',
    day: 'Thursday',
    time: '03:00 PM',
    muhurat: 'Abhijit Muhurat',
    venue: 'Zenana Mahal Courtyard',
    city: 'City Palace, Udaipur',
    image: '/wedding/mehendi.jpg',
    themeColor: '#059669', // Emerald / Henna green
    dressCode: 'Green & Festive Pastel',
    description: 'An auspicious beginning with Vedic Ganesh sthapana, followed by fragrant bridal henna, Rajasthani folk music, and joyous laughter under starlit canopies.',
    tag: 'TRADITIONAL HEIRLOOM',
  },
  {
    id: 2,
    name: 'Phoolon Ki Haldi',
    hindi: 'हल्दी की रस्म',
    date: '11 Dec 2026',
    day: 'Friday',
    time: '10:00 AM',
    muhurat: 'Shubh Choghadiya',
    venue: 'Manek Chowk Poolside',
    city: 'The Royal Palace, Udaipur',
    image: '/wedding/haldi.jpg',
    themeColor: '#d97706', // Turmeric Amber
    dressCode: 'Sunshine Yellow Ethnic',
    description: 'A glowing celebration showering Harish & Lavina with auspicious turmeric ubtan, fresh yellow marigold petals, vibrant dhol beats, and sunny blessings.',
    tag: 'AUSPICIOUS RITUAL',
  },
  {
    id: 3,
    name: 'Royal Sangeet & Dance',
    hindi: 'संगीत संध्या',
    date: '11 Dec 2026',
    day: 'Friday',
    time: '07:00 PM',
    muhurat: 'Twilight Soirée',
    venue: 'Fateh Prakash Ballroom',
    city: 'Lake Pichola, Udaipur',
    image: '/wedding/wedding-3.jpg',
    themeColor: '#7c3aed', // Royal Purple
    dressCode: 'Glamorous Indo-Western',
    description: 'An electrifying musical extravaganza! Dazzling family choreography, soulful qawwali rhythms, and non-stop dancing under crystalline chandeliers.',
    tag: 'MUSICAL NIGHT',
  },
  {
    id: 4,
    name: 'The Royal Baraat',
    hindi: 'शाही बारात स्वागत',
    date: '12 Dec 2026',
    day: 'Saturday',
    time: '04:30 PM',
    muhurat: 'Vijay Muhurat',
    venue: 'Badi Pol Gateway',
    city: 'The Royal Palace, Udaipur',
    image: '/wedding/baraat.jpg',
    themeColor: '#ea580c', // Saffron Gold
    dressCode: 'Regal Sherwani & Safa',
    description: 'A majestic royal procession as Harish arrives on a decorated royal white horse accompanied by vibrant dhol drummers, shehnai melodies, and grand swagat.',
    tag: 'ROYAL PROCESSION',
  },
  {
    id: 5,
    name: 'Shubh Vivaah (Pheras)',
    hindi: 'शुभ विवाह एवं फेरे',
    date: '12 Dec 2026',
    day: 'Saturday',
    time: '07:15 PM',
    muhurat: 'Godhuli Bela Muhurat',
    venue: 'Jagmandir Island Palace Mandap',
    city: 'Lake Pichola, Udaipur',
    image: '/wedding/wedding-1.jpg',
    themeColor: '#dc2626', // Sacred Crimson Red
    dressCode: 'Traditional Red & Gold Lehengas',
    description: 'The sacred union of Harish & Lavina! The exchange of sacred varmala garlands, Vedic mantras, and seven holy vows around the sacred Agni fire.',
    tag: 'SACRED UNION',
  },
  {
    id: 6,
    name: 'Grand Palace Reception',
    hindi: 'रिसेप्शन एवं प्रीतिभोज',
    date: '13 Dec 2026',
    day: 'Sunday',
    time: '08:00 PM',
    muhurat: 'Amrit Bela Soirée',
    venue: 'Lake Garden Starlit Lawns',
    city: 'Jagmandir Island, Udaipur',
    image: '/wedding/wedding-2.jpg',
    themeColor: '#b45309', // Royal Mewar Gold
    dressCode: 'Royal Formal / Black Tie',
    description: 'A grand royal banquet with family, heartfelt toasts, Mewari culinary feasts, and starlit celebrations to honor Harish & Lavina’s eternal beginning.',
    tag: 'GRAND BANQUET',
  },
];

export default function WeddingEventsCoverflow() {
  const [activeIndex, setActiveIndex] = useState(1); // Default active on Haldi
  const [modalEvent, setModalEvent] = useState(null);

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);

  // Navigate next & prev
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : WEDDING_EVENTS.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < WEDDING_EVENTS.length - 1 ? prev + 1 : 0));
  }, []);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch handlers for mobile swipe with zero re-render lag
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      currentXRef.current = e.touches[0].clientX;
      currentYRef.current = e.touches[0].clientY;
      isDraggingRef.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !e.touches || e.touches.length === 0) return;
    currentXRef.current = e.touches[0].clientX;
    currentYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const diffX = startXRef.current - currentXRef.current;
    const diffY = startYRef.current - currentYRef.current;

    // Only swipe if horizontal drag is dominant and more than 35px
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Mouse drag handlers for desktop swipe
  const handleMouseDown = (e) => {
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const diffX = startXRef.current - currentXRef.current;
    if (diffX > 45) {
      handleNext();
    } else if (diffX < -45) {
      handlePrev();
    }
  };

  // Quick Calendar add
  const handleAddToCalendar = (evt, e) => {
    e.stopPropagation();
    const title = encodeURIComponent(`${evt.name} — Harish & Lavina Wedding`);
    const details = encodeURIComponent(
      `${evt.description}\n\nMuhurat: ${evt.time} (${evt.muhurat})\nDress Code: ${evt.dressCode}\nVenue: ${evt.venue}, ${evt.city}`
    );
    const location = encodeURIComponent(`${evt.venue}, ${evt.city}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <section className="wedding-events-coverflow-section relative w-full py-20 sm:py-24 px-4 sm:px-8 md:px-12 overflow-hidden flex flex-col items-center justify-center" id="events" aria-label="Wedding Itinerary & Rituals">
      {/* Ambient Royal Gold Backdrop */}
      <div className="coverflow-ambient-glow pointer-events-none" aria-hidden="true"></div>

      {/* Header Section */}
      <div className="coverflow-header-wrap flex flex-col items-center text-center gap-2.5 mb-8 sm:mb-10 max-w-2xl mx-auto">
        <div className="coverflow-pill-badge inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest text-[#e5be7a] border border-[#d4a359]/30 bg-[#251a12]/80 uppercase shadow-lg backdrop-blur-sm">
          <span className="text-[#d4a359]">✦</span>
          <span className="font-serif">|| माङ्गलिक कार्यक्रम ||</span>
          <span className="text-[#d4a359]">✦</span>
        </div>
        <h2 className="coverflow-main-title font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#faf6ed] tracking-wide drop-shadow-xl m-0">
          मांगलिक उत्सव एवं रस्में
        </h2>
        <p className="coverflow-main-subtitle text-xs sm:text-sm font-serif text-[#faf6ed]/75 max-w-md m-0">
          शुभ विवाह के समस्त मांगलिक आयोजनों की पावन समय-सारणी
        </p>

        {/* Ceremony Quick-Jump Tabs */}
        <div className="ceremony-quick-tabs flex flex-wrap items-center justify-center gap-2 mt-4">
          {WEDDING_EVENTS.map((evt, idx) => (
            <button
              key={evt.id}
              type="button"
              className={`ceremony-tab-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${idx === activeIndex ? 'tab-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <span className="tab-dot w-2 h-2 rounded-full" style={{ backgroundColor: evt.themeColor }}></span>
              <span className="tab-name">{evt.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Coverflow Viewport Container */}
      <div
        className="coverflow-stage-viewport"
        ref={containerRef}
        style={{ touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="coverflow-cards-track">
          {WEDDING_EVENTS.map((evt, index) => {
            const total = WEDDING_EVENTS.length;
            let offset = index - activeIndex;
            while (offset > total / 2) offset -= total;
            while (offset < -total / 2) offset += total;
            const isCenter = offset === 0;

            // Compute 3D Depth Transforms matching the user's reference image
            let style = {};

            if (isCenter) {
              // Highlighted Center Card (top wala highlight hoga)
              style = {
                transform: 'translate3d(0, -18px, 60px) scale(1.06) rotateY(0deg)',
                zIndex: 10,
                opacity: 1,
                filter: 'brightness(1)',
                pointerEvents: 'auto',
              };
            } else if (offset === -1) {
              // Left adjacent card
              style = {
                transform: 'translate3d(-66%, 2px, -30px) scale(0.88) rotateY(16deg)',
                zIndex: 7,
                opacity: 0.85,
                filter: 'brightness(0.8) blur(0.4px)',
                cursor: 'pointer',
              };
            } else if (offset === 1) {
              // Right adjacent card
              style = {
                transform: 'translate3d(66%, 2px, -30px) scale(0.88) rotateY(-16deg)',
                zIndex: 7,
                opacity: 0.85,
                filter: 'brightness(0.8) blur(0.4px)',
                cursor: 'pointer',
              };
            } else if (offset === -2) {
              // Far left card
              style = {
                transform: 'translate3d(-122%, 14px, -90px) scale(0.74) rotateY(26deg)',
                zIndex: 4,
                opacity: 0.55,
                filter: 'brightness(0.6) blur(1px)',
                cursor: 'pointer',
              };
            } else if (offset === 2) {
              // Far right card
              style = {
                transform: 'translate3d(122%, 14px, -90px) scale(0.74) rotateY(-26deg)',
                zIndex: 4,
                opacity: 0.55,
                filter: 'brightness(0.6) blur(1px)',
                cursor: 'pointer',
              };
            } else {
              // Off-screen card
              style = {
                transform: `translate3d(${offset > 0 ? 170 : -170}%, 20px, -150px) scale(0.6) rotateY(${offset > 0 ? -35 : 35}deg)`,
                zIndex: 1,
                opacity: 0,
                pointerEvents: 'none',
              };
            }

            return (
              <div
                key={evt.id}
                className={`coverflow-card-item ${isCenter ? 'card-highlighted-center' : ''}`}
                style={style}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  } else {
                    setModalEvent(evt);
                  }
                }}
              >
                {/* Card Inner Surface: Luxury Clean Editorial matching reference */}
                <div className="card-inner-surface">
                  {/* Top Image Box with Rounded Inset */}
                  <div className="card-top-image-wrap">
                    <img
                      src={evt.image}
                      alt={evt.name}
                      className="card-event-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="image-vignette-overlay"></div>

                    {/* Hindi Auspicious Badge on image */}
                    <div className="card-hindi-badge">
                      <span className="hindi-badge-text">{evt.hindi}</span>
                    </div>

                    {/* Ritual Tag */}
                    <div className="card-tag-pill" style={{ borderColor: evt.themeColor }}>
                      <span className="tag-dot" style={{ backgroundColor: evt.themeColor }}></span>
                      <span>{evt.tag}</span>
                    </div>
                  </div>

                  {/* Card Content Section */}
                  <div className="card-body-content">
                    {/* Event Title */}
                    <div className="flex flex-col gap-0.5">
                      <h3 className="card-event-heading font-serif">{evt.hindi}</h3>
                      <span className="text-xs font-serif tracking-wider text-[#e5be7a]/80">{evt.name}</span>
                    </div>

                    {/* Location Pin */}
                    <div className="card-location-row">
                      <span className="location-pin">📍</span>
                      <span className="location-text">
                        {evt.venue}, {evt.city}
                      </span>
                    </div>

                    {/* 3 Clean Stats Columns */}
                    <div className="card-stats-grid">
                      <div className="stat-col">
                        <span className="stat-label">तिथि</span>
                        <strong className="stat-val">{evt.date}</strong>
                      </div>
                      <div className="stat-col">
                        <span className="stat-label">समय</span>
                        <strong className="stat-val">{evt.time}</strong>
                      </div>
                      <div className="stat-col">
                        <span className="stat-label">परिधान</span>
                        <strong className="stat-val">{evt.dressCode.split(' ')[0]}</strong>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="card-bottom-bar">
                      <div className="bottom-price-date-wrap">
                        <span className="bottom-caption">शुभ बेला</span>
                        <strong className="bottom-date-val">
                          {evt.day} • {evt.muhurat}
                        </strong>
                      </div>

                      {/* Circular Action Button matching reference layout */}
                      <button
                        type="button"
                        className="card-circular-action-btn"
                        onClick={(e) => handleAddToCalendar(evt, e)}
                        title={`Add ${evt.name} to Google Calendar`}
                      >
                        <span className="btn-icon">📅</span>
                        <span className="btn-shine" aria-hidden="true"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls: Arrows & Progress Dots */}
      <div className="coverflow-controls-row">
        {/* Left Arrow */}
        <button
          type="button"
          className="coverflow-nav-btn prev-btn"
          onClick={handlePrev}
          aria-label="Previous Ceremony"
        >
          <span>←</span>
        </button>

        {/* Dots Indicator */}
        <div className="coverflow-dots-wrap">
          {WEDDING_EVENTS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`coverflow-dot ${i === activeIndex ? 'dot-active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Jump to ceremony ${i + 1}`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          className="coverflow-nav-btn next-btn"
          onClick={handleNext}
          aria-label="Next Ceremony"
        >
          <span>→</span>
        </button>
      </div>

      {/* Swipe Gesture Guide for Mobile & PC */}
      <div className="coverflow-swipe-hint">
        <span className="swipe-hand-icon">👈</span>
        <span>SWIPE OR USE ARROWS TO BROWSE CEREMONIES</span>
        <span className="swipe-hand-icon">👉</span>
      </div>

      {/* Ceremony Detail Lightbox Modal */}
      {modalEvent && (
        <div className="ceremony-modal-overlay" onClick={() => setModalEvent(null)}>
          <div className="ceremony-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ceremony-modal-close"
              onClick={() => setModalEvent(null)}
              aria-label="Close ceremony details"
            >
              ✕
            </button>
            <div className="modal-top-img-wrap">
              <img src={modalEvent.image} alt={modalEvent.name} className="modal-img" />
              <div className="modal-hindi-pill">{modalEvent.hindi}</div>
            </div>
            <div className="modal-content-box">
              <div className="modal-pill-tag" style={{ color: modalEvent.themeColor }}>
                ✦ {modalEvent.tag} ✦
              </div>
              <h3 className="modal-title">{modalEvent.name}</h3>
              <p className="modal-venue">📍 {modalEvent.venue}, {modalEvent.city}</p>
              <p className="modal-description">{modalEvent.description}</p>

              <div className="modal-details-grid">
                <div className="modal-detail-item">
                  <span className="modal-detail-caption">DATE &amp; DAY</span>
                  <strong className="modal-detail-val">{modalEvent.date} ({modalEvent.day})</strong>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-caption">SHUBH MUHURAT</span>
                  <strong className="modal-detail-val text-cyan">{modalEvent.time}</strong>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-caption">DRESS CODE</span>
                  <strong className="modal-detail-val">{modalEvent.dressCode}</strong>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="modal-calendar-btn"
                  onClick={(e) => handleAddToCalendar(modalEvent, e)}
                >
                  <span>📅 Save {modalEvent.name} to Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
