import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 160;

// Format frame URL: /frames/ezgif-frame-001.jpg to /frames/ezgif-frame-120.jpg
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
  const rafIdRef = useRef(null);
  const hasAutoTransitionedRef = useRef(false);
  const autoScrollTimerRef = useRef(null);
  const extraScrollsRef = useRef(0);

  const dimensionsRef = useRef({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
  });

  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);
  const [currentDisplayFrame, setCurrentDisplayFrame] = useState(1);

  // Progressive preloader
  useEffect(() => {
    let isCancelled = false;
    const images = imagesRef.current;
    const loadedFlags = loadedFlagsRef.current;

    // Load a single frame and mark it
    const loadFrame = (index) => {
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
          if (index === 0) {
            setInitialFrameLoaded(true);
          }
          resolve(img);
        };

        img.onerror = () => {
          resolve(null);
        };
      });
    };

    // Priority 1: Load frame 0 immediately for instant render
    loadFrame(0).then(() => {
      if (isCancelled) return;

      // Priority 2: Preload initial frames (1-20) and keyframes across the sequence
      const priorityIndices = [];
      for (let i = 1; i <= 20; i++) priorityIndices.push(i);
      for (let i = 25; i < TOTAL_FRAMES; i += 4) priorityIndices.push(i);

      Promise.all(priorityIndices.map(loadFrame)).then(() => {
        if (isCancelled) return;

        // Priority 3: Progressively preload remaining frames in batches
        const remainingIndices = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!loadedFlags[i]) remainingIndices.push(i);
        }

        let batchIdx = 0;
        const batchSize = 8;

        const loadNextBatch = () => {
          if (isCancelled || batchIdx >= remainingIndices.length) return;
          const currentBatch = remainingIndices.slice(batchIdx, batchIdx + batchSize);
          batchIdx += batchSize;

          Promise.all(currentBatch.map(loadFrame)).then(() => {
            if (!isCancelled) {
              if (window.requestIdleCallback) {
                window.requestIdleCallback(loadNextBatch, { timeout: 100 });
              } else {
                setTimeout(loadNextBatch, 25);
              }
            }
          });
        };

        loadNextBatch();
      });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Find nearest loaded frame to guarantee zero flicker
  const getRenderableImage = useCallback((targetIndex) => {
    const images = imagesRef.current;
    const loaded = loadedFlagsRef.current;

    if (loaded[targetIndex] && images[targetIndex]) {
      return images[targetIndex];
    }

    // Scan backwards and forwards for closest available frame
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 0 && loaded[prev] && images[prev]) {
        return images[prev];
      }
      const next = targetIndex + offset;
      if (next < TOTAL_FRAMES && loaded[next] && images[next]) {
        return images[next];
      }
    }

    return images[0] || null;
  }, []);

  // Draw image on canvas with high-DPR "cover" aspect ratio
  const drawFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getRenderableImage(frameIdx);
    if (!img || !img.naturalWidth) return;

    const { width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    // Cover logic
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scale = Math.max(width / imgWidth, height / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const dx = (width - drawWidth) / 2;
    const dy = (height - drawHeight) / 2;

    ctx.clearRect(0, 0, width, height);

    // Deep haveli teakwood base matching global palette
    ctx.fillStyle = '#140e0a';
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    lastDrawnIndexRef.current = frameIdx;
  }, [getRenderableImage]);

  // Handle Resize and Retina DPR
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
      ctx.imageSmoothingQuality = 'high';
    }

    drawFrame(Math.round(currentFrameRef.current));
  }, [drawFrame]);

  // Setup Resize Listener
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const isTransitioningRef = useRef(false);

  // Smooth transition to next section (Wedding Countdown or Gallery)
  const triggerGalleryTransition = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
    isTransitioningRef.current = true;
    const targetElement = document.getElementById('countdown') || document.getElementById('gallery');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 850);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  }, [onAnimationComplete]);

  // Unified Scroll, Wheel, Touch, and Keyboard Listeners
  useEffect(() => {
    // 1. Direct Wheel Handler: locks hero until 120 frames finish + 2 EXTRA SCROLLS headroom
    const handleWheel = (e) => {
      if (isTransitioningRef.current) return;
      const isAtTop = window.scrollY < 20;

      if (isAtTop) {
        if (e.deltaY > 0) {
          // User is scrolling DOWN
          if (targetFrameRef.current < TOTAL_FRAMES - 1) {
            e.preventDefault();

            // Smooth step for trackpads, brisk for mouse wheels
            const absDelta = Math.abs(e.deltaY);
            let step;
            if (absDelta < 50) {
              step = Math.max(0.4, absDelta * 0.08);
            } else {
              step = Math.min(8, Math.max(2.5, absDelta / 28));
            }

            const next = Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + step);
            targetFrameRef.current = next;
          } else {
            // Sequence completed at 100%! User explicitly requested 2 extra scrolls before transitioning
            e.preventDefault();
            extraScrollsRef.current += 1;
            if (extraScrollsRef.current >= 2) {
              triggerGalleryTransition();
            }
          }
        } else if (e.deltaY < 0) {
          // User is scrolling UP
          if (extraScrollsRef.current > 0) {
            e.preventDefault();
            extraScrollsRef.current -= 1;
          } else if (targetFrameRef.current > 0) {
            e.preventDefault();
            const absDelta = Math.abs(e.deltaY);
            let step;
            if (absDelta < 50) {
              step = Math.max(0.4, absDelta * 0.08);
            } else {
              step = Math.min(8, Math.max(2.5, absDelta / 28));
            }

            targetFrameRef.current = Math.max(0, targetFrameRef.current - step);
          }
        }
      }
    };

    // 2. Touch gesture handler for mobile
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (isTransitioningRef.current) return;
      const isAtTop = window.scrollY < 20;
      if (!isAtTop || !e.touches || e.touches.length === 0) return;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY; // diffY > 0 means dragging up = scrolling DOWN

      if (diffY > 0) {
        if (targetFrameRef.current < TOTAL_FRAMES - 1) {
          if (e.cancelable) e.preventDefault();
          touchStartY = currentY;
          const step = Math.min(6, Math.max(0.8, (diffY / 18) * 1.5));
          const next = Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + step);
          targetFrameRef.current = next;
        } else {
          // Reached end, require 2 extra swipe gestures
          if (e.cancelable) e.preventDefault();
          touchStartY = currentY;
          extraScrollsRef.current += 1;
          if (extraScrollsRef.current >= 2) {
            triggerGalleryTransition();
          }
        }
      } else if (diffY < 0) {
        if (extraScrollsRef.current > 0) {
          if (e.cancelable) e.preventDefault();
          touchStartY = currentY;
          extraScrollsRef.current -= 1;
        } else if (targetFrameRef.current > 0) {
          if (e.cancelable) e.preventDefault();
          touchStartY = currentY;
          const step = Math.min(6, Math.max(0.8, (Math.abs(diffY) / 18) * 1.5));
          targetFrameRef.current = Math.max(0, targetFrameRef.current - step);
        }
      }
    };

    // 3. Keyboard Arrow Keys
    const handleKeyDown = (e) => {
      if (isTransitioningRef.current) return;
      const isAtTop = window.scrollY < 20;
      if (!isAtTop) return;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        if (targetFrameRef.current < TOTAL_FRAMES - 1) {
          e.preventDefault();
          const next = Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + 5);
          targetFrameRef.current = next;
        } else {
          e.preventDefault();
          extraScrollsRef.current += 1;
          if (extraScrollsRef.current >= 2) {
            triggerGalleryTransition();
          }
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (extraScrollsRef.current > 0) {
          e.preventDefault();
          extraScrollsRef.current -= 1;
        } else if (targetFrameRef.current > 0) {
          e.preventDefault();
          targetFrameRef.current = Math.max(0, targetFrameRef.current - 5);
        }
      }
    };

    // 4. Scroll listener for scrollbar drag or fast manual scrolling
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.4) {
        if (targetFrameRef.current < TOTAL_FRAMES - 1) {
          targetFrameRef.current = TOTAL_FRAMES - 1;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [triggerGalleryTransition]);

  // Persistent Animation Loop using requestAnimationFrame with smooth interpolation
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
        // Butter-smooth lerp interpolation: 0.16 gives Apple-level momentum
        const delta = target - current;
        if (Math.abs(delta) < 0.005) {
          currentFrameRef.current = target;
        } else {
          currentFrameRef.current += delta * 0.20;
        }
      }

      const frameToDraw = Math.round(currentFrameRef.current);

      if (frameToDraw !== lastDrawnIndexRef.current || !initialFrameLoaded) {
        drawFrame(frameToDraw);
        setCurrentDisplayFrame(frameToDraw + 1);
        if (onProgressChange) {
          onProgressChange(frameToDraw / (TOTAL_FRAMES - 1), frameToDraw);
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
  }, [drawFrame, initialFrameLoaded]);

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
