import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Sparkles, ArrowDown, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import couplePhoto1 from '../assets/images/couple_photo_1.png';
import couplePhoto2 from '../assets/images/couple_photo_2.png';
import couplePhoto3 from '../assets/images/couple_photo_3.png';

const HERO_PHOTOS = [
  { id: 0, src: couplePhoto1, label: 'Saurabh & Shreya' },
  { id: 1, src: couplePhoto2, label: 'Royal Celebrations' },
  { id: 2, src: couplePhoto3, label: 'Moments of Love' },
];

export function Hero({ onOpenRSVP }: { onOpenRSVP: () => void }) {
  // Wedding date: December 9, 2026
  const targetDate = new Date('2026-12-09T20:00:00+05:30').getTime();

  const [activePhoto, setActivePhoto] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleNextPhoto = () => {
    setActivePhoto((prev) => (prev + 1) % HERO_PHOTOS.length);
  };

  const handlePrevPhoto = () => {
    setActivePhoto((prev) => (prev - 1 + HERO_PHOTOS.length) % HERO_PHOTOS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextPhoto();
      } else {
        handlePrevPhoto();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFF5F5] via-[#FFFDF9] to-[#FFFDF9]">
      {/* Soft decorative background circles */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitles, Countdown & Actions */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
            {/* Cute top text badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-rose-200/80 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-medium text-rose-700 tracking-wide uppercase">
                Save Our Blessed Date
              </span>
            </div>

            {/* Couple Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-stone-900 leading-[1.1] tracking-tight">
                Saurabh <br />
                <span className="font-script text-rose-500 font-normal text-5xl sm:text-6xl md:text-7xl">
                  weds
                </span>{' '}
                Shreya
              </h1>
              <p className="text-stone-600 text-base sm:text-lg font-normal max-w-lg mx-auto lg:mx-0 pt-2 leading-relaxed">
                Two souls, two heartbeats, and a lifetime of endless giggles &amp; chai. We invite you with all our heart to celebrate our holy union and wedding festivities!
              </p>
            </div>

            {/* Date & Location marker */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-stone-700 pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50/70 border border-rose-100 rounded-lg">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span className="font-medium">December 2026</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/70 border border-amber-100 rounded-lg">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span className="font-medium">Lucknow</span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-2.5">
                Countdown to the Big Day
              </div>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto lg:mx-0">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Mins', value: timeLeft.minutes },
                  { label: 'Secs', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3.5 bg-white border border-rose-100 rounded-xl shadow-xs text-center relative overflow-hidden"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-900 tabular-nums">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider font-medium">
                      {item.label}
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-300 via-rose-400 to-amber-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-3">
              <a
                href="#scratch-invite"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all text-sm group"
              >
                <span>Scratch Secret Invitation</span>
                <Sparkles className="w-4 h-4 text-rose-200 group-hover:rotate-12 transition-transform" />
              </a>

              <button
                type="button"
                onClick={onOpenRSVP}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-rose-50/50 text-stone-800 border border-stone-200 hover:border-rose-300 font-medium rounded-full shadow-xs transition-all text-sm"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>RSVP</span>
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Multi-Photo Layered Stack Gallery */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div
              className="relative max-w-md w-full aspect-[4/5] flex items-center justify-center select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {HERO_PHOTOS.map((photo, index) => {
                const isActive = index === activePhoto;
                // Calculate position relative to active photo
                const diff = (index - activePhoto + HERO_PHOTOS.length) % HERO_PHOTOS.length;
                
                let transformStyle = '';
                let zIndex = 10;
                let opacity = 'opacity-80';

                if (diff === 0) {
                  // Front Active Card
                  transformStyle = 'translate-x-0 translate-y-0 rotate-0 scale-100';
                  zIndex = 30;
                  opacity = 'opacity-100';
                } else if (diff === 1) {
                  // Behind right peek
                  transformStyle = 'translate-x-4 sm:translate-x-6 translate-y-2 rotate-3 sm:rotate-4 scale-95';
                  zIndex = 20;
                  opacity = 'opacity-90';
                } else {
                  // Behind left peek
                  transformStyle = '-translate-x-4 sm:-translate-x-6 -translate-y-2 -rotate-3 sm:-rotate-4 scale-90';
                  zIndex = 10;
                  opacity = 'opacity-80';
                }

                return (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhoto(index)}
                    style={{ zIndex }}
                    className={`absolute inset-0 p-3 sm:p-4 bg-white rounded-3xl shadow-[0_16px_50px_rgba(244,114,182,0.18)] border border-rose-100 cursor-pointer transition-all duration-500 ease-out transform ${transformStyle} ${opacity} hover:opacity-100`}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-rose-50">
                      <img
                        src={photo.src}
                        alt={`Saurabh and Shreya wedding portrait ${index + 1}`}
                        className="w-full h-full object-cover object-top pointer-events-none"
                        referrerPolicy="no-referrer"
                      />

                      {/* Subtle warm glow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />

                      {/* Caption badge at bottom */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs sm:text-sm font-serif pointer-events-none">
                        <span className="bg-stone-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs">
                          {photo.label}
                        </span>
                        <span className="bg-rose-500/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-white" /> {index + 1} / {HERO_PHOTOS.length}
                        </span>
                      </div>
                    </div>

                    {/* Floating stamp on the active front card */}
                    {isActive && (
                      <div className="absolute -top-3 -right-2 sm:-right-3 bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm rotate-6 flex items-center gap-1 z-40">
                        ✨ Saurabh Weds Shreya
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Swipe/Click Controls */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md border border-rose-100 flex items-center justify-center transition-all"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md border border-rose-100 flex items-center justify-center transition-all"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Indicator Dots */}
            <div className="flex items-center gap-2 mt-4 z-20">
              {HERO_PHOTOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activePhoto === idx ? 'w-6 bg-rose-500' : 'w-2 bg-rose-200 hover:bg-rose-300'
                  }`}
                  aria-label={`Jump to photo ${idx + 1}`}
                />
              ))}
            </div>

            {/* Little anchor scroll prompt */}
            <div className="flex justify-center pt-3">
              <a
                href="#scratch-invite"
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 transition-colors"
              >
                <span>Scratch to reveal invitation pass</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
