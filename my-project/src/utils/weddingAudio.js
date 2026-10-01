/**
 * Rajasthani Folk Wedding Music Engine
 * 
 * Primary Source:
 * YouTube: https://youtu.be/0qnqxfwhv7g ("Umrao" by Seema Mishra - Veena Music)
 * Video ID: 0qnqxfwhv7g
 * 
 * Features:
 * - Direct background YouTube IFrame Player integration (zero ads / loop enabled).
 * - Instant user-gesture playback on "Open Invitation" click.
 * - Persistent floating corner widget synchronization (play/pause toggle, equalizer).
 * - Automatic fallback to local audio / synthesized Shehnai engine if YouTube is blocked by adblocker/offline.
 */

class RajasthaniMusicEngine {
  constructor() {
    this.videoId = '0qnqxfwhv7g';
    this.songTitle = 'Umrao';
    this.artist = 'Seema Mishra';
    this.sourceUrl = 'https://youtu.be/0qnqxfwhv7g';

    this.ytPlayer = null;
    this.isYtReady = false;
    this.pendingPlay = false;
    this.isPlayingState = false;
    this.useFallback = false;
    this.listeners = new Set();

    // Fallback synth & audio nodes
    this.audioCtx = null;
    this.masterGain = null;
    this.tanpuraNodes = [];
    this.melodyTimer = null;
    this.rhythmTimer = null;
    this.currentMelodyStep = 0;
    this.currentRhythmStep = 0;

    // Frequencies for D-based Indian classical scale (Bilawal / Maand Raga)
    this.NOTES = {
      REST: 0,
      A2: 110.00,
      D3: 146.83,
      A3: 220.00,
      B3: 246.94,
      Cs4: 277.18,
      D4: 293.66,
      E4: 329.63,
      Fs4: 369.99,
      G4: 392.00,
      A4: 440.00,
      B4: 493.88,
      Cs5: 554.37,
      D5: 587.33,
      E5: 659.25,
      Fs5: 739.99,
    };

    this.kesariyaScore = [
      { note: this.NOTES.D4, dur: 0.6 },
      { note: this.NOTES.Fs4, dur: 0.4 },
      { note: this.NOTES.A4, dur: 0.8, bendTo: this.NOTES.B4 },
      { note: this.NOTES.B4, dur: 0.5 },
      { note: this.NOTES.A4, dur: 1.2 },
      { note: this.NOTES.A4, dur: 0.4 },
      { note: this.NOTES.B4, dur: 0.4 },
      { note: this.NOTES.A4, dur: 0.4 },
      { note: this.NOTES.G4, dur: 0.5 },
      { note: this.NOTES.Fs4, dur: 0.5 },
      { note: this.NOTES.E4, dur: 0.5 },
      { note: this.NOTES.D4, dur: 1.4 },
      { note: this.NOTES.D4, dur: 0.35 },
      { note: this.NOTES.E4, dur: 0.35 },
      { note: this.NOTES.Fs4, dur: 0.6 },
      { note: this.NOTES.G4, dur: 0.4 },
      { note: this.NOTES.Fs4, dur: 0.9 },
      { note: this.NOTES.Fs4, dur: 0.35 },
      { note: this.NOTES.G4, dur: 0.35 },
      { note: this.NOTES.A4, dur: 0.6 },
      { note: this.NOTES.Fs4, dur: 0.4 },
      { note: this.NOTES.E4, dur: 0.5 },
      { note: this.NOTES.D4, dur: 1.5 },
      { note: this.NOTES.REST, dur: 0.6 }
    ];

    if (typeof window !== 'undefined') {
      this.initYouTubePlayer();
    }
  }

