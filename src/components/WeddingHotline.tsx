import { Phone, PhoneCall, MessageCircle } from 'lucide-react';
import { HotlineContact } from '../types/wedding';

const HOTLINE_CONTACTS: HotlineContact[] = [
  {
    id: 'groom-squad',
    role: "Groom's Squad & Baraat Captain",
    name: 'Rohan Srivastava',
    relation: "Saurabh's Brother & Best Man",
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    duty: '',
    avatarColor: 'from-amber-400 to-rose-400',
    availableHours: '24/7 on Call',
  },
  {
    id: 'bridal-squad',
    role: 'Bridal Suite & Mehendi Lead',
    name: 'Tanya Verma',
    relation: "Shreya's Sister & Maid of Honour",
    phone: '+91 98765 43211',
    whatsapp: '919876543211',
    duty: '',
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
    duty: '',
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
    duty: '',
    avatarColor: 'from-purple-400 to-pink-500',
    availableHours: '5:00 PM – Late Night',
  },
  {
    id: 'hotel-desk',
    role: 'Hotel Rooms & Stay Concierge',
    name: 'Bundigarh Resort Front Desk',
    relation: 'Venue Support Executive',
    phone: '+91 98765 43214',
    whatsapp: '919876543214',
    duty: '',
    avatarColor: 'from-emerald-400 to-teal-600',
    availableHours: '24 Hours Front Desk',
  },
];

export function WeddingHotline() {
  return (
    <section id="hotlines" className="py-12 md:py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            Guest Concierge &amp; Wedding Squad
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-stone-900 font-medium">
            Wedding Call Hotline
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
            For any queries, logistics, or assistance during the celebrations, our dedicated squad is just a call or WhatsApp message away.
          </p>
        </div>

        {/* Compact & Concise Hotlines Grid without truncation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {HOTLINE_CONTACTS.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFDFB] rounded-2xl p-4 sm:p-4.5 border border-stone-200/80 hover:border-rose-200 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Contact Info (full tagline visible, no truncation) */}
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs mt-0.5 sm:mt-0`}
                >
                  {item.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-rose-600 font-medium leading-snug">{item.role}</p>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">{item.phone}</p>
                </div>
              </div>

              {/* Concise Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <a
                  href={`tel:${item.phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-1 py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-colors shadow-2xs"
                  title={`Call ${item.name}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>

                <a
                  href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                    `Hello ${item.name}, I am a guest attending Saurabh & Shreya's wedding! Wanted to check on: `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-medium transition-colors shadow-2xs"
                  title={`WhatsApp ${item.name}`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
