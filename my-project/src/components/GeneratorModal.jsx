import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './SocialIcons';

export default function GeneratorModal({ isOpen, onClose, initialPrompt }) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Analyzing semantic prompt...");
  const [aspectRatio, setAspectRatio] = useState("16:9");

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (!isOpen) {
      setIsGenerating(true);
      setProgress(0);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep("Analyzing prompt tokens...");

    const step1 = setTimeout(() => {
      setProgress(35);
      setCurrentStep("Diffusing latent neural fields...");
    }, 600);

    const step2 = setTimeout(() => {
      setProgress(75);
      setCurrentStep("Synthesizing 8K cinematic lighting & textures...");
    }, 1200);

    const step3 = setTimeout(() => {
      setProgress(100);
      setIsGenerating(false);
      setCurrentStep("Complete");
    }, 1800);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, [isOpen, prompt]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="generator-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">
              <SparklesIcon size={14} />
              <span>HARISH &amp; LAVI ENGINE V3.4</span>
            </span>
            <h3 className="modal-title">Neural Image Synthesis</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close generator"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Prompt Display */}
          <div className="modal-prompt-box">
            <span className="prompt-meta-label">ACTIVE PROMPT:</span>
            <p className="prompt-text-display">"{prompt || 'A dark futuristic world of glowing starlight...'}"</p>
          </div>

          {/* Generated Result or Loading State */}
          <div className="generation-display-stage">
            {isGenerating ? (
              <div className="generation-loading-state">
                <div className="synth-rings-loader">
                  <div className="ring r1"></div>
                  <div className="ring r2"></div>
                  <div className="ring r3"></div>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="synth-status-step">{currentStep}</p>
                <span className="synth-pct">{progress}%</span>
              </div>
            ) : (
              <div className="generation-result-state animate-fade-in">
                <img 
                  src="/hero-bg.jpg" 
                  alt="Generated visual" 
                  className="modal-result-img"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="result-watermark-tag">
                  <span>✦ HARISH &amp; LAVI 4K MASTER</span>
                </div>
              </div>
            )}
          </div>

          {/* Settings & Info Controls */}
          <div className="modal-controls-row">
            <div className="control-group">
              <span className="control-label">Aspect Ratio:</span>
              <div className="ratio-toggle-group">
                {["16:9", "1:1", "9:16"].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    className={`ratio-btn ${aspectRatio === ratio ? 'active' : ''}`}
                    onClick={() => setAspectRatio(ratio)}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">Model:</span>
              <span className="pill-engine-tag">NeuralFlux 3.4 Ultra</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="secondary-glass-btn"
            onClick={() => {
              navigator.clipboard?.writeText(prompt);
              alert("Prompt copied to clipboard!");
            }}
          >
            Copy Prompt
          </button>
          
          <button 
            type="button" 
            className="cta-button modal-generate-btn"
            onClick={() => {
              setIsGenerating(true);
              setProgress(0);
              setCurrentStep("Diffusing new variation...");
              setTimeout(() => setProgress(45), 500);
              setTimeout(() => setProgress(85), 1100);
              setTimeout(() => {
                setProgress(100);
                setIsGenerating(false);
              }, 1600);
            }}
          >
            <span>Generate Variation</span>
            <SparklesIcon size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
