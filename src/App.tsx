import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScratchInviteCard } from './components/ScratchInviteCard';
import { EventsTimeline } from './components/EventsTimeline';
import { WeddingHotline } from './components/WeddingHotline';
import { GuestbookRSVP } from './components/GuestbookRSVP';
import { Footer } from './components/Footer';
import { PetalRain } from './components/PetalRain';

export default function App() {
  const [petalRain, setPetalRain] = useState(true);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [inviteRevealed, setInviteRevealed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D2A26] selection:bg-rose-200 selection:text-rose-900 font-sans relative">
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
