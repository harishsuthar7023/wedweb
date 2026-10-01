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

  // Unified Scroll, Wheel, and Mobile Touch Handlers
  useEffect(() => {
    // 1. Mouse Wheel Handler for Desktop
    const handleWheel = (e) => {
      const isAtTop = window.scrollY < 15;

      if (isAtTop) {
        if (e.deltaY > 0) {
          // User is scrolling DOWN
          if (targetFrameRef.current < TOTAL_FRAMES - 1) {
            e.preventDefault();
            const absDelta = Math.abs(e.deltaY);
            const step = absDelta < 50 ? Math.max(0.6, absDelta * 0.08) : Math.min(7, Math.max(2, absDelta / 24));
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
            const step = absDelta < 50 ? Math.max(0.6, absDelta * 0.08) : Math.min(7, Math.max(2, absDelta / 24));
            targetFrameRef.current = Math.max(0, targetFrameRef.current - step);
          }
        }
      }
    };

    // 2. High-Performance Mobile Touch Gestures
    let lastTouchY = 0;
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const diffY = lastTouchY - currentY; // diffY > 0 means dragging up = scrolling DOWN
      lastTouchY = currentY;

      const isAtTop = window.scrollY < 15;

      if (isAtTop) {
        if (diffY > 0) {
          // Swiping UP (scrolling DOWN)
          if (targetFrameRef.current < TOTAL_FRAMES - 1) {
            if (e.cancelable) e.preventDefault();
            const step = Math.min(7, Math.max(0.8, (diffY / 10) * 1.5));
            targetFrameRef.current = Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + step);
          } else {
            // Last frame reached! Smoothly transition to next section without freezing touch
            triggerGalleryTransition();
          }
        } else if (diffY < 0) {
          // Swiping DOWN (scrolling UP)
          if (targetFrameRef.current > 0) {
            if (e.cancelable) e.preventDefault();
            const step = Math.min(7, Math.max(0.8, (Math.abs(diffY) / 10) * 1.5));
            targetFrameRef.current = Math.max(0, targetFrameRef.current - step);
          }
        }
      }
    };

    // 3. Keyboard Arrow Keys
    const handleKeyDown = (e) => {
      const isAtTop = window.scrollY < 15;
      if (!isAtTop) return;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        if (targetFrameRef.current < TOTAL_FRAMES - 1) {
          e.preventDefault();
          targetFrameRef.current = Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + 5);
        } else {
          triggerGalleryTransition();
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (targetFrameRef.current > 0) {
          e.preventDefault();
          targetFrameRef.current = Math.max(0, targetFrameRef.current - 5);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerGalleryTransition]);

  // Persistent 60fps/120fps Animation Loop with zero unused React re-renders
  useEffect(() => {
    let isRunning = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderLoop = () => {
      if (!isRunning) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      if (prefersReducedMotion) {
        currentFrameRef.current = target;
      } else {
        const delta = target - current;
        if (Math.abs(delta) < 0.005) {
          currentFrameRef.current = target;
        } else {
          currentFrameRef.current += delta * 0.22;
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
  }, [drawFrame, initialFrameLoaded, onProgressChange]);

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

