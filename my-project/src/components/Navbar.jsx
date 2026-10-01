import React, { useState } from 'react';
import { InstagramIcon, LinkedInIcon, XIcon, SparklesIcon } from './SocialIcons';

export default function Navbar({ onOpenStudio }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-container">
      <nav className="navbar" aria-label="Main Navigation">
        {/* Brand / Logo */}
        <a href="#hero" className="brand-logo" aria-label="HARISH & LAVI Home">
          <div className="logo-symbol">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="12" r="6" stroke="url(#logo-grad-1)" strokeWidth="2.2" strokeOpacity="0.9" />
              <circle cx="15" cy="12" r="6" stroke="url(#logo-grad-2)" strokeWidth="2.2" strokeOpacity="0.9" />
              <circle cx="12" cy="12" r="2" fill="#ffffff" />
              <defs>
                <linearGradient id="logo-grad-1" x1="3" y1="6" x2="15" y2="18">
                  <stop stopColor="#ff6b35" />
                  <stop offset="1" stopColor="#9d2bf5" />
                </linearGradient>
                <linearGradient id="logo-grad-2" x1="9" y1="6" x2="21" y2="18">
                  <stop stopColor="#9d2bf5" />
                  <stop offset="1" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-title">HARISH &amp; LAVI</span>
        </a>

        {/* Center Nav Links (matching reference image Features, About, News, Docs layout) */}
        <div className="nav-links desktop-only">
          <a href="#features" className="nav-link">Features</a>
          <a href="#models" className="nav-link">Models</a>
          <a href="#showcase" className="nav-link">Showcase</a>
          <a href="#docs" className="nav-link">Docs</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>

        {/* Right Frosted Circular Social Icons & CTA */}
        <div className="nav-right desktop-only">
          <div className="social-pill-group">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="glass-circle-btn" 
              aria-label="Instagram"
              title="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="glass-circle-btn" 
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LinkedInIcon size={16} />
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noreferrer" 
              className="glass-circle-btn" 
              aria-label="X (formerly Twitter)"
              title="X"
            >
              <XIcon size={14} />
            </a>
          </div>

          <button 
            type="button" 
            className="nav-action-btn"
            onClick={onOpenStudio}
          >
            <span>Launch Studio</span>
            <SparklesIcon size={14} />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          type="button" 
          className="mobile-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in mobile-only">
          <div className="mobile-links">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#models" onClick={() => setMobileMenuOpen(false)}>Models</a>
            <a href="#showcase" onClick={() => setMobileMenuOpen(false)}>Showcase</a>
            <a href="#docs" onClick={() => setMobileMenuOpen(false)}>Docs</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          </div>

          <div className="mobile-bottom">
            <div className="mobile-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="glass-circle-btn">
                <InstagramIcon size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="glass-circle-btn">
                <LinkedInIcon size={16} />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="glass-circle-btn">
                <XIcon size={14} />
              </a>
            </div>
            <button 
              type="button" 
              className="mobile-cta-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStudio();
              }}
            >
              Launch Studio
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
