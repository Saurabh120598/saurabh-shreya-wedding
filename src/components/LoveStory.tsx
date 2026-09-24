import { Sparkles, Coffee, Moon, Heart, Flame } from 'lucide-react';

const STORY_CHAPTERS = [
  {
    chapter: '01',
    title: 'The Rainy Coffee & Stolen Smiles',
    year: 'Winter 2022',
    icon: Coffee,
    description:
      'What was supposed to be a polite 20-minute coffee meeting stretched into four hours of animated stories about favorite books, childhood quirks, and endless laughter over cold coffee.',
  },
  {
    chapter: '02',
    title: 'Midnight Chai & Unspoken Dreams',
    year: 'Spring 2023',
    icon: Moon,
    description:
      'Through busy work weeks and quiet evenings, Lucknow’s roadside kulhad chai stalls became our sacred haven. It didn’t take long to realize that every story felt incomplete until shared with each other.',
  },
  {
    chapter: '03',
    title: 'The Starlight Proposal',
    year: 'Autumn 2025',
    icon: Heart,
    description:
      'Under a canopy of fairy lights and soft acoustic music, Saurabh went down on one knee with tears in his eyes and a ring in hand. Shreya said "Yes!" before he could even finish his sentence.',
  },
  {
    chapter: '04',
    title: 'The Forever Chapter',
    year: 'December 2026',
    icon: Flame,
    description:
      'Surrounded by our loved ones, the sacred fire, and endless blessings, we step hand-in-hand into a lifetime of partnership, warmth, and shared happiness.',
  },
];

export function LoveStory() {
  return (
    <section id="story" className="py-16 md:py-24 bg-[#FFFDFB] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Our Journey Together
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 font-medium">
            How Saurabh Met Shreya
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every love story is magical, but ours is our favorite little fairytale.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STORY_CHAPTERS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.chapter}
                className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Top Index & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif font-bold text-2xl text-rose-300 group-hover:text-rose-500 transition-colors">
                      {item.chapter}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mt-1 mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-400">
                  <span>Part {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
