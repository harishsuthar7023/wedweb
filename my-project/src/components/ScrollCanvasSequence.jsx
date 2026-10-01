import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 160;

// Format frame URL: /frames/ezgif-frame-001.jpg to /frames/ezgif-frame-160.jpg
const getFrameUrl = (index) => {
  const frameNumber = String(index + 1).padStart(3, '0');
  return `/frames/ezgif-frame-${frameNumber}.jpg`;
};

export default function ScrollCanvasSequence({ containerRef, onProgressChange, onAnimationComplete }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null));
  const loadedFlagsRef = useRef(new Array(TOTAL_FRAMES).fill(false));
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastDrawnIndexRef = useRef(-1);
  const lastProgressRef = useRef(-1);
  const rafIdRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const momentumVelocityRef = useRef(0);

  const dimensionsRef = useRef({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
  });

  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);

  // High-Speed Progressive Preloader Optimized for Cloud/Render CDNs
  useEffect(() => {
    let isCancelled = false;
    const images = imagesRef.current;
    const loadedFlags = loadedFlagsRef.current;

    const loadSingleFrame = (index) => {
      if (images[index] && loadedFlags[index]) return Promise.resolve(images[index]);

      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(index);
        img.decoding = 'async';

        if (img.complete && img.naturalWidth > 0) {
          images[index] = img;
          loadedFlags[index] = true;
          if (index === 0) setInitialFrameLoaded(true);
          resolve(img);
          return;
        }

        img.onload = () => {
          if (isCancelled) return;
          images[index] = img;
          loadedFlags[index] = true;
          if (index === 0) setInitialFrameLoaded(true);
          resolve(img);
        };

        img.onerror = () => resolve(null);
      });
    };

    // 1. Immediately load frame 0 for instant visual display
    loadSingleFrame(0).then(() => {
      if (isCancelled) return;

      // 2. Preload first 25 frames and keyframe anchors (every 4th frame across the sequence)
      const priorityQueue = [];
      for (let i = 1; i <= 25 && i < TOTAL_FRAMES; i++) priorityQueue.push(i);
      for (let i = 28; i < TOTAL_FRAMES; i += 4) priorityQueue.push(i);

      Promise.all(priorityQueue.map(loadSingleFrame)).then(() => {
        if (isCancelled) return;

        // 3. Fast concurrent pool for all remaining frames
        const remaining = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!loadedFlags[i]) remaining.push(i);
        }

        let idx = 0;
        const CONCURRENCY = 8;
        const loadNextInPool = () => {
          if (isCancelled || idx >= remaining.length) return;
          const currentIdx = remaining[idx++];
          loadSingleFrame(currentIdx).then(() => {
            if (!isCancelled) loadNextInPool();
          });
        };

        for (let c = 0; c < CONCURRENCY && c < remaining.length; c++) {
          loadNextInPool();
        }
      });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Find nearest loaded frame to guarantee zero flicker / blank frames
  const getRenderableImage = useCallback((targetIndex) => {
    const images = imagesRef.current;
    const loaded = loadedFlagsRef.current;

    if (loaded[targetIndex] && images[targetIndex]) {
      return images[targetIndex];
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 0 && loaded[prev] && images[prev]) return images[prev];
      const next = targetIndex + offset;
      if (next < TOTAL_FRAMES && loaded[next] && images[next]) return images[next];
    }

    return images[0] || null;
  }, []);

  // Draw image on canvas with high-DPR "cover" aspect ratio and minimal raster operations
  const drawFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getRenderableImage(frameIdx);
    if (!img || !img.naturalWidth) return;

    const { width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scale = Math.max(width / imgWidth, height / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const dx = (width - drawWidth) / 2;
    const dy = (height - drawHeight) / 2;

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    lastDrawnIndexRef.current = frameIdx;
  }, [getRenderableImage]);

  // Handle Resize and DPR
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    dimensionsRef.current = { width, height, dpr };

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
    }

    drawFrame(Math.round(currentFrameRef.current));
  }, [drawFrame]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Butter-Smooth Glide into Next Section (Countdown or Gallery)
  const triggerGalleryTransition = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    momentumVelocityRef.current = 0;

    const targetElement = document.getElementById('countdown') || document.getElementById('gallery');
    if (targetElement) {
      const topOffset = targetElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 900);

    if (onAnimationComplete) {
      onAnimationComplete();
    }
  }, [onAnimationComplete]);

  // Unified Scroll, Wheel, and Kinetic Touch Momentum Handlers
  useEffect(() => {
    // 1. Mouse Wheel Handler for Desktop
    const handleWheel = (e) => {
      const isHeroInView = window.scrollY < window.innerHeight * 0.6;

      if (isHeroInView) {
        if (e.deltaY > 0) {
          // User is scrolling DOWN
          if (targetFrameRef.current < TOTAL_FRAMES - 1) {
            e.preventDefault();
            const absDelta = Math.abs(e.deltaY);
            const step = absDelta < 50 ? Math.max(1.2, absDelta * 0.14) : Math.min(10, Math.max(3, absDelta / 16));
            targetFrameRef.current = Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + step);
          } else {
            // Sequence completed at 100%! Seamlessly glide to countdown section
            triggerGalleryTransition();
          }
        } else if (e.deltaY < 0) {
          // User is scrolling UP
          if (targetFrameRef.current > 0) {
            e.preventDefault();
            const absDelta = Math.abs(e.deltaY);
            const step = absDelta < 50 ? Math.max(1.2, absDelta * 0.14) : Math.min(10, Math.max(3, absDelta / 16));
            targetFrameRef.current = Math.max(0, targetFrameRef.current - step);
          }
        }
      }
    };

    // 2. Mobile Kinetic Touch Momentum Engine (Naturally Smooth 1-to-2 Swipe Completion)
    let touchPrevY = 0;
    let touchPrevTime = 0;
    let currentVelocity = 0; // px per ms
    let isTouchingHero = false;

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchPrevY = e.touches[0].clientY;
        touchPrevTime = performance.now();
        currentVelocity = 0;
        momentumVelocityRef.current = 0; // Halt any coasting immediately on new touch

        const isHeroInView = window.scrollY < window.innerHeight * 0.6;
        isTouchingHero = isHeroInView;
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouchingHero || !e.touches || e.touches.length === 0) return;
      const isHeroInView = window.scrollY < window.innerHeight * 0.6;
      if (!isHeroInView) return;

      const currentY = e.touches[0].clientY;
      const currentTime = performance.now();
      const dt = Math.max(8, currentTime - touchPrevTime);
      const dy = touchPrevY - currentY; // dy > 0 means finger dragged UP (advancing sequence)

      currentVelocity = dy / dt; // Velocity in pixels / ms
      touchPrevY = currentY;
      touchPrevTime = currentTime;

      if (e.cancelable) {
        e.preventDefault();
      }

      // Natural direct sensitivity: ~180px finger swipe naturally sweeps through ~85 frames
      const step = dy * 0.62;
      const nextTarget = Math.min(TOTAL_FRAMES - 1, Math.max(0, targetFrameRef.current + step));
      targetFrameRef.current = nextTarget;

      // If dragged past end, glide to next section
      if (targetFrameRef.current >= TOTAL_FRAMES - 1 && dy > 4) {
        triggerGalleryTransition();
      }
    };

    const handleTouchEnd = () => {
      if (!isTouchingHero) return;
      isTouchingHero = false;

      // Kinetic Inertia: If user flicked their finger with speed, carry sequence forward with natural momentum
      if (Math.abs(currentVelocity) > 0.12) {
        // Boost initial momentum velocity based on flick speed
        momentumVelocityRef.current = Math.min(14, Math.max(-14, currentVelocity * 10));
      } else if (targetFrameRef.current >= TOTAL_FRAMES - 1) {
        triggerGalleryTransition();
      }
    };

    // 3. Keyboard Arrow Keys
    const handleKeyDown = (e) => {
      const isHeroInView = window.scrollY < window.innerHeight * 0.6;
      if (!isHeroInView) return;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        if (targetFrameRef.current < TOTAL_FRAMES - 1) {
          e.preventDefault();
          targetFrameRef.current = Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + 8);
        } else {
          triggerGalleryTransition();
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (targetFrameRef.current > 0) {
          e.preventDefault();
          targetFrameRef.current = Math.max(0, targetFrameRef.current - 8);
        }
      }
    };

    const canvasEl = canvasRef.current;
    const containerEl = containerRef?.current;

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Multi-target touch attachment ensures 100% event capture across all mobile screen areas
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    if (canvasEl) {
      canvasEl.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvasEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    if (containerEl) {
      containerEl.addEventListener('touchstart', handleTouchStart, { passive: false });
      containerEl.addEventListener('touchmove', handleTouchMove, { passive: false });
      containerEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (canvasEl) {
        canvasEl.removeEventListener('touchstart', handleTouchStart);
        canvasEl.removeEventListener('touchmove', handleTouchMove);
        canvasEl.removeEventListener('touchend', handleTouchEnd);
      }
      if (containerEl) {
        containerEl.removeEventListener('touchstart', handleTouchStart);
        containerEl.removeEventListener('touchmove', handleTouchMove);
        containerEl.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [containerRef, triggerGalleryTransition]);

  // Persistent 60fps/120fps Animation Loop with kinetic momentum decay
  useEffect(() => {
    let isRunning = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderLoop = () => {
      if (!isRunning) return;

      // Apply kinetic fling momentum deceleration (Apple/Android style coasting)
      if (Math.abs(momentumVelocityRef.current) > 0.05) {
        targetFrameRef.current = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, targetFrameRef.current + momentumVelocityRef.current)
        );
        momentumVelocityRef.current *= 0.91; // Silky smooth natural friction decay

        if (targetFrameRef.current >= TOTAL_FRAMES - 1) {
          momentumVelocityRef.current = 0;
          triggerGalleryTransition();
        }
      }

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      if (prefersReducedMotion) {
        currentFrameRef.current = target;
      } else {
        const delta = target - current;
        if (Math.abs(delta) < 0.005) {
          currentFrameRef.current = target;
        } else {
          // Liquid butter-smooth interpolation: 0.18 provides cinematic weight
          currentFrameRef.current += delta * 0.18;
        }
      }

      const frameToDraw = Math.round(currentFrameRef.current);

      if (frameToDraw !== lastDrawnIndexRef.current || !initialFrameLoaded) {
        drawFrame(frameToDraw);

        // Throttle React progress updates to save main-thread compute
        const progress = frameToDraw / (TOTAL_FRAMES - 1);
        if (Math.abs(progress - lastProgressRef.current) >= 0.006) {
          lastProgressRef.current = progress;
          if (onProgressChange) {
            onProgressChange(progress, frameToDraw);
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawFrame, initialFrameLoaded, onProgressChange, triggerGalleryTransition]);

  return (
    <div className="scroll-canvas-sticky-wrapper" aria-hidden="true">
      {/* Pinned HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="scroll-sequence-canvas"
      />

      {/* Cinematic Deep Gold / Dark Luxury Vignette & Atmospheric Overlay */}
      <div className="canvas-luxury-vignette"></div>
      <div className="canvas-gold-glow"></div>
      <div className="canvas-bottom-seamless-gradient"></div>
    </div>
  );
}

