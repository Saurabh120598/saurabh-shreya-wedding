import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Shirt,
  PartyPopper,
} from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

export function ScratchInviteCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastSoundTimeRef = useRef<number>(0);
  const throttleTimerRef = useRef<number | null>(null);

  const [isScratchedOff, setIsScratchedOff] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize and paint scratch card canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.clientWidth || canvas.offsetWidth || 400;
    const height = canvas.clientHeight || canvas.offsetHeight || 440;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.save();
    ctx.scale(dpr, dpr);

    // Reset composite operation to paint initial foil
    ctx.globalCompositeOperation = 'source-over';

    // Rich Rose Gold & Champagne foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#F6D2C8');
    grad.addColorStop(0.25, '#EABEB2');
    grad.addColorStop(0.5, '#FDE8E2');
    grad.addColorStop(0.75, '#DCA89C');
    grad.addColorStop(1, '#F3C5BA');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle gold shimmer speckles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 280; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Elegant inner borders
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = 'rgba(163, 76, 59, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, width - 30, height - 30);

    const centerX = width / 2;
    const centerY = height / 2;

    // Center compact frosted badge for simple clean one-liner
    const boxWidth = Math.min(280, width - 36);
    const boxHeight = 76;
    const boxX = centerX - boxWidth / 2;
    const boxY = centerY - boxHeight / 2;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Centered Clean Foil Typography
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#6B3E35';
    ctx.font = 'bold 15px serif';
    ctx.fillText('✨ Scratch to Reveal Invitation', centerX, centerY - 12);

    ctx.fillStyle = '#8C4B3E';
    ctx.font = '12px sans-serif';
    ctx.fillText('Rub with your finger or mouse', centerX, centerY + 14);

    ctx.restore();

    setIsScratchedOff(false);
    setScratchPercent(0);
    lastPointRef.current = null;
  }, []);

  useEffect(() => {
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

  const revealCard = useCallback(() => {
    setIsScratchedOff(true);
    setScratchPercent(100);
    lastPointRef.current = null;
    weddingAudio.playChime();

    // Cheerful romantic confetti burst
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB6C1', '#FF69B4', '#FFD700', '#F4A261', '#FFF176'],
    });
  }, []);

  // Lightweight & fast scratch calculation
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchedOff) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const sampleStep = 28; // Fast sampling stride
    let transparentCount = 0;
    let totalSamples = 0;

    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          const index = (y * width + x) * 4 + 3;
          if (data[index] < 128) {
            transparentCount++;
          }
          totalSamples++;
        }
      }

      const percent = Math.min(100, Math.round((transparentCount / totalSamples) * 100));
      setScratchPercent(percent);

      // Auto-reveal trigger at 30% scratched
      if (percent >= 30 && !isScratchedOff) {
        revealCard();
      }
    } catch {
      // Ignore security constraints
    }
  }, [isScratchedOff, revealCard]);

  // High-performance direct scratch action
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchedOff) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 56 * (scaleX / 1.5); // Comfortable clearing brush for mobile & desktop
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 28 * (scaleX / 1.5), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    lastPointRef.current = { x, y };

    // Throttled sound effect
    const now = Date.now();
    if (now - lastSoundTimeRef.current > 160) {
      weddingAudio.playScratchSound();
      lastSoundTimeRef.current = now;
    }

    // Throttled check percentage to keep 60fps buttery smooth
    if (!throttleTimerRef.current) {
      throttleTimerRef.current = window.setTimeout(() => {
        throttleTimerRef.current = null;
        checkScratchPercentage();
      }, 100);
    }
  };

  // Pointer event handlers (mouse & touch unified)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    lastPointRef.current = null;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    setIsDrawing(false);
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  // Google Calendar URL generator (Indian Standard Time: 8:00 PM onwards)
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent('Wedding: Saurabh weds Shreya');
    const details = encodeURIComponent(
      'Join us to celebrate the holy wedding ceremony of Saurabh and Shreya!\nDress Code: Royal Pastel Ethnic / Festive Indian\nVenue: Bundigarh Resort, Shaheed Path, Lucknow'
    );
    const location = encodeURIComponent('Bundigarh Resort, Shaheed Path, Lucknow, Uttar Pradesh');
    const dates = '20261209T200000/20261210T020000';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}&ctz=Asia/Kolkata`;
  };

  return (
    <section id="scratch-invite" className="py-16 md:py-24 bg-[#FFFBF8] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Guest Card
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 font-medium">
            Scratch to Unlock Your Invitation
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every guest has a reserved place in our hearts. Rub the rose-gold foil below with your finger or mouse to uncover our wedding ceremony date and celebration details!
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
              <span className="font-mono text-[11px] bg-rose-50 px-2.5 py-0.5 rounded-full text-rose-800 font-semibold border border-rose-200">
                PASS #SRB-SHR-2026
              </span>
            </div>

            {/* Scratch Frame Container */}
            <div className="relative mt-5 rounded-2xl overflow-hidden min-h-[460px] bg-gradient-to-b from-[#FFF5F3] to-[#FFF9F6] border border-rose-200/80 shadow-inner flex flex-col justify-between">
              
              {/* UNDERNEATH LAYER: The Revealed VIP Invitation Card with Revealed Date */}
              <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-5 w-full">
                
                {/* Monogram */}
                <div className="w-14 h-14 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-rose-600 font-serif font-bold text-xl shadow-xs">
                  S &amp; S
                </div>

                {/* Wedding Couple Header */}
                <div className="space-y-1">
                  <p className="text-[11px] sm:text-xs uppercase tracking-widest text-amber-700 font-semibold">
                    You Are Cordially Invited to Celebrate
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                    Saurabh
                  </h3>
                  <div className="font-script text-2xl sm:text-3xl text-rose-500 font-normal">
                    weds
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                    Shreya
                  </h3>
                </div>

                {/* PROMINENTLY REVEALED WEDDING DATE BANNER */}
                <div className="w-full bg-gradient-to-r from-rose-50 via-rose-100/70 to-amber-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-center gap-1.5 text-rose-700 text-xs uppercase tracking-wider font-bold mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Wedding Date Revealed</span>
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                    December 09, 2026
                  </div>
                  <div className="text-xs sm:text-sm text-stone-600 font-medium mt-1.5 flex items-center justify-center gap-2">
                    <span>Wednesday</span>
                    <span>·</span>
                    <span className="text-rose-600 font-semibold">8:00 PM Onwards</span>
                    <span>·</span>
                    <span>Lucknow</span>
                  </div>
                </div>

                {/* Key Wedding Specifications */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-left text-xs">
                  <div className="p-3 bg-white/90 rounded-xl border border-rose-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Date &amp; Time</span>
                    </div>
                    <p className="text-stone-700 font-medium">Dec 9, 2026</p>
                    <p className="text-stone-500 text-[11px]">8:00 PM Onwards</p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-xl border border-rose-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>The Venue</span>
                    </div>
                    <p className="text-stone-700 font-medium">Bundigarh Resort</p>
                    <p className="text-stone-500 text-[11px]">Shaheed Path, Lucknow</p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-xl border border-rose-100 shadow-2xs">
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
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                />
              )}

            </div>

            {/* Scratch Controls & Quick Action Helpers */}
            <div className="mt-5 space-y-3">
              {/* Progress and instructions */}
              {!isScratchedOff ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-50/70 p-3 rounded-2xl border border-rose-100 text-xs">
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
                    <span>Quick Reveal Invitation</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-xs font-medium">
                  <PartyPopper className="w-4 h-4" />
                  <span>Invitation &amp; Date Unlocked! We cannot wait to celebrate with you.</span>
                </div>
              )}

              {/* Action Buttons for the Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium transition-colors shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Add to Calendar</span>
                </a>

                <a
                  href="https://maps.google.com/?q=Bundigarh+Resort+Shaheed+Path+Lucknow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-rose-50 text-stone-800 border border-stone-200 hover:border-rose-300 rounded-xl font-medium transition-colors shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>View Map</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
