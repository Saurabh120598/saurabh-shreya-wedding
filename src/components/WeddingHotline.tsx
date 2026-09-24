import { useState, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  MessageCircle,
  Clock,
  Sparkles,
  UserCheck,
  Music,
  Car,
  Hotel,
  X,
  PhoneOff,
  Volume2,
} from 'lucide-react';
import { HotlineContact } from '../types/wedding';
import { weddingAudio } from '../utils/audioPlayer';

const HOTLINE_CONTACTS: HotlineContact[] = [
  {
    id: 'groom-squad',
    role: "Groom's Squad & Baraat Captain",
    name: 'Rohan Srivastava',
    relation: "Saurabh's Brother & Best Man",
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    duty: 'Baraat procession, Dhol timings, Groom entry, Sherwani emergency',
    avatarColor: 'from-amber-400 to-rose-400',
    availableHours: '24/7 on Call',
  },
  {
    id: 'bridal-squad',
    role: "Bridal Suite & Mehendi Lead",
    name: 'Tanya Verma',
    relation: "Shreya's Sister & Maid of Honour",
    phone: '+91 98765 43211',
    whatsapp: '919876543211',
    duty: 'Bridal entry track, Mehendi seating, Jewellery room, Haldi flowers',
    avatarColor: 'from-rose-400 to-pink-500',
    availableHours: '8:00 AM – 11:30 PM',
  },
  {
    id: 'logistics',
    role: 'Airport & Station Pickups / Cabs',
    name: 'Vikram Singh',
    relation: 'Head of Guest Hospitality',
    phone: '+91 98765 43212',
    whatsapp: '919876543212',
    duty: 'Chaudhary Charan Singh Airport pickups, Charbagh station cabs & shuttles',
    avatarColor: 'from-sky-400 to-indigo-500',
    availableHours: 'Round the clock',
  },
  {
    id: 'dj-sangeet',
    role: 'Sangeet Stage & DJ Song Requests',
    name: 'DJ Aryan Beats',
    relation: 'Entertainment Director',
    phone: '+91 98765 43213',
    whatsapp: '919876543213',
    duty: 'Song requests for Saurabh & Shreya, dance performance cues, flash mob',
    avatarColor: 'from-purple-400 to-pink-500',
    availableHours: '5:00 PM – Late Night',
  },
  {
    id: 'hotel-desk',
    role: 'Hotel Rooms & Stay Concierge',
    name: 'Bundigarh Resort Hospitality Desk',
    relation: 'Venue Support Executive',
    phone: '+91 98765 43214',
    whatsapp: '919876543214',
    duty: 'Room key cards, early check-in, luggage transfer, ironing & attire steam',
    avatarColor: 'from-emerald-400 to-teal-600',
    availableHours: '24 Hours Front Desk',
  },
];

