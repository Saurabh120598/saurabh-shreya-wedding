import { Heart, Sparkles, MapPin, Calendar } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 md:py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-stone-800">
          
          {/* Brand & Names */}
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-wide">
              Saurabh <span className="font-script text-rose-400 text-3xl font-normal">&amp;</span> Shreya
            </h3>
            <p className="text-xs text-stone-400 max-w-sm">
              Celebrating our eternal union of love, friendship, and family blessings.
            </p>
            <div className="inline-block px-3 py-1 bg-rose-950/60 border border-rose-800/60 rounded-full text-rose-300 text-xs font-mono font-medium">
              #SaurabhKiShreya · #SaurabhWedsShreya
            </div>
          </div>

          {/* Key Dates & Venue */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-xs text-stone-400 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>December 8–9, 2026</span>
            </div>
            <span className="hidden sm:inline text-stone-700">·</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Bundigarh Resort, Shaheed Path, Lucknow</span>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <p className="flex items-center justify-center gap-1.5">
            <span>Crafted with infinite love for Saurabh Srivastava &amp; Shreya</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>

          <div className="flex items-center gap-4 text-xs">
            <a href="#scratch-invite" className="hover:text-rose-400 transition-colors">
              VIP Pass
            </a>
            <a href="#events" className="hover:text-rose-400 transition-colors">
              Ceremonies
            </a>
            <a href="#gallery" className="hover:text-rose-400 transition-colors">
              Gallery
            </a>
            <a href="#hotlines" className="hover:text-rose-400 transition-colors">
              Hotlines
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
