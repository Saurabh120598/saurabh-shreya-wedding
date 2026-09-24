import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  QrCode,
  Download,
  Calendar,
  Share2,
  Check,
  RefreshCw,
  MapPin,
  Clock,
  Shirt,
  Heart,
  PartyPopper,
} from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

export function ScratchInviteCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratchedOff, setIsScratchedOff] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize and paint scratch card canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // High DPI sizing
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 420;
    const height = rect.height || 460;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Reset composite operation to paint initial foil
    ctx.globalCompositeOperation = 'source-over';

    // Rich Rose Gold & Champagne gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#F5D0C5');
    grad.addColorStop(0.3, '#E6B8AA');
    grad.addColorStop(0.5, '#FCE8E2');
    grad.addColorStop(0.7, '#D4A396');
    grad.addColorStop(1, '#F3C5BA');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle gold shimmer speckles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Foil text instructions
    ctx.fillStyle = '#6B4035';
    ctx.textAlign = 'center';

    ctx.font = 'bold 22px serif';
    ctx.fillText('✨ SECRET WEDDING PASS ✨', width / 2, height / 2 - 40);

    ctx.font = 'italic 16px sans-serif';
    ctx.fillStyle = '#7C493D';
    ctx.fillText('Saurabh Srivastava & Shreya', width / 2, height / 2 - 10);

    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#8B483B';
    ctx.fillText('🖐️ Rub or Scratch with Finger / Mouse', width / 2, height / 2 + 35);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#9C584B';
    ctx.fillText('Scratch here to unlock your VIP QR Invitation!', width / 2, height / 2 + 65);

    setIsScratchedOff(false);
    setScratchPercent(0);
  }, []);

  useEffect(() => {
    // Delay slightly so layout rect is accurate
    const timer = setTimeout(() => {
      initCanvas();
    }, 100);

    const handleResize = () => {
      if (!isScratchedOff) {
        initCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [initCanvas, isScratchedOff]);

  // Scratch action
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchedOff) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    weddingAudio.playScratchSound();

    // Sample percentage every few strokes
    if (Math.random() > 0.4) {
      checkScratchPercentage();
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchedOff) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    // Downsample for fast check
    const sampleStep = 16;
    let transparentCount = 0;
    let totalSamples = 0;

    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          const index = (y * width + x) * 4 + 3; // Alpha channel
          if (data[index] < 128) {
            transparentCount++;
          }
          totalSamples++;
        }
      }

      const percent = Math.min(100, Math.round((transparentCount / totalSamples) * 100));
      setScratchPercent(percent);

      if (percent >= 40 && !isScratchedOff) {
        revealCard();
      }
    } catch {
      // Ignore security/cross-origin constraints if any
    }
  };

  const revealCard = () => {
    setIsScratchedOff(true);
    setScratchPercent(100);
    weddingAudio.playChime();

    // Cheerful romantic confetti burst
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB6C1', '#FF69B4', '#FFD700', '#F4A261', '#FFF176'],
    });
  };

  // Touch and mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    checkScratchPercentage();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      setIsDrawing(true);
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || e.touches.length === 0) return;
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    checkScratchPercentage();
  };

  const handleCopyLink = () => {
    const inviteUrl = window.location.href;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent('Wedding: Saurabh Srivastava weds Shreya');
    const details = encodeURIComponent(
      'Join us to celebrate the holy wedding ceremony of Saurabh Srivastava and Shreya!\nDress Code: Royal Pastel Ethnic / Festive Indian\nVenue: Bundigarh Resort, Shaheed Path, Lucknow'
    );
    const location = encodeURIComponent('Bundigarh Resort, Shaheed Path, Lucknow, Uttar Pradesh');
    // Dec 9, 2026, 20:00 IST to Dec 10, 2026, 01:00 IST (UTC: 14:30 – 19:30)
    const dates = '20261209T143000Z/20261209T193000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  return (
    <section id="scratch-invite" className="py-16 md:py-24 bg-[#FFFBF8] relative overflow-hidden">
      {/* Soft background accents */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Guest Pass
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 font-medium">
            Scratch to Unlock Your Invitation
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every guest has a reserved place in our hearts. Rub the rose-gold foil below with your finger or mouse to uncover your VIP QR pass and event access details!
          </p>
        </div>

        {/* Scratch Card Outer Wrapper */}
        <div className="max-w-xl mx-auto relative" ref={containerRef}>
          
          {/* Card Border & Shadow */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_16px_50px_rgba(244,114,182,0.14)] border border-rose-100 relative">
            
            {/* Top Ornamental Header */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-100 text-xs text-stone-500">
              <span className="font-serif font-bold text-rose-600 text-sm tracking-wide">
                ⚜️ ROYAL WEDDING INVITATION
              </span>
              <span className="font-mono text-[11px] bg-rose-50 px-2 py-0.5 rounded text-rose-800">
                PASS #SRB-SHR-2026
              </span>
            </div>

            {/* Scratch Frame Container */}
            <div className="relative mt-5 rounded-2xl overflow-hidden min-h-[480px] bg-gradient-to-b from-[#FFF5F3] to-[#FFF9F6] border border-rose-200/80 shadow-inner">
              
              {/* UNDERNEATH LAYER: The Revealed VIP Invitation Card with QR Code */}
              <div className="p-6 sm:p-7 flex flex-col items-center text-center space-y-4">
                
                {/* Monogram */}
                <div className="w-14 h-14 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-rose-600 font-serif font-bold text-xl shadow-xs">
                  S &amp; S
                </div>

                {/* Wedding Couple Header */}
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
                    You Are Cordially Invited to Celebrate
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                    Saurabh Srivastava
                  </h3>
                  <div className="font-script text-2xl text-rose-500 font-normal">
                    weds
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                    Shreya
                  </h3>
                </div>

                {/* Scannable QR Code */}
                <div className="pt-2 pb-1 flex flex-col items-center">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-rose-100 relative group">
                    {/* High Fidelity SVG QR Code */}
                    <svg
                      className="w-36 h-36 sm:w-40 sm:h-40"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background */}
                      <rect width="100" height="100" fill="white" rx="8" />
                      
                      {/* Outer Position Finders */}
                      {/* Top-Left */}
                      <rect x="10" y="10" width="22" height="22" rx="4" fill="#881337" />
                      <rect x="14" y="14" width="14" height="14" rx="2" fill="white" />
                      <rect x="17" y="17" width="8" height="8" rx="1" fill="#E11D48" />

                      {/* Top-Right */}
                      <rect x="68" y="10" width="22" height="22" rx="4" fill="#881337" />
                      <rect x="72" y="14" width="14" height="14" rx="2" fill="white" />
                      <rect x="75" y="17" width="8" height="8" rx="1" fill="#E11D48" />

                      {/* Bottom-Left */}
                      <rect x="10" y="68" width="22" height="22" rx="4" fill="#881337" />
                      <rect x="14" y="72" width="14" height="14" rx="2" fill="white" />
                      <rect x="17" y="75" width="8" height="8" rx="1" fill="#E11D48" />

                      {/* Stylized QR Matrix Dots */}
                      <rect x="36" y="12" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="44" y="12" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="52" y="12" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="36" y="20" width="5" height="5" rx="1" fill="#BE123C" />
                      <rect x="48" y="20" width="8" height="5" rx="1" fill="#9F1239" />
                      <rect x="60" y="20" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="40" y="28" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="52" y="28" width="8" height="5" rx="1" fill="#E11D48" />
                      
                      {/* Center Monogram Heart Badge */}
                      <rect x="40" y="40" width="20" height="20" rx="5" fill="#FFE4E6" stroke="#E11D48" strokeWidth="1.5" />
                      <path
                        d="M50 53 C50 53, 44 49, 44 45.5 C44 43.5 45.5 42 47.5 42 C48.8 42 49.6 42.8 50 43.4 C50.4 42.8 51.2 42 52.5 42 C54.5 42 56 43.5 56 45.5 C56 49 50 53 50 53 Z"
                        fill="#E11D48"
                      />

                      {/* Bottom and Right Matrix Elements */}
                      <rect x="12" y="36" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="20" y="44" width="6" height="5" rx="1" fill="#9F1239" />
                      <rect x="28" y="36" width="5" height="5" rx="1" fill="#BE123C" />
                      <rect x="12" y="52" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="28" y="52" width="6" height="5" rx="1" fill="#9F1239" />

                      <rect x="68" y="36" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="76" y="44" width="8" height="5" rx="1" fill="#BE123C" />
                      <rect x="85" y="36" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="68" y="52" width="6" height="5" rx="1" fill="#9F1239" />
                      <rect x="80" y="52" width="6" height="5" rx="1" fill="#E11D48" />

                      <rect x="36" y="68" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="44" y="76" width="6" height="5" rx="1" fill="#9F1239" />
                      <rect x="54" y="68" width="6" height="5" rx="1" fill="#BE123C" />
                      <rect x="36" y="84" width="6" height="5" rx="1" fill="#9F1239" />
                      <rect x="48" y="84" width="8" height="5" rx="1" fill="#E11D48" />
                      <rect x="68" y="68" width="5" height="5" rx="1" fill="#9F1239" />
                      <rect x="76" y="76" width="7" height="5" rx="1" fill="#9F1239" />
                      <rect x="85" y="84" width="5" height="5" rx="1" fill="#BE123C" />
                    </svg>

                    <div className="text-[10px] font-mono text-stone-500 tracking-wider mt-1 text-center font-medium">
                      SCAN TO CHECK-IN VIP
                    </div>
                  </div>
                </div>

                {/* Key Wedding Specifications */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-left text-xs">
                  <div className="p-2.5 bg-white/80 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Date &amp; Time</span>
                    </div>
                    <p className="text-stone-700 font-medium">Dec 9, 2026</p>
                    <p className="text-stone-500 text-[11px]">8:00 PM Onwards</p>
                  </div>

                  <div className="p-2.5 bg-white/80 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>The Venue</span>
                    </div>
                    <p className="text-stone-700 font-medium">Bundigarh Resort</p>
                    <p className="text-stone-500 text-[11px]">Shaheed Path, Lucknow</p>
                  </div>

                  <div className="p-2.5 bg-white/80 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                      <Shirt className="w-3.5 h-3.5" />
                      <span>Dress Code</span>
                    </div>
                    <p className="text-stone-700 font-medium">Royal Ethnic</p>
                    <p className="text-stone-500 text-[11px]">Pastels &amp; Gold</p>
                  </div>
                </div>

                {/* Blessing message */}
                <p className="text-stone-600 text-xs italic pt-1 max-w-sm">
                  &ldquo;Your gracious presence and heartfelt blessings are the greatest gifts we could ever ask for.&rdquo;
                </p>

              </div>

              {/* TOP LAYER: Interactive HTML5 Scratch Canvas Foil */}
              {!isScratchedOff && (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none select-none z-20"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
              )}

            </div>

            {/* Scratch Controls & Quick Action Helpers */}
            <div className="mt-5 space-y-3">
              {/* Progress and instructions */}
              {!isScratchedOff ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-50/60 p-3 rounded-2xl border border-rose-100 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>
                      Scratch Progress: <strong className="text-rose-600 font-mono">{scratchPercent}%</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={revealCard}
                    className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-full shadow-xs transition-all text-xs flex items-center gap-1"
                  >
                    <PartyPopper className="w-3.5 h-3.5" />
                    <span>Quick Reveal VIP Pass</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-xs font-medium">
                  <PartyPopper className="w-4 h-4" />
                  <span>Invitation Unlocked! VIP Pass is Ready &amp; Valid for Entry.</span>
                </div>
              )}

              {/* Action Buttons for the Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Add to Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-xl font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Invite</span>
                    </>
                  )}
                </button>

                <a
                  href="https://maps.google.com/?q=Bundigarh+Resort+Shaheed+Path+Lucknow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-xl font-medium transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>View Map</span>
                </a>

                <button
                  type="button"
                  onClick={initCanvas}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scratch Again</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
