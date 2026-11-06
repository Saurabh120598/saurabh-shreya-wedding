import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScratchInviteCard } from './components/ScratchInviteCard';
import { EventsTimeline } from './components/EventsTimeline';
import { WeddingHotline } from './components/WeddingHotline';
import { GuestbookRSVP } from './components/GuestbookRSVP';
import { Footer } from './components/Footer';
import { PetalRain } from './components/PetalRain';
import archBg from './assets/images/Dreamy Floral Palace Wedding Arch.png';
import terraceBg from './assets/images/Dreamy Palace Wedding Terrace at Sunset.png';

export default function App() {
  const [petalRain, setPetalRain] = useState(true);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [inviteRevealed, setInviteRevealed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D2A26] selection:bg-rose-200 selection:text-rose-900 font-sans relative isolate">
      {/* Site-wide background (fixed layer works on desktop & mobile, unlike background-attachment: fixed on iOS).
          Image is picked by screen orientation so it matches its native aspect ratio:
          landscape (desktop) -> terrace 16:9, portrait (phones, incl. desktop-site mode) -> arch 9:16. */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <picture className="block w-full h-full">
          <source media="(orientation: landscape)" srcSet={terraceBg} />
          <img
            src={archBg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </picture>
        {/* Soft veil keeps text readable over the image */}
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* Falling Flower Petals Effect */}
      <PetalRain active={petalRain} />

      {/* Top Bar Navigation */}
      <Navbar
        petalRain={petalRain}
        setPetalRain={setPetalRain}
        onOpenRSVP={() => setRsvpModalOpen(true)}
      />

      {/* Main Content Flow */}
      <main>
        {/* Hero Section */}
        <Hero onOpenRSVP={() => setRsvpModalOpen(true)} />

        {/* Scratch-off Invitation & QR Code Reveal */}
        <ScratchInviteCard onReveal={() => setInviteRevealed(true)} />

        {/* Wedding Ceremonies Schedule */}
        <EventsTimeline unlocked={inviteRevealed} />

        {/* Call Stuff & Wedding Concierge Hotline */}
        <WeddingHotline />

        {/* Guestbook Wishes & RSVP */}
        <GuestbookRSVP
          rsvpModalOpen={rsvpModalOpen}
          onCloseRSVP={() => setRsvpModalOpen(false)}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
