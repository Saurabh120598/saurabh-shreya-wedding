import { Calendar, Clock, MapPin, Sparkles, Shirt } from 'lucide-react';
import { WeddingEvent } from '../types/wedding';

const VENUE_NAME = 'Bundigarh Resort';
const VENUE_ADDRESS = 'Shaheed Path, Lucknow, Uttar Pradesh';
const MAPS_URL = 'https://maps.google.com/?q=Bundigarh+Resort+Shaheed+Path+Lucknow';

const CELEBRATION_EVENTS: WeddingEvent[] = [
  {
    id: 'mehendi',
    name: 'Mehndi Ceremony',
    subName: 'Intricate henna vines, colorful bangles & musical dholaks',
    date: 'Tuesday, December 8, 2026',
    time: '12:00 PM Onwards',
    venue: VENUE_NAME,
    address: VENUE_ADDRESS,
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
    venue: VENUE_NAME,
    address: VENUE_ADDRESS,
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
    venue: VENUE_NAME,
    address: VENUE_ADDRESS,
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
    venue: VENUE_NAME,
    address: VENUE_ADDRESS,
    dressCode: 'Traditional Royal Indian (Pastels, Ivory, Blush, Silk)',
    description:
      'With the blessings of our elders and the sacred fire as witness, Saurabh and Shreya tie the knot in eternal union amidst chanting Vedic hymns and rose showers.',
    themeColor: 'from-rose-500 to-amber-500',
    calendarTitle: 'Wedding of Saurabh weds Shreya',
  },
];

const LOCKED_CLASSES = 'opacity-50 cursor-not-allowed pointer-events-none';

export function EventsTimeline({ unlocked = false }: { unlocked?: boolean }) {
  const getCalendarUrl = (ev: WeddingEvent) => {
    const title = encodeURIComponent(ev.calendarTitle);
    const details = encodeURIComponent(`${ev.description}\n\nDress Code: ${ev.dressCode}\nVenue: ${ev.venue}, ${ev.address}`);
    const location = encodeURIComponent(`${ev.venue}, ${ev.address}`);

    let dates = '';
    if (ev.id === 'mehendi') dates = '&dates=20261208T120000/20261208T160000';
    else if (ev.id === 'sangeet') dates = '&dates=20261208T180000/20261208T233000';
    else if (ev.id === 'haldi') dates = '&dates=20261209T100000/20261209T140000';
    else if (ev.id === 'wedding') dates = '&dates=20261209T200000/20261210T020000';

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dates}&ctz=Asia/Kolkata`;
  };

  return (
    <section id="events" className="py-16 md:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
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

        {/* Single Unified Venue & Directions Banner */}
        <div className="mb-10 p-5 sm:p-6 bg-white/95 rounded-2xl border border-rose-100 shadow-[0_8px_30px_rgba(244,114,182,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  Celebration Venue (All Events)
                </span>
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-base sm:text-lg mt-0.5">
                {VENUE_NAME}
              </h4>
              <p className="text-stone-500 text-xs sm:text-sm">
                {VENUE_ADDRESS}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
            <a
              href={unlocked ? MAPS_URL : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!unlocked}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-semibold shadow-xs transition-colors w-full sm:w-auto ${unlocked ? '' : LOCKED_CLASSES}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
            {!unlocked && (
              <span className="text-[11px] text-stone-500">Scratch the invitation card to unlock</span>
            )}
          </div>
        </div>

        {/* Sequential List of Events (One After Another) */}
        <div className="space-y-6 sm:space-y-8">
          {CELEBRATION_EVENTS.map((event, index) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-[0_12px_40px_rgba(244,114,182,0.07)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_16px_50px_rgba(244,114,182,0.12)]"
            >
              {/* Top ornamental bar */}
              <div className={`h-2 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 bg-gradient-to-r ${event.themeColor} mb-6`} />

              <div className="space-y-4">
                {/* Event Header & Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                      {event.date}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      • Ceremony {index + 1} of {CELEBRATION_EVENTS.length}
                    </span>
                  </div>
                  {event.id === 'wedding' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Main Muhurat
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    {event.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 italic mt-1">{event.subName}</p>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed">{event.description}</p>

                {/* Event Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100/70">
                    <div className="flex items-center gap-2 text-rose-700 font-semibold mb-1">
                      <Clock className="w-4 h-4 text-rose-500" />
                      <span>Time &amp; Muhurat</span>
                    </div>
                    <p className="text-stone-800 font-medium text-xs sm:text-sm">{event.time}</p>
                  </div>

                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100/70">
                    <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1">
                      <Shirt className="w-4 h-4 text-amber-600" />
                      <span>Dress Code</span>
                    </div>
                    <p className="text-stone-800 font-medium text-xs sm:text-sm">{event.dressCode}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={unlocked ? getCalendarUrl(event) : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!unlocked}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-colors shadow-xs ${unlocked ? '' : LOCKED_CLASSES}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Add Ceremony to Calendar</span>
                  </a>
                  {!unlocked && (
                    <span className="text-[11px] text-stone-500">Scratch the invitation card to unlock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
