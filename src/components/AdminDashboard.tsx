import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Shield,
  Users,
  MessageSquareHeart,
  Camera,
  Calendar,
  Utensils,
  Music,
  Phone,
  Mail,
  Clock,
  Heart,
  LogOut,
  RefreshCw,
  Download,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface RSVPEntry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  guestCount: number;
  attendingEvents: string[];
  foodPreference: string;
  songRequest?: string;
  note?: string;
}

interface WishEntry {
  id: string;
  createdAt: string;
  senderName: string;
  relation: string;
  message: string;
  sticker: string;
  likes: number;
}

interface PhotoEntry {
  id: string;
  createdAt: string;
  url: string;
  caption: string;
  likes: number;
}

function tsToStr(ts: Timestamp | undefined): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const ADMIN_KEY = 'saurabh2026';

const EVENT_LABELS: Record<string, string> = {
  mehendi: '💃 Mehndi',
  sangeet: '🎶 Sangeet',
  haldi:   '🌸 Haldi',
  wedding: '💍 Wedding',
};

// ── Export to CSV ─────────────────────────────────────────────────────────────
function exportCSV(rsvpList: RSVPEntry[]) {
  const header = ['Name', 'Phone', 'Email', 'Guests', 'Events', 'Food', 'Song Request', 'Note', 'Submitted'];
  const rows = rsvpList.map(r => [
    r.name, r.phone, r.email || '', r.guestCount,
    r.attendingEvents.join(' | '),
    r.foodPreference,
    r.songRequest || '',
    r.note || '',
    r.createdAt,
  ]);
  const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wedding-rsvp.csv';
  a.click();
}