export function WeddingHotline() {
  const [activeCall, setActiveCall] = useState<HotlineContact | null>(null);
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);

  // Call simulator timer
  useEffect(() => {
    let interval: number;
    let ringTimer: number;

    if (activeCall && callState === 'ringing') {
      weddingAudio.playPluck(440, 0.4);
      ringTimer = window.setTimeout(() => {
        setCallState('connected');
        weddingAudio.playChime();
      }, 2400);
    }

    if (activeCall && callState === 'connected') {
      interval = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearTimeout(ringTimer);
      clearInterval(interval);
    };
  }, [activeCall, callState]);

  const startSimulatedCall = (contact: HotlineContact) => {
    setActiveCall(contact);
    setCallState('ringing');
    setCallDuration(0);
  };

  const endSimulatedCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setActiveCall(null);
      setCallState('ringing');
      setCallDuration(0);
    }, 800);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section id="hotlines" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            Guest Concierge &amp; Wedding Squad
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 font-medium">
            Wedding Call Hotline
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Need directions, airport shuttle, Baraat timings, or want to drop a surprise song request for Saurabh &amp; Shreya? Our dedicated wedding squad is just one tap away!
          </p>
        </div>

        {/* Hotlines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOTLINE_CONTACTS.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFDFB] rounded-2xl p-5 border border-stone-200/80 hover:border-rose-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-xs`}
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base group-hover:text-rose-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-rose-600 font-medium">{item.role}</p>
                    </div>
                  </div>
                </div>

                {/* Duty / description */}
                <p className="text-xs text-stone-600 mt-3.5 leading-relaxed bg-stone-50/70 p-2.5 rounded-lg border border-stone-100">
                  {item.duty}
                </p>

                {/* Availability info */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-3">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{item.availableHours}</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-500 truncate">{item.relation}</span>
                </div>
              </div>

              {/* Call & WhatsApp Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-3 border-t border-stone-100">
                {/* Real call button */}
                <a
                  href={`tel:${item.phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors"
                  title={`Call ${item.name}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </a>

                {/* WhatsApp button */}
                <a
                  href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                    `Hello ${item.name}, I am a guest attending Saurabh & Shreya's wedding! Wanted to check on: `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors"
                  title={`WhatsApp ${item.name}`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>

                {/* Simulated in-browser call test */}
                <button
                  type="button"
                  onClick={() => startSimulatedCall(item)}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-medium transition-colors border border-rose-200"
                  title="Simulate Voice Call"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>Dial Test</span>
                </button>
              </div>

            </div>
          ))}

          {/* Special Quick Action Card: DJ Song Request Box */}
          <div className="bg-gradient-to-br from-rose-500 to-amber-600 rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-200" />
                <h3 className="font-serif font-bold text-lg">Sangeet Song Request Hotline</h3>
              </div>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                Got a killer track you want Saurabh and Shreya to groove to at the Sangeet Night? Text DJ Aryan Beats directly with your song dedications!
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20">
              <a
                href={`https://wa.me/919876543213?text=${encodeURIComponent(
                  "Hey DJ Aryan! I want to dedicate this track for Saurabh & Shreya at the Sangeet: "
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-stone-900 rounded-xl font-medium text-xs hover:bg-rose-50 transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Send Song Dedication on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Cute Interactive In-Browser Call Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-800 relative text-center">
            
            {/* Close button */}
            <button
              onClick={endSimulatedCall}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-stone-800"
              aria-label="Close call modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Avatar with pulsating wave */}
            <div className="relative mx-auto w-24 h-24 my-3 flex items-center justify-center">
              {callState === 'ringing' && (
                <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
              )}
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-tr ${activeCall.avatarColor} flex items-center justify-center text-3xl font-serif font-bold text-white shadow-lg relative z-10`}
              >
                {activeCall.name.charAt(0)}
              </div>
            </div>

            {/* Contact details */}
            <h4 className="text-xl font-serif font-bold mt-2">{activeCall.name}</h4>
            <p className="text-xs text-rose-400 font-medium">{activeCall.role}</p>
            <p className="text-[11px] text-stone-400 font-mono mt-0.5">{activeCall.phone}</p>

            {/* Status Indicator */}
            <div className="my-5 py-3 px-4 rounded-xl bg-stone-800/80 border border-stone-700 text-xs">
              {callState === 'ringing' && (
                <div className="flex items-center justify-center gap-2 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Ringing Saurabh &amp; Shreya's Squad Desk...</span>
                </div>
              )}

              {callState === 'connected' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Connected ({formatDuration(callDuration)})</span>
                  </div>
                  <p className="text-[11px] text-stone-300 italic">
                    &ldquo;Namaste! Welcome to Saurabh &amp; Shreya's celebration helpline. How can we assist you with the ceremonies today?&rdquo;
                  </p>
                </div>
              )}

              {callState === 'ended' && (
                <div className="text-stone-400">Call Ended. Have a wonderful celebration!</div>
              )}
            </div>

            {/* End Call Button */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={endSimulatedCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                title="Hang up call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
