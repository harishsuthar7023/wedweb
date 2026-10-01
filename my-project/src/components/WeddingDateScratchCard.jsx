import React, { useEffect, useRef, useState, useCallback } from 'react';

// Royal celebratory colors
const CONFETTI_COLORS = [
  '#d4af37', // Royal Gold
  '#ffd700', // Bright Gold
  '#ffecb3', // Champagne Cream
  '#f59e0b', // Amber
  '#e11d48', // Ruby Crimson
  '#ec4899', // Festive Pink
  '#10b981', // Emerald
  '#8b5cf6', // Royal Purple
  '#ffffff', // Diamond White
];

// Target Wedding Date: December 12, 2026 19:15:00 IST
const WEDDING_TARGET_DATE = new Date('2026-12-12T19:15:00+05:30').getTime();

export default function WeddingDateScratchCard() {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const celebrationCanvasRef = useRef(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const hasTriggeredRevealRef = useRef(false);
  const celebrationParticlesRef = useRef([]);
  const celebrationRafRef = useRef(null);
  const scratchAudioCtxRef = useRef(null);

  // Live Countdown to Dec 12, 2026
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = Math.max(0, WEDDING_TARGET_DATE - now);

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Synthesizer: Festive celebration chord & popper sounds
  const playCelebrationFanfare = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Royal celebration chord: C5, E5, G5, C6 (Soprano triumph)
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + idx * 0.06 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 1.5);
      });

      // Champagne popper burst (white noise whoosh)
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const popFilter = ctx.createBiquadFilter();
      popFilter.type = 'lowpass';
      popFilter.frequency.value = 1200;
      const popGain = ctx.createGain();
      popGain.gain.setValueAtTime(0.18, ctx.currentTime);
      popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }, []);

  // Subtle scratch whisper sound
  const playScratchSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!scratchAudioCtxRef.current) {
        scratchAudioCtxRef.current = new AudioCtx();
      }
      const ctx = scratchAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = Math.floor(ctx.sampleRate * 0.035);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) { }
  }, []);

  // Fire festive celebration shots (cannons from bottom corners + fireworks in center)
  const fireCelebrationShots = useCallback((customCount = 140) => {
    playCelebrationFanfare();

    const canvas = celebrationCanvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const newParticles = [];

    // Left Cannon Shot (shoots up and to the right)
    for (let i = 0; i < customCount / 2; i++) {
      const angle = (Math.random() * 45 + 35) * (Math.PI / 180); // 35 to 80 degrees
      const speed = Math.random() * 18 + 14;
      newParticles.push({
        x: width * 0.12 + (Math.random() * 40 - 20),
        y: height * 0.88,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        size: Math.random() * 10 + 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 14,
        scaleX: 1,
        vScale: (Math.random() - 0.5) * 0.1,
        shape: Math.random() > 0.4 ? 'ribbon' : Math.random() > 0.5 ? 'star' : 'heart',
        alpha: 1,
        decay: Math.random() * 0.005 + 0.004,
        gravity: 0.38,
      });
    }

    // Right Cannon Shot (shoots up and to the left)
    for (let i = 0; i < customCount / 2; i++) {
      const angle = (Math.random() * 45 + 100) * (Math.PI / 180); // 100 to 145 degrees
      const speed = Math.random() * 18 + 14;
      newParticles.push({
        x: width * 0.88 + (Math.random() * 40 - 20),
        y: height * 0.88,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        size: Math.random() * 10 + 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 14,
        scaleX: 1,
        vScale: (Math.random() - 0.5) * 0.1,
        shape: Math.random() > 0.4 ? 'ribbon' : Math.random() > 0.5 ? 'star' : 'heart',
        alpha: 1,
        decay: Math.random() * 0.005 + 0.004,
        gravity: 0.38,
      });
    }

    // Center starburst shots
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      newParticles.push({
        x: width * 0.5,
        y: height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 16,
        scaleX: 1,
        vScale: (Math.random() - 0.5) * 0.1,
        shape: 'star',
        alpha: 1,
        decay: Math.random() * 0.006 + 0.006,
        gravity: 0.28,
      });
    }

    celebrationParticlesRef.current.push(...newParticles);
  }, [playCelebrationFanfare]);

  // Animation Loop for Celebration Confetti Cannons
  useEffect(() => {
    const canvas = celebrationCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const renderCelebration = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = celebrationParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rotation += p.vRot;
        p.scaleX += p.vScale;
        if (Math.abs(p.scaleX) > 1) p.vScale = -p.vScale;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > canvas.height + 60) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(p.scaleX, 1);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          // Draw 4-point golden sparkle star
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        } else if (p.shape === 'heart') {
          // Draw mini royal heart
          const s = p.size * 0.7;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.4, s * 0.4, 0, s * 1.3);
          ctx.bezierCurveTo(s * 1.4, s * 0.4, s, -s * 0.6, 0, s * 0.3);
          ctx.fill();
        } else {
          // Draw fluttering ribbon strip
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.8);
        }

        ctx.restore();
      }

      celebrationRafRef.current = requestAnimationFrame(renderCelebration);
    };

    celebrationRafRef.current = requestAnimationFrame(renderCelebration);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (celebrationRafRef.current) cancelAnimationFrame(celebrationRafRef.current);
    };
  }, []);

  // Initialize Royal Gold Foil on the Top Scratch Canvas
  const initFoilCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.offsetWidth || 500;
    const height = canvas.offsetHeight || 640;
    canvas.width = width;
    canvas.height = height;

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // 1. Rich Metallic Gold Foil Gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#caa24c');
    goldGrad.addColorStop(0.2, '#f5e396');
    goldGrad.addColorStop(0.4, '#aa7e2e');
    goldGrad.addColorStop(0.65, '#dfb75c');
    goldGrad.addColorStop(0.85, '#fef0ad');
    goldGrad.addColorStop(1, '#8f651d');

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Fine gold sparkle texture & noise stippling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 2800; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const r = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Royal ornamental border on the foil
    ctx.strokeStyle = 'rgba(74, 46, 7, 0.55)';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, width - 36, height - 36);

    ctx.strokeStyle = 'rgba(255, 245, 200, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // 4. Center Royal Emblem & Scratch Instructions on Foil
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top Crest Ornament
    ctx.font = '22px serif';
    ctx.fillStyle = '#4a2e07';
    ctx.fillText('❖  ✦  ❖', width / 2, height * 0.22);

    // Badge Title
    ctx.font = 'bold 12px "Cinzel", "Outfit", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = '#3d2403';
    ctx.fillText('ROYAL WEDDING INVITATION', width / 2, height * 0.28);

    // Main Instruction Headline
    ctx.font = 'bold 24px "Cinzel", "Georgia", serif';
    ctx.fillStyle = '#2d1802';
    ctx.fillText('SCRATCH TO REVEAL', width / 2, height * 0.38);

    ctx.font = 'bold 28px "Great Vibes", "Brush Script MT", cursive';
    ctx.fillStyle = '#4a2e07';
    ctx.fillText('Auspicious Wedding Date', width / 2, height * 0.45);

    // Coin Seal Circle in center
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.58, 48, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#5a3809';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Seal Icon
    ctx.font = '36px sans-serif';
    ctx.fillText('🪙', width / 2, height * 0.58);

    // Action Prompts
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#422502';
    ctx.fillText('✦ RUB HERE WITH FINGER OR CURSOR ✦', width / 2, height * 0.72);

    ctx.font = 'italic 12px "Cormorant Garamond", serif';
    ctx.fillStyle = '#5c390a';
    ctx.fillText('Unveil the sacred Muhurat of Harish & Lavina', width / 2, height * 0.77);

    // Bottom Filigree
    ctx.font = '16px serif';
    ctx.fillText('❦ ───────── ❖ ───────── ❦', width / 2, height * 0.88);

    setIsRevealed(false);
    setScratchPercent(0);
    hasTriggeredRevealRef.current = false;
  }, []);

  // Initialize canvas on mount
  useEffect(() => {
    initFoilCanvas();
  }, [initFoilCanvas]);

  // Complete date reveal with celebration shots
  const triggerReveal = useCallback(() => {
    if (hasTriggeredRevealRef.current) return;
    hasTriggeredRevealRef.current = true;
    setIsRevealed(true);
    setScratchPercent(100);

    // Smoothly dissolve remaining foil
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      canvas.style.opacity = '0';
      canvas.style.transform = 'scale(1.05)';
      setTimeout(() => {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
      }, 650);
    }

    // Fire spectacular celebration shots!
    fireCelebrationShots(180);

    // Second celebratory salvo 1.2s later for prolonged celebration
    setTimeout(() => {
      fireCelebrationShots(120);
    }, 1100);
  }, [fireCelebrationShots]);

  // Check scratch completion percentage by sampling pixel alpha
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasTriggeredRevealRef.current) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      let transparentPixels = 0;
      const step = 32; // Sample every 32nd pixel for ultra-high 60fps performance
      let totalSampled = 0;

      for (let i = 3; i < data.length; i += 4 * step) {
        totalSampled++;
        if (data[i] < 128) {
          transparentPixels++;
        }
      }

      const percent = Math.round((transparentPixels / totalSampled) * 100);
      setScratchPercent(percent);

      // Once user scratches 38% or more, automatically trigger celebration reveal
      if (percent >= 38) {
        triggerReveal();
      }
    } catch (e) {
      // Fallback
    }
  }, [triggerReveal]);

  // Erase foil at position (x, y) with realistic circular brush
  const scratchAtPoint = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || hasTriggeredRevealRef.current) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 50; // Thick realistic coin scratch size

    ctx.beginPath();
    if (lastPointRef.current) {
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x, y };
    playScratchSound();
  }, [playScratchSound]);

  // Mouse Scratch Event Handlers
  const handleMouseDown = (e) => {
    if (isRevealed) return;
    isDrawingRef.current = true;
    setIsScratching(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPointRef.current = { x, y };
    scratchAtPoint(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current || isRevealed) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    scratchAtPoint(x, y);
    checkScratchPercentage();
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    setIsScratching(false);
  };

  // Touch Scratch Event Handlers (for mobile & tablets)
  const handleTouchStart = (e) => {
    if (isRevealed || !e.touches || e.touches.length === 0) return;
    isDrawingRef.current = true;
    setIsScratching(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    lastPointRef.current = { x, y };
    scratchAtPoint(x, y);
  };

  const handleTouchMove = (e) => {
    if (!isDrawingRef.current || isRevealed || !e.touches || e.touches.length === 0) return;
    if (e.cancelable) e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    scratchAtPoint(x, y);
    checkScratchPercentage();
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    setIsScratching(false);
  };

  // Reset & Re-scratch card
  const handleResetCard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      canvas.style.transform = 'scale(1)';
    }
    initFoilCanvas();
  };

  // Google Calendar Link generator
  const handleGoogleCalendar = () => {
    const title = encodeURIComponent("Royal Wedding of Harish & Lavina");
    const details = encodeURIComponent(
      "You are cordially invited to celebrate the royal wedding of Harish & Lavina in Udaipur, Rajasthan. Auspicious Muhurat: 07:15 PM."
    );
    const location = encodeURIComponent("The Royal Palace, Jagmandir Island, Udaipur, Rajasthan");
    const dates = "20261212T134500Z/20261212T193000Z"; // 19:15 IST
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <section className="wedding-scratch-section relative w-full py-20 sm:py-24 px-4 sm:px-8 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center" id="gallery" aria-label="Auspicious Wedding Date Scratch Card">
      {/* Celebration Confetti & Shots Canvas */}
      <canvas
        ref={celebrationCanvasRef}
        className="celebration-shots-canvas pointer-events-none"
        aria-hidden="true"
      />

      {/* Ambient Gold Glow Background */}
      <div className="scratch-ambient-glow pointer-events-none" aria-hidden="true"></div>

      {/* Section Header */}
      <div className="scratch-header-wrap flex flex-col items-center gap-2.5 mb-8 sm:mb-10 max-w-2xl mx-auto">
        <div className="scratch-pill-badge inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest text-[#e5be7a] border border-[#d4a359]/30 bg-[#251a12]/80 uppercase shadow-lg backdrop-blur-sm">
          <span className="text-[#d4a359]">✦</span>
          <span className="font-serif">|| शुभ लग्न एवं तिथि ||</span>
          <span className="text-[#d4a359]">✦</span>
        </div>
        <h2 className="scratch-section-title font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#faf6ed] tracking-wide drop-shadow-xl m-0">
          शुभ मुहूर्त स्क्रैच कार्ड
        </h2>
        <p className="scratch-section-subtitle text-xs sm:text-sm font-serif text-[#faf6ed]/75 max-w-md m-0">
          कार्ड को स्क्रैच कर शुभ विवाह मुहूर्त व तिथि के पावन साक्षी बनें
        </p>
      </div>

      {/* Main Interactive Scratch Card Box */}
      <div className="scratch-card-outer relative w-full max-w-2xl mx-auto rounded-3xl p-2.5 sm:p-3.5 shadow-2xl">
        {/* Decorative Golden Corner Accents */}
        <div className="card-corner corner-tl" aria-hidden="true"></div>
        <div className="card-corner corner-tr" aria-hidden="true"></div>
        <div className="card-corner corner-bl" aria-hidden="true"></div>
        <div className="card-corner corner-br" aria-hidden="true"></div>

        <div className={`scratch-card-box ${isRevealed ? 'revealed-celebrating' : ''}`} ref={cardRef}>
          {/* UNDERNEATH LAYER: The Grand Royal Wedding Date */}
          <div className="revealed-date-content">
            {/* Top Auspicious Invocation */}
            <div className="ganesha-invocation">
              <span className="om-symbol">卐</span>
              <span className="invocation-text">|| श्री गणेशाय नमः ||</span>
              <span className="om-symbol">卐</span>
            </div>

            {/* Save The Date Crown */}
            <div className="save-date-tag">
              <span className="royal-crown-icon">👑</span>
              {/* <span className="save-date-label">SAVE THE DATE</span> */}
            </div>

            {/* Couple Name */}
            <h3 className="revealed-couple-title">
              Harish <span className="amp">&amp;</span> Lavina
            </h3>

            {/* <p className="revealed-subtext">
              Request the honour of your auspicious presence at their wedding celebration
            </p> */}

            {/* Auspicious Grand Date Display */}
            <div className="grand-date-banner">
              <div className="date-block">
                <span className="date-digit">12</span>
                <span className="date-unit">DAY</span>
              </div>
              <span className="date-sep">•</span>
              <div className="date-block highlight-month">
                <span className="date-digit">12</span>
                <span className="date-unit">DECEMBER</span>
              </div>
              <span className="date-sep">•</span>
              <div className="date-block">
                <span className="date-digit">2026</span>
                <span className="date-unit">YEAR</span>
              </div>
            </div>

            {/* Auspicious Muhurat & Day */}
            {/* <div className="muhurat-badge-wrap">
              <span className="muhurat-icon">✨</span>
              <span className="muhurat-text">
                SATURDAY • AUSPICIOUS MUHURAT: <strong>07:15 PM (GODHULI BELA)</strong>
              </span>
              <span className="muhurat-icon">✨</span>
            </div> */}

            {/* Venue Location */}
            <div className="revealed-venue-box">
              <span className="venue-pin-icon">📍</span>
              <div className="venue-meta">
                <strong className="venue-palace-name">The Royal Palace, Jagmandir Island</strong>
                <span className="venue-city">Lake Pichola, Udaipur, Rajasthan</span>
              </div>
            </div>

            {/* Live Countdown Clock */}
            {/* <div className="countdown-container">
              <span className="countdown-caption">COUNTDOWN TO SACRED VOWS</span>
              <div className="countdown-grid">
                <div className="countdown-tile">
                  <span className="countdown-number">{timeLeft.days}</span>
                  <span className="countdown-label">DAYS</span>
                </div>
                <span className="countdown-colon">:</span>
                <div className="countdown-tile">
                  <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="countdown-label">HOURS</span>
                </div>
                <span className="countdown-colon">:</span>
                <div className="countdown-tile">
                  <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="countdown-label">MINUTES</span>
                </div>
                <span className="countdown-colon">:</span>
                <div className="countdown-tile">
                  <span className="countdown-number highlight-sec">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="countdown-label">SECONDS</span>
                </div>
              </div>
            </div> */}

            {/* Celebration Actions */}
            <div className="revealed-action-buttons">
              <button
                type="button"
                className="btn-calendar-add"
                onClick={handleGoogleCalendar}
              >
                <span>📅 कैलेंडर में जोड़ें (Save Date)</span>
              </button>

              <button
                type="button"
                className="btn-celebrate-more"
                onClick={() => fireCelebrationShots(160)}
                title="Fire celebratory confetti & sparkles!"
              >
                <span>🎉 मंगल उत्सव मनाएं</span>
              </button>

              <button
                type="button"
                className="btn-scratch-again"
                onClick={handleResetCard}
                title="Cover foil and scratch again"
              >
                <span>↺ पुनः स्क्रैच करें</span>
              </button>
            </div>
          </div>

          {/* TOP LAYER: Interactive Gold Foil Scratch Canvas */}
          <canvas
            ref={canvasRef}
            className={`scratch-foil-canvas ${isScratching ? 'is-scratching' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-label="Interactive scratch card surface"
          />

          {/* Scratch Progress Pill (shown while scratching) */}
          {!isRevealed && scratchPercent > 0 && (
            <div className="scratch-progress-tag">
              <span>स्क्रैच प्रगति: {scratchPercent}%</span>
              <div className="mini-progress-bar">
                <div className="mini-progress-fill" style={{ width: `${Math.min(100, scratchPercent * 2.5)}%` }}></div>
              </div>
            </div>
          )}

          {/* Quick Instant Reveal Button (for accessibility) */}
          {!isRevealed && (
            <button
              type="button"
              className="quick-reveal-btn"
              onClick={triggerReveal}
              title="Click for instant reveal with celebratory shots"
            >
              <span>तुरंत दर्शन करें ✨</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
