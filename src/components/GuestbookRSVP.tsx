import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Send,
  Sparkles,
  CheckCircle,
  MessageSquareHeart,
  CalendarCheck,
  X,
  Loader2,
} from 'lucide-react';
import { RSVPSubmission } from '../types/wedding';
import { weddingAudio } from '../utils/audioPlayer';
import {
  fetchWishes,
  postWish,
  likeWish,
  submitRSVP,
  WishEntry,
} from '../utils/api';

const STICKERS = ['💍', '🥂', '🌸', '💖', '✨', '🪔', '💐', '🎉'];

interface GuestbookRSVPProps {
  rsvpModalOpen: boolean;
  onCloseRSVP: () => void;
}

export function GuestbookRSVP({ rsvpModalOpen, onCloseRSVP }: GuestbookRSVPProps) {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [wishesLoading, setWishesLoading] = useState(true);

  const [newSender, setNewSender] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('💖');
  const [wishPosting, setWishPosting] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState<RSVPSubmission>({
    name: '',
    email: '',
    phone: '',
    guestCount: 2,
    attendingEvents: ['mehendi', 'sangeet', 'haldi', 'wedding'],
    foodPreference: 'vegetarian',
    songRequest: '',
    note: '',
  });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Load wishes from server on mount
  useEffect(() => {
    fetchWishes()
      .then(data => setWishes(data))
      .catch(() => {/* server not running yet — silently ignore */})
      .finally(() => setWishesLoading(false));
  }, []);

  const handlePostWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSender.trim() || !newMessage.trim()) return;
    setWishPosting(true);
    try {
      const res = await postWish({
        senderName: newSender.trim(),
        relation: newRelation.trim() || 'Well-wisher & Friend',
        message: newMessage.trim(),
        sticker: selectedSticker,
      });
      setWishes(prev => [res.entry, ...prev]);
      setNewSender('');
      setNewRelation('');
      setNewMessage('');
      weddingAudio.playChime();
      confetti({ particleCount: 50, spread: 60, colors: ['#FFB6C1', '#F43F5E', '#F59E0B'] });
    } catch {
      alert('Could not post wish right now. Please try again.');
    } finally {
      setWishPosting(false);
    }
  };

  const handleLikeWish = async (id: string) => {
    weddingAudio.playPluck(523, 0.2);
    // Optimistic update
    setWishes(prev => prev.map(w => w.id === id ? { ...w, likes: w.likes + 1 } : w));
    try {
      await likeWish(id);
    } catch {
      // Revert on failure
      setWishes(prev => prev.map(w => w.id === id ? { ...w, likes: w.likes - 1 } : w));
    }
  };

  const handleToggleEvent = (eventId: string) => {
    setRsvpData(prev => {
      const exists = prev.attendingEvents.includes(eventId);
      return {
        ...prev,
        attendingEvents: exists
          ? prev.attendingEvents.filter(id => id !== eventId)
          : [...prev.attendingEvents, eventId],
      };
    });
  };

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.name || !rsvpData.phone) return;
    setRsvpSubmitting(true);
    try {
      await submitRSVP({
        name: rsvpData.name,
        email: rsvpData.email,
        phone: rsvpData.phone,
        guestCount: rsvpData.guestCount,
        attendingEvents: rsvpData.attendingEvents,
        foodPreference: rsvpData.foodPreference,
        songRequest: rsvpData.songRequest,
        note: rsvpData.note,
      });
      setRsvpSubmitted(true);
      weddingAudio.playChime();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFB6C1', '#F43F5E', '#10B981', '#F59E0B'],
      });
    } catch {
      alert('Could not submit RSVP right now. Please try again.');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-16 md:py-24 bg-[#FFFBF8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            Wishes &amp; Blessings
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 font-medium">
            Blessings for Saurabh &amp; Shreya
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Leave your warm congratulations, advice, or love for the couple. Your words will be bound into their keepsake wedding memory book!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Write a Wish Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Leave a Blessing</span>
            </h3>

            <form onSubmit={handlePostWish} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSender}
                  onChange={e => setNewSender(e.target.value)}
                  placeholder="e.g. Rahul &amp; Simran"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Relation to Saurabh / Shreya
                </label>
                <input
                  type="text"
                  value={newRelation}
                  onChange={e => setNewRelation(e.target.value)}
                  placeholder="e.g. Groom's School Friend / Bride's Aunt"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Choose a Blessing Sticker
                </label>
                <div className="flex flex-wrap gap-2">
                  {STICKERS.map(stk => (
                    <button
                      key={stk}
                      type="button"
                      onClick={() => setSelectedSticker(stk)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform ${
                        selectedSticker === stk
                          ? 'bg-rose-100 ring-2 ring-rose-400 scale-110'
                          : 'bg-stone-50 hover:bg-stone-100'
                      }`}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Your Warm Words &amp; Blessings <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Wishing Saurabh &amp; Shreya a lifetime of joyous adventures..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={wishPosting}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:opacity-60 text-white rounded-xl text-xs font-medium shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                {wishPosting
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Posting…</span></>
                  : <><Send className="w-3.5 h-3.5" /><span>Post Blessing on Live Board</span></>
                }
              </button>
            </form>
          </div>

          {/* Right: Live Blessings Feed */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span className="font-semibold text-stone-800">
                Wall of Love ({wishes.length} Blessings)
              </span>
              <span>Sorted by recent</span>
            </div>

            {wishesLoading ? (
              <div className="flex items-center justify-center py-16 text-stone-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-xs">Loading blessings…</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {wishes.length === 0 && (
                  <div className="text-center py-12 text-stone-400 text-xs">
                    Be the first to leave a blessing! 💖
                  </div>
                )}
                {wishes.map(item => (
                  <div
                    key={item.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-rose-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{item.sticker}</span>
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-sm">
                            {item.senderName}
                          </h4>
                          <p className="text-[11px] text-rose-600">{item.relation}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">
                        {new Date(item.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 mt-2.5 leading-relaxed bg-[#FFFDF9] p-3 rounded-xl border border-stone-100">
                      &ldquo;{item.message}&rdquo;
                    </p>

                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => handleLikeWish(item.id)}
                        className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-rose-500 px-2 py-0.5 rounded-full hover:bg-rose-50 transition-colors"
                      >
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RSVP Modal */}
      {rsvpModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-100 relative my-8">
            <button
              onClick={onCloseRSVP}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
              aria-label="Close RSVP form"
            >
              <X className="w-4 h-4" />
            </button>

            {!rsvpSubmitted ? (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full text-rose-600 text-xs font-semibold uppercase mb-2">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    Guest Attendance Confirmation
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900">
                    RSVP for Saurabh &amp; Shreya's Wedding
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Kindly confirm your presence so our hospitality team can arrange your suite &amp; welcoming feasts!
                  </p>
                </div>

                <form onSubmit={handleSubmitRSVP} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Primary Guest Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpData.name}
                        onChange={e => setRsvpData({ ...rsvpData, name: e.target.value })}
                        placeholder="Your Full Name"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={rsvpData.phone}
                        onChange={e => setRsvpData({ ...rsvpData, phone: e.target.value })}
                        placeholder="+91 98765 00000"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={rsvpData.email}
                      onChange={e => setRsvpData({ ...rsvpData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-rose-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Number of Attending Guests
                      </label>
                      <select
                        value={rsvpData.guestCount}
                        onChange={e => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-rose-400 bg-white"
                      >
                        <option value={1}>1 Guest (Just Me)</option>
                        <option value={2}>2 Guests (With Plus One)</option>
                        <option value={3}>3 Guests (Family)</option>
                        <option value={4}>4 Guests (Family)</option>
                        <option value={5}>5+ Guests (Full Family)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Catering Preference
                      </label>
                      <select
                        value={rsvpData.foodPreference}
                        onChange={e =>
                          setRsvpData({
                            ...rsvpData,
                            foodPreference: e.target.value as 'vegetarian' | 'jain' | 'all',
                          })
                        }
                        className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-rose-400 bg-white"
                      >
                        <option value="vegetarian">Pure Vegetarian Feast</option>
                        <option value="jain">Jain Vegetarian (No Onion/Garlic)</option>
                        <option value="all">All Gourmet Awadhi Delicacies</option>
                      </select>
                    </div>
                  </div>

                  {/* Events selection */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Ceremonies You Will Grace
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'mehendi', label: '💃 Mehndi — 8 Dec, 12 PM' },
                        { id: 'sangeet', label: '🎶 Sangeet — 8 Dec, 6 PM' },
                        { id: 'haldi',   label: '🌸 Haldi — 9 Dec, 10 AM' },
                        { id: 'wedding', label: '💍 Wedding — 9 Dec, 8 PM' },
                      ].map(evt => {
                        const checked = rsvpData.attendingEvents.includes(evt.id);
                        return (
                          <label
                            key={evt.id}
                            className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                              checked
                                ? 'bg-rose-50 border-rose-300 text-rose-800'
                                : 'bg-stone-50 border-stone-200 text-stone-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleEvent(evt.id)}
                              className="accent-rose-500 rounded"
                            />
                            <span>{evt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Sangeet Song Request (Optional)
                    </label>
                    <input
                      type="text"
                      value={rsvpData.songRequest}
                      onChange={e => setRsvpData({ ...rsvpData, songRequest: e.target.value })}
                      placeholder="e.g. Gallan Goodiyaan / Kesariya / Mauja Hi Mauja"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Any Special Note or Dietary Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={rsvpData.note}
                      onChange={e => setRsvpData({ ...rsvpData, note: e.target.value })}
                      placeholder="e.g. wheelchair access needed, nut allergy..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-rose-400 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={rsvpSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:opacity-60 text-white font-medium rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      {rsvpSubmitting
                        ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting…</span></>
                        : <><CheckCircle className="w-4 h-4" /><span>Confirm &amp; Send RSVP</span></>
                      }
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Success */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900">
                    RSVP Confirmed, {rsvpData.name}!
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto leading-relaxed">
                    Saurabh and Shreya are overjoyed to welcome you and your party of{' '}
                    <strong className="text-stone-900">{rsvpData.guestCount}</strong>. Your arrival
                    has been noted with our hospitality desk.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 text-xs text-left space-y-1.5">
                  <div className="flex justify-between text-stone-600">
                    <span>Events Selected:</span>
                    <strong className="text-rose-600 font-mono">
                      {rsvpData.attendingEvents.length} ceremonies
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Catering Choice:</span>
                    <strong className="text-stone-800 capitalize">{rsvpData.foodPreference}</strong>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => { setRsvpSubmitted(false); onCloseRSVP(); }}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-colors"
                  >
                    Done &amp; Return to Website
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
