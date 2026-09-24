import { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Shirt, ChevronRight } from 'lucide-react';
import { WeddingEvent } from '../types/wedding';

const CELEBRATION_EVENTS: WeddingEvent[] = [
  {
    id: 'mehendi',
    name: 'Mehndi Ceremony',
    subName: 'Intricate henna vines, colorful bangles & musical dholaks',
    date: 'Tuesday, December 8, 2026',
    time: '12:00 PM Onwards',
    venue: 'Bundigarh Resort',
    address: 'Shaheed Path, Lucknow, Uttar Pradesh',
    dressCode: 'Pastel Mint, Peach & Vibrant Boho Festive',
    description:
      'Watch bespoke bridal henna art being applied while enjoying live acoustic melodies, personalized perfume bars, and sweet jalebis. A beautiful afternoon of art and celebration!',
    themeColor: 'from-emerald-400 to-teal-500',
    calendarTitle: "Saurabh & Shreya's Mehndi Ceremony",
  },
  {
    id: 'sangeet',
    name: 'Grand Sangeet & Beats Night',
    subName: 'Glitz, Bollywood face-offs & high-voltage dance stage',
    date: 'Tuesday, December 8, 2026',
    time: '6:00 PM Onwards',
    venue: 'Bundigarh Resort',
    address: 'Shaheed Path, Lucknow, Uttar Pradesh',
    dressCode: 'Indo-Western Glitz, Tuxedos, Shimmering Lehengas',
    description:
      "The ultimate celebration where Groom Squad and Bridal Squad compete for the golden trophy, followed by open DJ dance floor and chef's signature cocktail bar.",
    themeColor: 'from-purple-500 to-indigo-600',
    calendarTitle: "Saurabh & Shreya's Sangeet Night",
  },
  {
    id: 'haldi',
    name: 'Haldi & Floral Utsav',
    subName: 'Sun-drenched laughter, fragrant marigolds & turmeric glow',
    date: 'Wednesday, December 9, 2026',
    time: '10:00 AM Onwards',
    venue: 'Bundigarh Resort',
    address: 'Shaheed Path, Lucknow, Uttar Pradesh',
    dressCode: 'Sunshine Yellows, Mustards & Floral Kurtas / Sarees',
    description:
      'Kickstarting the wedding day with sandalwood paste, organic turmeric blessings, flower shower and authentic Awadhi street chaat stalls!',
    themeColor: 'from-amber-400 to-yellow-500',
    calendarTitle: "Saurabh & Shreya's Haldi Ceremony",
  },
  {
    id: 'wedding',
    name: 'Shubh Vivaah (The Sacred Vows)',
    subName: 'Royal Baraat procession, Jaimala & Vedic Holy Pheras',
    date: 'Wednesday, December 9, 2026',
    time: '8:00 PM Onwards',
    venue: 'Bundigarh Resort',
    address: 'Shaheed Path, Lucknow, Uttar Pradesh',
    dressCode: 'Traditional Royal Indian (Pastels, Ivory, Blush, Silk)',
    description:
      'With the blessings of our elders and the sacred fire as witness, Saurabh and Shreya tie the knot in eternal union amidst chanting Vedic hymns and rose showers.',
    themeColor: 'from-rose-500 to-amber-500',
    calendarTitle: 'Wedding of Saurabh Srivastava weds Shreya',
  },
];

export function EventsTimeline() {
  const [activeTab, setActiveTab] = useState('mehendi');
  const selectedEvent = CELEBRATION_EVENTS.find((e) => e.id === activeTab) || CELEBRATION_EVENTS[3];

  const getCalendarUrl = (ev: WeddingEvent) => {
    const title = encodeURIComponent(ev.calendarTitle);
    const details = encodeURIComponent(`${ev.description}\nDress Code: ${ev.dressCode}\nVenue: ${ev.venue}`);
    const location = encodeURIComponent(`${ev.venue}, ${ev.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <section id="events" className="py-16 md:py-24 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F6] to-[#FFFDF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" />
            Celebration Itinerary
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 font-medium">
            Wedding Ceremonies &amp; Schedule
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Two beautiful days of love, laughter, and rituals. Explore the timings, themes, and dress codes for each celebration.
          </p>
        </div>

        {/* Event Selection Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex p-1.5 bg-white border border-rose-100 rounded-2xl shadow-xs">
            {CELEBRATION_EVENTS.map((event) => {
              const isActive = activeTab === event.id;
              return (
                <button
                  key={event.id}
                  onClick={() => setActiveTab(event.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50/50'
                  }`}
                >
                  <span>{event.name.split('(')[0]}</span>
                  {event.id === 'wedding' && <Sparkles className="w-3 h-3 text-amber-200" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Event Showcase Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-[0_12px_40px_rgba(244,114,182,0.08)] relative overflow-hidden">
          
          {/* Top ornamental bar */}
          <div className={`h-2 -mt-6 -mx-6 sm:-mt-10 sm:-mx-10 bg-gradient-to-r ${selectedEvent.themeColor} mb-6`} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
                  {selectedEvent.date}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                  {selectedEvent.name}
                </h3>
                <p className="text-xs text-stone-500 italic mt-0.5">{selectedEvent.subName}</p>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed">{selectedEvent.description}</p>

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100/70">
                  <div className="flex items-center gap-2 text-rose-700 font-semibold mb-1">
                    <Clock className="w-4 h-4 text-rose-500" />
                    <span>Time &amp; Muhurat</span>
                  </div>
                  <p className="text-stone-800 font-medium">{selectedEvent.time}</p>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100/70">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1">
                    <Shirt className="w-4 h-4 text-amber-600" />
                    <span>Dress Code</span>
                  </div>
                  <p className="text-stone-800 font-medium">{selectedEvent.dressCode}</p>
                </div>
              </div>

              {/* Venue details */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-stone-900">{selectedEvent.venue}</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">{selectedEvent.address}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={getCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Add Ceremony to Calendar</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedEvent.venue} ${selectedEvent.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-full text-xs font-medium transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Right Graphic Card */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-amber-50 border border-rose-100 text-center relative space-y-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-rose-200 flex items-center justify-center mx-auto text-2xl">
                  {selectedEvent.id === 'mehendi' && '💃'}
                  {selectedEvent.id === 'sangeet' && '🎶'}
                  {selectedEvent.id === 'haldi' && '🌸'}
                  {selectedEvent.id === 'wedding' && '💍'}
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-stone-900">
                    Auspicious Celebration
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Warm hospitality, gourmet live catering &amp; royal arrangements await our esteemed guests.
                  </p>
                </div>

                <div className="pt-2 border-t border-rose-100/80 text-[11px] text-rose-600 font-medium flex items-center justify-center gap-1">
                  <span>Guest Hospitality Desk Available</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
