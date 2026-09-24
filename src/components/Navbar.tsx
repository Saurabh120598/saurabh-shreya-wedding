import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

interface NavbarProps {
  petalRain: boolean;
  setPetalRain: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenRSVP: () => void;
}

export function Navbar({ petalRain, setPetalRain, onOpenRSVP }: NavbarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    weddingAudio.toggleMusic((playing) => setIsPlaying(playing));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-[0_4px_20px_rgba(253,242,242,0.6)] py-3'
          : 'bg-white/60 backdrop-blur-sm border-b border-rose-50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-serif font-medium tracking-tight text-stone-800 hover:text-rose-600 transition-colors"
        >
          Saurabh <span className="font-script text-rose-500 font-normal">&amp;</span> Shreya
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-stone-600">
          <a href="#scratch-invite" className="hover:text-rose-600 transition-colors">
            VIP Scratch Invite
          </a>
          <a href="#events" className="hover:text-rose-600 transition-colors">
            Ceremonies
          </a>
          <a href="#gallery" className="hover:text-rose-600 transition-colors">
            Moments Gallery
          </a>
          <a href="#story" className="hover:text-rose-600 transition-colors">
            Our Journey
          </a>
          <a href="#hotlines" className="hover:text-rose-600 transition-colors">
            Wedding Hotline
          </a>
          <a href="#guestbook" className="hover:text-rose-600 transition-colors">
            Guestbook
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Music player toggle */}
          <button
            type="button"
            onClick={toggleMusic}
            title={isPlaying ? 'Mute wedding melody' : 'Play soft wedding melody'}
            className="p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
            aria-label="Toggle wedding music"
          >
            {isPlaying ? (
              <span className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                <Volume2 className="w-4 h-4 animate-pulse text-rose-500" />
                <span className="hidden xl:inline text-[11px]">Music Playing</span>
              </span>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Petal rain toggle */}
          <button
            type="button"
            onClick={() => setPetalRain((p) => !p)}
            title={petalRain ? 'Hide falling petals' : 'Shower rose petals'}
            className={`p-2 rounded-full transition-colors ${
              petalRain ? 'text-rose-600 bg-rose-50' : 'text-stone-500 hover:text-rose-600 hover:bg-rose-50'
            }`}
            aria-label="Toggle flower petals"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* RSVP primary action button */}
          <button
            type="button"
            onClick={onOpenRSVP}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-full shadow-sm hover:shadow transition-all whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 fill-white/80" />
            <span>RSVP Now</span>
          </button>
        </div>
      </div>
    </header>
  );
}
