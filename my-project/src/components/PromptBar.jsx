import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, DiceIcon, SparklesIcon } from './SocialIcons';

const SAMPLE_PROMPTS = [
  "A solitary wanderer seated among bioluminescent violet flora overlooking a neon horizon...",
  "Ethereal cyberpunk temple wrapped in cosmic starlight, volumetric lighting, 8k...",
  "Surreal dreamscape of floating amethyst monoliths in a midnight indigo sky...",
  "Cyber-samurai meditation chamber with glowing holographic cherry blossoms...",
  "Futuristic botanical greenhouse floating inside an interstellar nebula cloud..."
];

const PRESET_CHIPS = [
  { label: "Bioluminescent Meadow", prompt: "A contemplative cyber figure in a meadow of glowing blue flowers beneath a starry galaxy" },
  { label: "Neo-Tokyo Rain", prompt: "Neo-Tokyo cyberpunk alley drenched in violet rain with holographic neon reflections, 8k" },
  { label: "Cosmic Nebula", prompt: "An ethereal astronaut meditating inside a glowing purple celestial nebula with floating crystals" },
  { label: "Obsidian Temple", prompt: "A sleek black obsidian sci-fi sanctuary with orange energy conduits and dusk horizon" }
];

export default function PromptBar({ onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Subtle cycling placeholder when empty
  useEffect(() => {
    if (isFocused || prompt) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isFocused, prompt]);

  const handleRollDice = (e) => {
    e.preventDefault();
    const randomIndex = Math.floor(Math.random() * SAMPLE_PROMPTS.length);
    setPrompt(SAMPLE_PROMPTS[randomIndex]);
  };

  const handleSelectChip = (chipPrompt) => {
    setPrompt(chipPrompt);
    if (onGenerate) {
      onGenerate(chipPrompt);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPrompt = prompt.trim() || SAMPLE_PROMPTS[placeholderIndex];
    if (onGenerate) {
      onGenerate(finalPrompt);
    }
  };

  return (
    <div className="prompt-section-wrapper">
      {/* Pill Search / Input Form matching reference image layout */}
      <form 
        onSubmit={handleSubmit} 
        className={`prompt-bar-container ${isFocused ? 'is-focused' : ''}`}
      >
        <div className="prompt-input-left">
          <div className="prompt-spark-icon" aria-hidden="true">
            <SparklesIcon size={18} />
          </div>

          <input
            type="text"
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={SAMPLE_PROMPTS[placeholderIndex]}
            aria-label="Image prompt"
          />

          <button
            type="button"
            className="dice-random-btn"
            onClick={handleRollDice}
            title="Surprise me with a prompt"
            aria-label="Generate random prompt"
          >
            <DiceIcon size={16} />
          </button>
        </div>

        {/* Orange to Purple CTA Button requested by user */}
        <button 
          type="submit" 
          className="cta-button"
          aria-label="Start Creating"
        >
          <span className="cta-button-text">Start Creating</span>
          <span className="cta-button-icon">
            <ArrowRightIcon size={15} />
          </span>
          <span className="cta-button-shine" aria-hidden="true"></span>
        </button>
      </form>

      {/* Quick Prompt Suggestion Chips */}
      <div className="prompt-chips-row">
        <span className="chips-label">Try:</span>
        <div className="chips-scroll">
          {PRESET_CHIPS.map((chip, index) => (
            <button
              key={index}
              type="button"
              className="prompt-chip-btn"
              onClick={() => handleSelectChip(chip.prompt)}
            >
              <span>✦</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
