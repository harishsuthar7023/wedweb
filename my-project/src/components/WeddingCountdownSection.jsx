import React, { useState, useEffect } from 'react';

// Target Wedding Date: December 12, 2026 19:15:00 IST (Auspicious Godhuli Bela)
const WEDDING_TARGET_DATE = new Date('2026-12-12T19:15:00+05:30').getTime();

export default function WeddingCountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = WEDDING_TARGET_DATE - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleCalendar = () => {
    const title = encodeURIComponent("Shubh Vivah: Harish & Lavina");
    const details = encodeURIComponent(
      "Auspicious Wedding Ceremony (Godhuli Bela Muhurat: 07:15 PM) at The Royal Palace, Udaipur."
    );
    const location = encodeURIComponent("The Royal Palace, Jagmandir Island, Udaipur, Rajasthan");
    const dates = "20261212T134500Z/20261212T193000Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 3000);
  };

  return (
    <section
      id="countdown"
      className="royal-countdown-section relative w-full py-20 sm:py-24 px-4 sm:px-8 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center bg-transparent"
      aria-label="Auspicious Wedding Countdown"
    >
      {/* Subtle Sandstone Sunlight Beam Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(229, 190, 122, 0.15) 0%, transparent 50%, rgba(186, 98, 56, 0.1) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
        {/* Sacred Traditional Top Invocation */}
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full border border-[#d4a359]/40 bg-[#251a12]/80 backdrop-blur-md shadow-lg">
          <span className="text-[#e5be7a] text-sm">卐</span>
          <span className="font-serif text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#e5be7a] uppercase">
            || श्री गणेशाय नमः ||
          </span>
          <span className="text-[#e5be7a] text-sm">卐</span>
        </div>

        {/* Minimal Indian Regal Heading */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-[#faf6ed] drop-shadow-xl m-0">
            शुभ विवाह मुहूर्त
          </h2>
          {/* <p className="font-serif text-sm sm:text-base tracking-widest text-[#d4a359] uppercase m-0">
            Auspicious Wedding Countdown
          </p> */}
          <div className="flex items-center gap-3 mt-1">
            <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#d4a359]/60 to-transparent"></span>
            {/* <span className="text-[#ba6238] text-xs font-bold tracking-wider">
              12 दिसम्बर 2026 • गोधूलि बेला (सायं 07:15)
            </span> */}
            <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#d4a359]/60 to-transparent"></span>
          </div>
        </div>

        {/* 4 Regal Pillars / Countdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full max-w-2xl my-2">
          {/* Days */}
          <div className="countdown-card group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-[#d4a359]/30 bg-[#1c130d]/90 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#e5be7a]/60 hover:-translate-y-1">
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#d4a359]/60 rounded-tl"></div>
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#d4a359]/60 rounded-tr"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#d4a359]/60 rounded-bl"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#d4a359]/60 rounded-br"></div>

            <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#e5be7a] drop-shadow-md">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#faf6ed]/90 uppercase mt-1">
              दिन <span className="text-[#d4a359]/70 text-[10px] block sm:inline font-normal">DAYS</span>
            </span>
          </div>

          {/* Hours */}
          <div className="countdown-card group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-[#d4a359]/30 bg-[#1c130d]/90 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#e5be7a]/60 hover:-translate-y-1">
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#d4a359]/60 rounded-tl"></div>
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#d4a359]/60 rounded-tr"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#d4a359]/60 rounded-bl"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#d4a359]/60 rounded-br"></div>

            <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#e5be7a] drop-shadow-md">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#faf6ed]/90 uppercase mt-1">
              घंटे <span className="text-[#d4a359]/70 text-[10px] block sm:inline font-normal">HOURS</span>
            </span>
          </div>

          {/* Minutes */}
          <div className="countdown-card group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-[#d4a359]/30 bg-[#1c130d]/90 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#e5be7a]/60 hover:-translate-y-1">
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#d4a359]/60 rounded-tl"></div>
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#d4a359]/60 rounded-tr"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#d4a359]/60 rounded-bl"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#d4a359]/60 rounded-br"></div>

            <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#e5be7a] drop-shadow-md">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#faf6ed]/90 uppercase mt-1">
              मिनट <span className="text-[#d4a359]/70 text-[10px] block sm:inline font-normal">MINS</span>
            </span>
          </div>

          {/* Seconds */}
          <div className="countdown-card group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-[#ba6238]/40 bg-[#251710]/95 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#ba6238]/80 hover:-translate-y-1">
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#ba6238]/70 rounded-tl"></div>
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#ba6238]/70 rounded-tr"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#ba6238]/70 rounded-bl"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#ba6238]/70 rounded-br"></div>

            <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#f28e5b] drop-shadow-md animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#faf6ed]/90 uppercase mt-1">
              सेकंड <span className="text-[#f28e5b]/80 text-[10px] block sm:inline font-normal">SECS</span>
            </span>
          </div>
        </div>

        {/* Sacred Blessing Line */}
        <p className="font-serif italic text-xs sm:text-sm text-[#faf6ed]/75 max-w-lg leading-relaxed m-0">
          "मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः।<br />
          मंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥"
        </p>

        {/* Minimal Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-serif text-xs sm:text-sm font-bold tracking-wider text-[#140e0a] transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #ba6238 0%, #d4a359 50%, #e5be7a 100%)',
              boxShadow: '0 4px 20px rgba(212, 163, 89, 0.35)',
            }}
            onClick={handleGoogleCalendar}
            title="Add Muhurat to Calendar"
          >
            <span>📅</span>
            <span>कैलेंडर में जोड़ें (Save Muhurat)</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-serif text-xs sm:text-sm font-medium text-[#faf6ed] transition-all duration-300 hover:scale-105 border border-[#d4a359]/40 bg-[#251a12]/60 hover:border-[#e5be7a] cursor-pointer"
            onClick={handleSetReminder}
            title="Reminder notification"
          >
            <span>{reminderSet ? '✓ याद दिलाया जाएगा' : '🔔 मुहूर्त स्मरण (Set Reminder)'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
