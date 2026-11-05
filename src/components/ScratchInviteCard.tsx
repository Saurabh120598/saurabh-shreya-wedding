import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  Sparkles,
  QrCode,
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
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Generate a real scannable QR code on mount
  useEffect(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://saurabh-weds-shreya.web.app';
    QRCode.toDataURL(currentUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#881337', // Deep rose wine color for scannable high contrast
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, []);

  // Initialize and paint scratch card canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Get exact CSS layout dimensions
    const width = canvas.clientWidth || canvas.offsetWidth || 400;
    const height = canvas.clientHeight || canvas.offsetHeight || 500;
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

    // Center frosted pill box for guaranteed legible text
    const boxWidth = Math.min(320, width - 40);
    const boxHeight = 180;
    const boxX = centerX - boxWidth / 2;
    const boxY = centerY - boxHeight / 2;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 16);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Perfectly centered Foil Typography
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#6B3E35';
    ctx.font = 'bold 17px serif';
    ctx.fillText('SECRET WEDDING PASS', centerX, centerY - 52);

    ctx.fillStyle = '#7C493D';
    ctx.font = 'italic 15px serif';
    ctx.fillText('Saurabh Srivastava & Shreya', centerX, centerY - 24);

    ctx.fillStyle = '#9E3A4B';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('SCRATCH TO REVEAL DATE & PASS', centerX, centerY + 16);

    ctx.fillStyle = '#7C493D';
    ctx.font = '12px sans-serif';
    ctx.fillText('Rub with your finger or mouse', centerX, centerY + 42);

    ctx.fillStyle = '#9C584B';
    ctx.font = '11px sans-serif';
    ctx.fillText('Unlocks VIP QR & Ceremony Date', centerX, centerY + 64);

    ctx.restore();

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

      if (percent >= 38 && !isScratchedOff) {
        revealCard();
      }
    } catch {
      // Ignore security constraints
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
    // Dec 9, 2026, 20:00 IST to Dec 10, 2026, 01:00 IST
    const dates = '20261209T143000Z/20261209T193000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  return (
    <section id="scratch-invite" className="py-16 md:py-24 bg-[#FFFBF8] relative overflow-hidden">
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
            Every guest has a reserved place in our hearts. Rub the rose-gold foil below with your finger or mouse to uncover our wedding ceremony date and your VIP QR pass!
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
            <div className="relative mt-5 rounded-2xl overflow-hidden min-h-[520px] bg-gradient-to-b from-[#FFF5F3] to-[#FFF9F6] border border-rose-200/80 shadow-inner flex flex-col justify-between">
              
              {/* UNDERNEATH LAYER: The Revealed VIP Invitation Card with Revealed Date & Real QR Code */}
              <div className="p-5 sm:p-7 flex flex-col items-center text-center space-y-4 w-full">
                
                {/* Monogram */}
                <div className="w-13 h-13 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-rose-600 font-serif font-bold text-lg shadow-xs">
                  S &amp; S
                </div>

                {/* Wedding Couple Header */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase tracking-widest text-amber-700 font-semibold">
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

                {/* PROMINENTLY REVEALED WEDDING DATE BANNER */}
                <div className="w-full bg-gradient-to-r from-rose-50 via-rose-100/70 to-amber-50 border-2 border-rose-200 rounded-2xl p-3.5 sm:p-4 shadow-xs">
                  <div className="flex items-center justify-center gap-1.5 text-rose-700 text-xs uppercase tracking-wider font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Wedding Date Revealed</span>
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                    December 09, 2026
                  </div>
                  <div className="text-xs sm:text-sm text-stone-600 font-medium mt-1 flex items-center justify-center gap-2">
                    <span>Wednesday</span>
                    <span>·</span>
                    <span className="text-rose-600 font-semibold">8:00 PM Onwards</span>
                    <span>·</span>
                    <span>Lucknow</span>
                  </div>
                </div>

                {/* Working Scannable QR Code */}
                <div className="pt-1 flex flex-col items-center">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-rose-100 relative group flex flex-col items-center">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="Scan QR code with phone camera to check-in"
                        className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center bg-rose-50 rounded-lg">
                        <QrCode className="w-12 h-12 text-rose-400 animate-pulse" />
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-stone-600 tracking-wider mt-2 text-center font-medium flex items-center justify-center gap-1">
                      <QrCode className="w-3 h-3 text-rose-500" />
                      <span>SCAN WITH CAMERA TO OPEN PASS</span>
                    </div>
                  </div>
                </div>

                {/* Key Wedding Specifications */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-left text-xs">
                  <div className="p-2.5 bg-white/90 rounded-xl border border-rose-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Date &amp; Time</span>
                    </div>
                    <p className="text-stone-700 font-medium">Dec 9, 2026</p>
                    <p className="text-stone-500 text-[11px]">8:00 PM Onwards</p>
                  </div>

                  <div className="p-2.5 bg-white/90 rounded-xl border border-rose-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>The Venue</span>
                    </div>
                    <p className="text-stone-700 font-medium">Bundigarh Resort</p>
                    <p className="text-stone-500 text-[11px]">Shaheed Path, Lucknow</p>
                  </div>

                  <div className="p-2.5 bg-white/90 rounded-xl border border-rose-100 shadow-2xs">
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
                    <span>Quick Reveal VIP Pass</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-xs font-medium">
                  <PartyPopper className="w-4 h-4" />
                  <span>Invitation &amp; Date Unlocked! VIP Pass is Ready &amp; Valid for Entry.</span>
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
