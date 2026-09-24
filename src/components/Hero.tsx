import { useState, useEffect } from 'react';
import { Calendar, MapPin, Sparkles, ArrowDown, Heart } from 'lucide-react';
import heroCoupleImg from '../assets/images/hero_couple_1790261249180.jpg';

export function Hero({ onOpenRSVP }: { onOpenRSVP: () => void }) {
  // Wedding date: December 9, 2026
  const targetDate = new Date('2026-12-09T20:00:00+05:30').getTime();

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
                <span className="font-medium">December 09, 2026</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/70 border border-amber-100 rounded-lg">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span className="font-medium">Bundigarh Resort, Lucknow</span>
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
                <span>Send Blessings &amp; RSVP</span>
              </button>
            </div>

          </div>

          {/* Right Column: Hero Portrait Frame with Cute Accents */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative max-w-md w-full">
              
              {/* Outer decorative polaroid / floral frame */}
              <div className="relative p-3.5 sm:p-4 bg-white rounded-3xl shadow-[0_12px_40px_rgba(244,114,182,0.12)] border border-rose-100 rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-rose-50">
                  <img
                    src={heroCoupleImg}
                    alt="Saurabh and Shreya wedding celebration portrait"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle warm glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />

                  {/* Caption badge at bottom */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs sm:text-sm font-serif">
                    <span className="bg-stone-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      Saurabh Srivastava &amp; Shreya
                    </span>
                    <span className="bg-rose-500/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-sans font-medium flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-white" /> Forever &amp; Always
                    </span>
                  </div>
                </div>

                {/* Floating cute stamp badges */}
                <div className="absolute -top-3 -right-3 bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm rotate-6 flex items-center gap-1">
                  ✨ Saurabh Weds Shreya
                </div>
              </div>

              {/* Little anchor scroll prompt */}
              <div className="flex justify-center pt-4">
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
      </div>
    </section>
  );
}
