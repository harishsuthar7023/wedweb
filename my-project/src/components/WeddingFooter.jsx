import React, { useState } from 'react';

export default function WeddingFooter() {
  const [copiedHashtag, setCopiedHashtag] = useState(false);

  const weddingHashtag = '#HarishWedsLavina';

  const handleCopyHashtag = () => {
    navigator.clipboard.writeText(weddingHashtag);
    setCopiedHashtag(true);
    setTimeout(() => setCopiedHashtag(false), 2200);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openGoogleMaps = () => {
    const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Jagmandir+Island+Palace+Lake+Pichola+Udaipur+Rajasthan';
    window.open(mapsUrl, '_blank');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent('Namaste! Inquiring regarding Harish & Lavina Wedding at Udaipur.');
    window.open(`https://wa.me/919829054321?text=${text}`, '_blank');
  };

  return (
    <footer className="wedding-footer-section relative w-full text-slate-100 py-20 px-5 sm:px-8 md:px-12 overflow-hidden" id="contact" aria-label="Wedding Contacts and Location">
      {/* Ambient Deep Gold Glow */}
      <div className="footer-ambient-aura pointer-events-none" aria-hidden="true"></div>

      <div className="footer-main-container relative z-10 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-14">
        {/* Top Royal Crest & Blessing Header */}
        <div className="footer-top-crest flex flex-col items-center text-center gap-3.5">
          <div className="royal-monogram-emblem inline-flex items-center justify-center gap-2 w-16 h-16 sm:w-18 sm:h-18 rounded-full shadow-xl transition-all duration-300 hover:scale-105">
            <span className="monogram-letter font-serif text-xl sm:text-2xl font-bold text-amber-200">H</span>
            <span className="monogram-amp font-serif italic text-amber-300/80 text-base sm:text-lg">&amp;</span>
            <span className="monogram-letter font-serif text-xl sm:text-2xl font-bold text-amber-200">L</span>
          </div>

          <div className="footer-sanskrit-blessing inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-widest text-[#e5be7a] border border-[#d4a359]/30 bg-[#251a12]/80 uppercase">
            <span className="text-[#d4a359]">卐</span>
            <span className="font-serif">|| सादर सस्नेह निमंत्रण ||</span>
            <span className="text-[#d4a359]">卐</span>
          </div>

          <h2 className="footer-invitation-headline font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-[#faf6ed] drop-shadow-xl m-0">
            || पधारो म्हारे देश ||
          </h2>
          <p className="footer-invitation-subtitle text-xs sm:text-sm font-serif text-[#faf6ed]/75 max-w-xl leading-relaxed m-0">
            आपकी गरिमामयी उपस्थिति एवं पावन आशीर्वाद ही हमारे इस मांगलिक प्रसंग की शोभा बढ़ाएगा।
          </p>
        </div>

        {/* 4 Essential Wedding Columns Grid: Address, Contact/RSVP, Instagram, Travel Help */}
        <div className="wedding-essentials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Address & Location Card */}
          <div className="essential-card venue-card flex flex-col gap-4 rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="card-top-icon-wrap flex items-center gap-2.5">
              <span className="essential-icon text-xl">📍</span>
              <span className="card-kicker text-xs font-bold tracking-wider text-amber-400 uppercase">VENUE &amp; ADDRESS</span>
            </div>
            
            <h3 className="essential-title font-serif text-lg font-bold text-white leading-snug m-0">The Royal Palace, Jagmandir Island</h3>
            <p className="essential-address text-sm text-slate-300/80 leading-relaxed m-0">
              Lake Pichola, Udaipur, Rajasthan — 313001, India
            </p>

            <div className="venue-boat-note flex items-start gap-2 p-3 rounded-xl text-xs text-amber-200/90 leading-relaxed">
              <span className="boat-icon text-sm flex-shrink-0">⛵</span>
              <span>Exclusive royal boat transfers from <strong>Rameshwar Ghat</strong> every 15 mins.</span>
            </div>

            <button 
              type="button" 
              className="footer-action-btn maps-btn mt-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-md"
              onClick={openGoogleMaps}
            >
              <span>Get Directions on Maps</span>
              <span className="btn-arrow text-sm">↗</span>
            </button>
          </div>

          {/* 2. Contact & RSVP Card */}
          <div className="essential-card rsvp-card flex flex-col gap-4 rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="card-top-icon-wrap flex items-center gap-2.5">
              <span className="essential-icon text-xl">📞</span>
              <span className="card-kicker text-xs font-bold tracking-wider text-amber-400 uppercase">CONTACT &amp; RSVP</span>
            </div>

            <h3 className="essential-title font-serif text-lg font-bold text-white leading-snug m-0">Guest Coordination Helpline</h3>
            
            <div className="contact-hosts-list flex flex-col gap-2.5">
              <div className="contact-row flex flex-col gap-0.5">
                <span className="host-role text-[11px] font-semibold text-amber-400/80 uppercase tracking-wider">Groom's Family:</span>
                <a href="tel:+919829012345" className="contact-link font-medium text-sm text-white hover:text-amber-300 transition-colors">+91 98290 12345</a>
              </div>
              <div className="contact-row flex flex-col gap-0.5">
                <span className="host-role text-[11px] font-semibold text-amber-400/80 uppercase tracking-wider">Bride's Family:</span>
                <a href="tel:+919829067890" className="contact-link font-medium text-sm text-white hover:text-amber-300 transition-colors">+91 98290 67890</a>
              </div>
              <div className="contact-row flex flex-col gap-0.5">
                <span className="host-role text-[11px] font-semibold text-amber-400/80 uppercase tracking-wider">Email RSVP:</span>
                <a href="mailto:rsvp@harishlavina.wedding" className="contact-link email-link font-medium text-xs text-white hover:text-amber-300 transition-colors break-all">rsvp@harishlavina.wedding</a>
              </div>
            </div>

            <button 
              type="button" 
              className="footer-action-btn whatsapp-btn mt-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-md"
              onClick={openWhatsApp}
            >
              <span className="wa-icon text-sm">💬</span>
              <span>Chat on WhatsApp Helpline</span>
            </button>
          </div>

          {/* 3. Instagram & Wedding Hashtag Card */}
          <div className="essential-card insta-card flex flex-col gap-4 rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="card-top-icon-wrap flex items-center gap-2.5">
              <span className="essential-icon text-xl">📸</span>
              <span className="card-kicker text-xs font-bold tracking-wider text-amber-400 uppercase">INSTAGRAM &amp; SOCIAL</span>
            </div>

            <h3 className="essential-title font-serif text-lg font-bold text-white leading-snug m-0">Share Your Cherished Memories</h3>
            
            <div className="hashtag-box flex items-center justify-between gap-2 p-2 rounded-xl border border-amber-400/30 bg-white/5">
              <span className="hashtag-text font-bold text-sm text-amber-300 tracking-wide">{weddingHashtag}</span>
              <button 
                type="button" 
                className="copy-hashtag-btn px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide transition-colors"
                onClick={handleCopyHashtag}
                title="Copy wedding hashtag"
              >
                {copiedHashtag ? '✓ Copied!' : 'Copy 📋'}
              </button>
            </div>

            <p className="insta-guide-text text-xs text-slate-300/80 leading-relaxed m-0">
              Tag our official handle <strong>@HarishLavinaWedding</strong> in your stories &amp; posts to be featured in our royal wedding highlight reel!
            </p>

            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-action-btn insta-btn mt-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-md text-white no-underline"
            >
              <span>Follow on Instagram</span>
              <span className="btn-arrow text-sm">↗</span>
            </a>
          </div>

          {/* 4. Travel & Hospitality Concierge */}
          <div className="essential-card travel-card flex flex-col gap-4 rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="card-top-icon-wrap flex items-center gap-2.5">
              <span className="essential-icon text-xl">🛎️</span>
              <span className="card-kicker text-xs font-bold tracking-wider text-amber-400 uppercase">TRAVEL &amp; STAY</span>
            </div>

            <h3 className="essential-title font-serif text-lg font-bold text-white leading-snug m-0">Guest Hospitality Desk</h3>

            <div className="transit-info-list flex flex-col gap-2.5 text-xs text-slate-300/85">
              <div className="transit-item flex flex-col gap-0.5">
                <span className="transit-mode font-bold text-amber-300">✈️ Airport:</span>
                <span>Maharana Pratap Airport (UDR) — 38 km (~45 mins)</span>
              </div>
              <div className="transit-item flex flex-col gap-0.5">
                <span className="transit-mode font-bold text-amber-300">🚆 Railway:</span>
                <span>Udaipur City Railway Station — 4 km (~15 mins)</span>
              </div>
            </div>

            <div className="hotel-desk-pill p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-200/90 leading-relaxed">
              <span>Dedicated hotel check-in desks at Heritage Hotel Udaipur</span>
            </div>

            <a 
              href="tel:+919829099887" 
              className="footer-action-btn concierge-btn mt-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-md text-white no-underline"
            >
              <span>Call Hospitality Desk</span>
              <span className="btn-arrow text-sm">📞</span>
            </a>
          </div>
        </div>

        {/* Bottom Family Blessing Signature & Copyright */}
        <div className="footer-bottom-signature-bar flex flex-col items-center gap-6 pt-6 w-full">
          <div className="signature-ornament-line w-full max-w-md h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" aria-hidden="true"></div>

          <div className="family-blessing-names text-center flex flex-col gap-1.5">
            <span className="blessing-label text-[11px] font-bold tracking-[0.25em] text-[#d4a359] uppercase">
              दर्शनाभिलाषी एवं स्वागताकांक्षी
            </span>
            <h4 className="family-names-heading font-serif text-2xl sm:text-3xl font-bold text-[#faf6ed] tracking-wide drop-shadow-md m-0">
              समस्त शर्मा एवं अग्रवाल परिवार
            </h4>
            <p className="family-sub-blessing font-serif italic text-sm sm:text-base text-[#e5be7a]/85 m-0">
              "आपकी स्नेहिल उपस्थिति ही हमारा सबसे बड़ा उपहार एवं सौभाग्य है"
            </p>
          </div>

          <div className="footer-legal-row w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-[#d4a359]/20 pt-6">
            <p className="wedding-year-mark text-xs text-[#faf6ed]/60 m-0">
              © 2026 The Royal Wedding • <strong className="text-[#e5be7a] font-semibold">Harish &amp; Lavina</strong> • Udaipur, Rajasthan
            </p>

            {/* Back to Top Smooth Button */}
            <button 
              type="button" 
              className="back-to-top-btn inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-xs font-serif font-bold text-[#e5be7a] transition-all duration-300 hover:scale-105 border border-[#d4a359]/30 bg-[#251a12]/60 hover:border-[#e5be7a]"
              onClick={handleScrollToTop}
              title="Return to the beginning"
            >
              <span>शीर्ष पर जाएँ</span>
              <span className="top-arrow-icon text-sm">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