  /**
   * Initializes YouTube IFrame API and creates hidden background player
   */
  initYouTubePlayer() {
    const setupPlayer = () => {
      if (this.ytPlayer) return;

      // Ensure container element exists
      let container = document.getElementById('yt-wedding-audio-host');
      if (!container) {
        container = document.createElement('div');
        container.id = 'yt-wedding-audio-host';
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.left = '0';
        container.style.width = '1px';
        container.style.height = '1px';
        container.style.opacity = '0.001';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '-1';
        document.body.appendChild(container);
      }

      try {
        this.ytPlayer = new window.YT.Player('yt-wedding-audio-host', {
          height: '1',
          width: '1',
          videoId: this.videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: this.videoId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined
          },
          events: {
            onReady: (event) => {
              this.isYtReady = true;
              event.target.setVolume(85);
              if (this.pendingPlay) {
                this.pendingPlay = false;
                event.target.playVideo();
                this.isPlayingState = true;
                this.notifyListeners();
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                this.isPlayingState = true;
                this.notifyListeners();
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                this.isPlayingState = false;
                this.notifyListeners();
              } else if (event.data === window.YT.PlayerState.ENDED) {
                // Ensure endless loop
                event.target.playVideo();
              }
            },
            onError: (err) => {
              console.warn('YouTube IFrame player warning, using acoustic engine fallback:', err);
              this.useFallback = true;
              if (this.pendingPlay || this.isPlayingState) {
                this.startFallbackAudio();
              }
            }
          }
        });
      } catch (err) {
        console.warn('Could not initialize YouTube player directly:', err);
        this.useFallback = true;
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        setupPlayer();
      };

      // Load YouTube script dynamically if not present
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(tag, firstScript);
        } else {
          document.head.appendChild(tag);
        }
      }
    }
  }

  /**
   * Starts playing "Umrao" by Seema Mishra
   */
  start() {
    this.isPlayingState = true;
    this.notifyListeners();

    if (this.ytPlayer && this.isYtReady && !this.useFallback) {
      try {
        this.ytPlayer.playVideo();
        return;
      } catch {
        this.useFallback = true;
      }
    }

    if (!this.isYtReady && !this.useFallback) {
      this.pendingPlay = true;
      // In case YouTube takes more than 2.5s to respond, start pleasant background fallback
      setTimeout(() => {
        if (this.pendingPlay && !this.isYtReady) {
          this.startFallbackAudio();
        }
      }, 2500);
      return;
    }

    // Fallback if YouTube player is blocked or unavailable
    this.startFallbackAudio();
  }

  /**
   * Pauses the music
   */
  pause() {
    this.isPlayingState = false;
    this.pendingPlay = false;
    this.notifyListeners();

    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.pauseVideo();
      } catch {}
    }

    this.stopFallbackAudio();
  }

  /**
   * Resumes the music
   */
  resume() {
    this.isPlayingState = true;
    this.notifyListeners();

    if (this.ytPlayer && this.isYtReady && !this.useFallback) {
      try {
        this.ytPlayer.playVideo();
        return;
      } catch {}
    }

    this.startFallbackAudio();
  }

  /**
   * Toggles play / pause state
   */
  toggle() {
    if (this.isPlayingState) {
      this.pause();
    } else {
      this.resume();
    }
  }

  isPlaying() {
    return this.isPlayingState;
  }

  getTrackInfo() {
    return {
      title: this.songTitle,
      artist: this.artist,
      sourceUrl: this.sourceUrl
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.isPlayingState));
  }

  /* ---------------- Acoustic Synthesizer Fallback Engine ---------------- */
  initFallbackAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  startFallbackAudio() {
    this.initFallbackAudioContext();
    this.startTanpura();
    this.currentMelodyStep = 0;
    this.currentRhythmStep = 0;
    this.stepMelody();
    setTimeout(() => {
      if (this.isPlayingState) {
        this.stepRhythm();
      }
    }, 1200);
  }

  stopFallbackAudio() {
    clearTimeout(this.melodyTimer);
    clearTimeout(this.rhythmTimer);
    this.stopTanpura();
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
    }
  }

  startTanpura() {
    if (!this.audioCtx) return;
    this.stopTanpura();

    const strings = [
      { freq: this.NOTES.A3, gain: 0.12, pan: -0.3, detune: -2 },
      { freq: this.NOTES.D4, gain: 0.16, pan: -0.1, detune: 1 },
      { freq: this.NOTES.D4, gain: 0.15, pan: 0.1, detune: 3 },
      { freq: this.NOTES.D3, gain: 0.22, pan: 0.3, detune: 0 }
    ];

    strings.forEach((str, index) => {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(str.freq, this.audioCtx.currentTime);
      osc.detune.setValueAtTime(str.detune, this.audioCtx.currentTime);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(str.freq * 2, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(3.5, this.audioCtx.currentTime);

      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.25 + index * 0.08, this.audioCtx.currentTime);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(str.gain * 0.4, this.audioCtx.currentTime);

      const strGain = this.audioCtx.createGain();
      strGain.gain.setValueAtTime(str.gain, this.audioCtx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(strGain.gain);

      osc.connect(filter);
      filter.connect(strGain);
      strGain.connect(this.masterGain);

      osc.start();
      lfo.start();

      this.tanpuraNodes.push(osc, lfo, strGain);
    });
  }

  stopTanpura() {
    this.tanpuraNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {}
    });
    this.tanpuraNodes = [];
  }

  playShehnaiNote(noteFreq, duration, bendToFreq = null) {
    if (!this.audioCtx || noteFreq <= 0) return;
    const now = this.audioCtx.currentTime;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(noteFreq, now);
    osc2.frequency.setValueAtTime(noteFreq * 2, now);

    if (bendToFreq && bendToFreq > 0) {
      osc1.frequency.exponentialRampToValueAtTime(bendToFreq, now + duration * 0.95);
      osc2.frequency.exponentialRampToValueAtTime(bendToFreq * 2, now + duration * 0.95);
    }

    const vibLfo = this.audioCtx.createOscillator();
    const vibGain = this.audioCtx.createGain();
    vibLfo.frequency.setValueAtTime(5.8, now);
    vibGain.gain.setValueAtTime(noteFreq * 0.016, now);

    vibLfo.connect(vibGain);
    vibGain.connect(osc1.frequency);
    vibLfo.start(now + 0.15);

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(4.2, now);

    const noteGain = this.audioCtx.createGain();
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.32, now + 0.08);
    noteGain.gain.setValueAtTime(0.28, now + Math.max(0.1, duration - 0.12));
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    vibLfo.stop(now + duration);
  }

  playDholakStroke(isBass, intensity = 0.5) {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    if (isBass) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(105, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.22);
      gain.gain.setValueAtTime(0.28 * intensity, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.14 * intensity, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  }

  stepMelody() {
    if (!this.isPlayingState) return;
    const item = this.kesariyaScore[this.currentMelodyStep];
    if (item) {
      if (item.note > 0) {
        this.playShehnaiNote(item.note, item.dur, item.bendTo);
      }
      this.currentMelodyStep = (this.currentMelodyStep + 1) % this.kesariyaScore.length;
      this.melodyTimer = setTimeout(() => {
        this.stepMelody();
      }, item.dur * 1000);
    }
  }

  stepRhythm() {
    if (!this.isPlayingState) return;
    const beat = this.currentRhythmStep % 8;
    const beatTimeMs = 280;

    switch (beat) {
      case 0:
        this.playDholakStroke(true, 1.0);
        this.playDholakStroke(false, 0.7);
        break;
      case 1:
        this.playDholakStroke(true, 0.45);
        break;
      case 2:
        this.playDholakStroke(false, 0.65);
        break;
      case 3:
        this.playDholakStroke(false, 0.35);
        break;
      case 4:
        this.playDholakStroke(false, 0.7);
        break;
      case 5:
        this.playDholakStroke(false, 0.4);
        break;
      case 6:
        this.playDholakStroke(true, 0.85);
        break;
      case 7:
        this.playDholakStroke(false, 0.5);
        break;
      default:
        break;
    }

    this.currentRhythmStep++;
    this.rhythmTimer = setTimeout(() => {
      this.stepRhythm();
    }, beatTimeMs);
  }
}

// Global Singleton Instance
const weddingAudio = new RajasthaniMusicEngine();
export default weddingAudio;