// ══════════════════════════════════════════════════════════════════════════════
export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState(false);

  const [rsvpList, setRsvpList]   = useState<RSVPEntry[]>([]);
  const [wishes, setWishes]       = useState<WishEntry[]>([]);
  const [photos, setPhotos]       = useState<PhotoEntry[]>([]);
  const [loading, setLoading]     = useState(false);
  const [activeTab, setActiveTab] = useState<'rsvp' | 'wishes' | 'photos'>('rsvp');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput === ADMIN_KEY) {
      setAuthed(true);
      setKeyError(false);
    } else {
      setKeyError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [rsvpSnap, wishSnap, photoSnap] = await Promise.all([
        getDocs(query(collection(db, 'rsvp'),         orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'wishes'),       orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'guestPhotos'),  orderBy('createdAt', 'desc'))),
      ]);

      setRsvpList(rsvpSnap.docs.map(d => ({
        id: d.id,
        createdAt: tsToStr(d.data().createdAt as Timestamp),
        name: d.data().name,
        phone: d.data().phone,
        email: d.data().email || '',
        guestCount: d.data().guestCount,
        attendingEvents: d.data().attendingEvents || [],
        foodPreference: d.data().foodPreference,
        songRequest: d.data().songRequest,
        note: d.data().note,
      })));

      setWishes(wishSnap.docs.map(d => ({
        id: d.id,
        createdAt: tsToStr(d.data().createdAt as Timestamp),
        senderName: d.data().senderName,
        relation: d.data().relation,
        message: d.data().message,
        sticker: d.data().sticker,
        likes: d.data().likes ?? 0,
      })));

      setPhotos(photoSnap.docs.map(d => ({
        id: d.id,
        createdAt: tsToStr(d.data().createdAt as Timestamp),
        url: d.data().url,
        caption: d.data().caption,
        likes: d.data().likes ?? 0,
      })));
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  const totalGuests = rsvpList.reduce((s, r) => s + r.guestCount, 0);
  const eventTally = rsvpList.reduce<Record<string, number>>((acc, r) => {
    r.attendingEvents.forEach(e => { acc[e] = (acc[e] || 0) + r.guestCount; });
    return acc;
  }, {});

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-rose-100 shadow-lg text-center">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-1">Admin Dashboard</h1>
          <p className="text-xs text-stone-500 mb-6">Saurabh &amp; Shreya's Wedding</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="Enter admin key"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none text-center tracking-widest ${
                  keyError ? 'border-red-400 bg-red-50' : 'border-stone-200 focus:border-rose-400'
                }`}
              />
              {keyError && <p className="text-xs text-red-500 mt-1">Incorrect key. Try again.</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-sm font-medium"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFFDF9]">

      {/* Header */}
      <div className="bg-white border-b border-rose-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-lg font-serif font-bold text-stone-900">💍 Wedding Admin</h1>
          <p className="text-xs text-stone-400">Saurabh &amp; Shreya · Dec 8–9, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 border border-stone-200 rounded-full hover:bg-stone-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setAuthed(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 border border-rose-200 rounded-full hover:bg-rose-50"
          >
            <LogOut className="w-3 h-3" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users,              label: 'RSVPs',          value: rsvpList.length,  color: 'text-rose-500',   bg: 'bg-rose-50'   },
            { icon: Users,              label: 'Total Guests',   value: totalGuests,      color: 'text-amber-600',  bg: 'bg-amber-50'  },
            { icon: MessageSquareHeart, label: 'Wishes',         value: wishes.length,    color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: Camera,             label: 'Guest Photos',   value: photos.length,    color: 'text-emerald-600',bg: 'bg-emerald-50'},
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-serif font-bold text-stone-900">{s.value}</div>
              <div className="text-xs text-stone-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Event attendance tally */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs mb-8">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Guests per Ceremony</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(EVENT_LABELS).map(([id, label]) => (
              <div key={id} className="text-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="text-xl font-serif font-bold text-stone-900">{eventTally[id] || 0}</div>
                <div className="text-xs text-stone-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { id: 'rsvp',   label: `RSVPs (${rsvpList.length})`,   icon: Calendar             },
            { id: 'wishes', label: `Wishes (${wishes.length})`,     icon: MessageSquareHeart   },
            { id: 'photos', label: `Photos (${photos.length})`,     icon: Camera               },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── RSVP Tab ── */}
        {activeTab === 'rsvp' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-stone-800">All RSVPs</h2>
              <button
                onClick={() => exportCSV(rsvpList)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-900 text-white rounded-full hover:bg-stone-700"
              >
                <Download className="w-3 h-3" />
                Export CSV
              </button>
            </div>
            {rsvpList.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-sm">No RSVPs yet</div>
            ) : (
              <div className="space-y-4">
                {rsvpList.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-stone-900">{r.name}</h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-stone-500">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3"/>{r.phone}</span>
                          {r.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3"/>{r.email}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{r.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold border border-rose-100">
                          👥 {r.guestCount} guest{r.guestCount > 1 ? 's' : ''}
                        </span>
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-100 capitalize">
                          <Utensils className="w-3 h-3 inline mr-1"/>{r.foodPreference}
                        </span>
                      </div>
                    </div>

                    {/* Events attending */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {r.attendingEvents.map(e => (
                        <span key={e} className="px-2.5 py-0.5 bg-stone-50 text-stone-600 rounded-full text-xs border border-stone-200">
                          {EVENT_LABELS[e] || e}
                        </span>
                      ))}
                    </div>

                    {/* Song request & note */}
                    {(r.songRequest || r.note) && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {r.songRequest && (
                          <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-xs">
                            <span className="font-semibold text-purple-700 flex items-center gap-1 mb-0.5">
                              <Music className="w-3 h-3"/> Song Request
                            </span>
                            <span className="text-stone-700">{r.songRequest}</span>
                          </div>
                        )}
                        {r.note && (
                          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                            <span className="font-semibold text-stone-600 block mb-0.5">📝 Note</span>
                            <span className="text-stone-700">{r.note}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Wishes Tab ── */}
        {activeTab === 'wishes' && (
          <div>
            <h2 className="text-base font-semibold text-stone-800 mb-4">All Guestbook Wishes</h2>
            {wishes.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-sm">No wishes yet</div>
            ) : (
              <div className="space-y-4">
                {wishes.map(w => (
                  <div key={w.id} className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{w.sticker}</span>
                        <div>
                          <h3 className="font-serif font-bold text-stone-900">{w.senderName}</h3>
                          <p className="text-xs text-rose-600">{w.relation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-400 flex-shrink-0">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400"/>{w.likes}</span>
                        <span>{w.createdAt}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-stone-700 italic bg-rose-50/50 p-3 rounded-xl border border-rose-100 leading-relaxed">
                      "{w.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Photos Tab ── */}
        {activeTab === 'photos' && (
          <div>
            <h2 className="text-base font-semibold text-stone-800 mb-4">Guest Uploaded Photos</h2>
            {photos.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-sm">No guest photos yet</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {photos.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs">
                    <img
                      src={p.url}
                      alt={p.caption}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm text-stone-700 font-medium line-clamp-2">{p.caption}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-stone-400">
                        <span>{p.createdAt}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400"/> {p.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
