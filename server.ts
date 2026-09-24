import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '10mb' })); // allow base64 photo uploads
app.use(express.urlencoded({ extended: true }));

// ── Serve Vite build ──────────────────────────────────────────────────────────
const DIST = path.join(__dirname, 'dist');
app.use(express.static(DIST));

// ── Persistent JSON data store ────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function readJson<T>(file: string, fallback: T): T {
  const fp = path.join(DATA_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface RSVPEntry {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  guestCount: number;
  attendingEvents: string[];
  foodPreference: string;
  songRequest?: string;
  note?: string;
}

interface WishEntry {
  id: string;
  submittedAt: string;
  senderName: string;
  relation: string;
  message: string;
  sticker: string;
  likes: number;
}

interface GuestPhotoEntry {
  id: string;
  submittedAt: string;
  url: string;       // base64 data-URL
  caption: string;
  likes: number;
}

// ── CORS for dev (Vite runs on :3000, server on :3001) ───────────────────────
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.options('*', (_req, res) => res.sendStatus(204));

// ════════════════════════════════════════════════════════════════════
//  API — RSVP
// ════════════════════════════════════════════════════════════════════

// POST /api/rsvp  — submit RSVP
app.post('/api/rsvp', (req: Request, res: Response) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    res.status(400).json({ error: 'name and phone are required' });
    return;
  }
  const list = readJson<RSVPEntry[]>('rsvp.json', []);
  const entry: RSVPEntry = {
    id: `rsvp-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    name: String(req.body.name).trim(),
    email: String(req.body.email || '').trim(),
    phone: String(req.body.phone).trim(),
    guestCount: Number(req.body.guestCount) || 1,
    attendingEvents: Array.isArray(req.body.attendingEvents) ? req.body.attendingEvents : [],
    foodPreference: String(req.body.foodPreference || 'vegetarian'),
    songRequest: String(req.body.songRequest || '').trim() || undefined,
    note: String(req.body.note || '').trim() || undefined,
  };
  list.push(entry);
  writeJson('rsvp.json', list);
  console.log(`[RSVP] ${entry.name} (+${entry.guestCount}) — ${entry.attendingEvents.join(', ')}`);
  res.status(201).json({ ok: true, id: entry.id });
});

// GET /api/rsvp  — list all (admin use)
app.get('/api/rsvp', (req: Request, res: Response) => {
  if (!checkAdminKey(req)) { res.status(401).json({ error: 'unauthorized' }); return; }
  res.json(readJson<RSVPEntry[]>('rsvp.json', []));
});

// ════════════════════════════════════════════════════════════════════
//  API — WISHES / GUESTBOOK
// ════════════════════════════════════════════════════════════════════

// GET /api/wishes — public, returns all wishes
app.get('/api/wishes', (_req: Request, res: Response) => {
  res.json(readJson<WishEntry[]>('wishes.json', []));
});

// POST /api/wishes — submit a new wish
app.post('/api/wishes', (req: Request, res: Response) => {
  const { senderName, message } = req.body;
  if (!senderName || !message) {
    res.status(400).json({ error: 'senderName and message are required' });
    return;
  }
  const list = readJson<WishEntry[]>('wishes.json', []);
  const entry: WishEntry = {
    id: `wish-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    senderName: String(senderName).trim(),
    relation: String(req.body.relation || 'Well-wisher').trim(),
    message: String(message).trim(),
    sticker: String(req.body.sticker || '💖'),
    likes: 0,
  };
  list.unshift(entry); // newest first
  writeJson('wishes.json', list);
  console.log(`[WISH] ${entry.senderName}: "${entry.message.slice(0, 60)}..."`);
  res.status(201).json({ ok: true, id: entry.id, entry });
});

// PATCH /api/wishes/:id/like — increment like count
app.patch('/api/wishes/:id/like', (req: Request, res: Response) => {
  const list = readJson<WishEntry[]>('wishes.json', []);
  const idx = list.findIndex(w => w.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'not found' }); return; }
  list[idx].likes += 1;
  writeJson('wishes.json', list);
  res.json({ ok: true, likes: list[idx].likes });
});

// ════════════════════════════════════════════════════════════════════
//  API — GUEST PHOTOS
// ════════════════════════════════════════════════════════════════════

// GET /api/photos — public, returns all guest-uploaded photos (no base64, just meta + url)
app.get('/api/photos', (_req: Request, res: Response) => {
  res.json(readJson<GuestPhotoEntry[]>('photos.json', []));
});

// POST /api/photos — upload a guest photo (base64 url in body)
app.post('/api/photos', (req: Request, res: Response) => {
  const { url, caption } = req.body;
  if (!url) { res.status(400).json({ error: 'url (base64) is required' }); return; }
  const list = readJson<GuestPhotoEntry[]>('photos.json', []);
  const entry: GuestPhotoEntry = {
    id: `photo-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    url: String(url),
    caption: String(caption || 'Guest Memory ❤️').trim(),
    likes: 1,
  };
  list.unshift(entry);
  writeJson('photos.json', list);
  console.log(`[PHOTO] New guest photo: "${entry.caption}"`);
  res.status(201).json({ ok: true, id: entry.id, entry });
});

// PATCH /api/photos/:id/like
app.patch('/api/photos/:id/like', (req: Request, res: Response) => {
  const list = readJson<GuestPhotoEntry[]>('photos.json', []);
  const idx = list.findIndex(p => p.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'not found' }); return; }
  list[idx].likes += 1;
  writeJson('photos.json', list);
  res.json({ ok: true, likes: list[idx].likes });
});

// ════════════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD  —  /admin?key=YOUR_ADMIN_KEY
// ════════════════════════════════════════════════════════════════════

const ADMIN_KEY = process.env.ADMIN_KEY || 'saurabh2026';

function checkAdminKey(req: Request): boolean {
  return req.query.key === ADMIN_KEY || req.headers['x-admin-key'] === ADMIN_KEY;
}

app.get('/admin', (req: Request, res: Response) => {
  if (!checkAdminKey(req)) {
    res.status(401).send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#fdf8f0">
        <h2>🔒 Admin Access Required</h2>
        <p>Add <code>?key=YOUR_ADMIN_KEY</code> to the URL.</p>
        <p>Default key during development: <code>saurabh2026</code></p>
        <p>Set <code>ADMIN_KEY</code> env variable to change it.</p>
      </body></html>
    `);
    return;
  }

  const rsvpList  = readJson<RSVPEntry[]>('rsvp.json', []);
  const wishesList = readJson<WishEntry[]>('wishes.json', []);
  const photosList = readJson<GuestPhotoEntry[]>('photos.json', []);

  const attendingCount = rsvpList.reduce((s, r) => s + r.guestCount, 0);

  const eventTally: Record<string, number> = {};
  rsvpList.forEach(r => r.attendingEvents.forEach(e => {
    eventTally[e] = (eventTally[e] || 0) + r.guestCount;
  }));

  const foodTally: Record<string, number> = {};
  rsvpList.forEach(r => {
    foodTally[r.foodPreference] = (foodTally[r.foodPreference] || 0) + r.guestCount;
  });

  const rsvpRows = rsvpList.map(r => `
    <tr>
      <td>${new Date(r.submittedAt).toLocaleString('en-IN')}</td>
      <td><strong>${esc(r.name)}</strong></td>
      <td>${esc(r.phone)}</td>
      <td>${esc(r.email || '—')}</td>
      <td style="text-align:center">${r.guestCount}</td>
      <td>${r.attendingEvents.join(', ')}</td>
      <td>${esc(r.foodPreference)}</td>
      <td>${esc(r.songRequest || '—')}</td>
      <td>${esc(r.note || '—')}</td>
    </tr>`).join('');

  const wishRows = wishesList.map(w => `
    <tr>
      <td>${new Date(w.submittedAt).toLocaleString('en-IN')}</td>
      <td>${w.sticker}</td>
      <td><strong>${esc(w.senderName)}</strong></td>
      <td>${esc(w.relation)}</td>
      <td>${esc(w.message)}</td>
      <td style="text-align:center">❤ ${w.likes}</td>
    </tr>`).join('');

  const photoCards = photosList.map(p => `
    <div style="display:inline-block;margin:8px;vertical-align:top;background:#fff;border:1px solid #e8d9b5;padding:10px;border-radius:8px;max-width:200px">
      <img src="${p.url}" style="width:180px;height:130px;object-fit:cover;border-radius:6px;display:block"/>
      <div style="font-size:11px;color:#555;margin-top:6px">${esc(p.caption)}</div>
      <div style="font-size:10px;color:#999;margin-top:3px">${new Date(p.submittedAt).toLocaleString('en-IN')} · ❤ ${p.likes}</div>
    </div>`).join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Wedding Admin — Saurabh & Shreya</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'Segoe UI',sans-serif;background:#fdf8f0;color:#2c1a0e;font-size:13px}
header{background:#2c1a0e;color:#f5ead4;padding:18px 32px;display:flex;align-items:center;justify-content:space-between}
header h1{font-size:20px;font-weight:400;letter-spacing:.05em}
header span{font-size:11px;opacity:.6}
.wrap{max-width:1300px;margin:0 auto;padding:28px 24px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:32px}
.stat{background:#fff;border:1px solid #e8d9b5;border-top:3px solid #b8962e;padding:18px 16px}
.stat .num{font-size:36px;font-weight:300;color:#b8962e;line-height:1}
.stat .lbl{font-size:11px;color:#7a6045;text-transform:uppercase;letter-spacing:.1em;margin-top:4px}
h2{font-size:16px;font-weight:600;color:#2c1a0e;margin:28px 0 14px;padding-bottom:6px;border-bottom:1px solid #e8d9b5}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e8d9b5;font-size:12px}
th{background:#fdf3e3;padding:9px 12px;text-align:left;font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#7a6045;border-bottom:2px solid #e8d9b5}
td{padding:9px 12px;border-bottom:1px solid #f0e8d8;vertical-align:top;max-width:220px;word-break:break-word}
tr:hover td{background:#fffdf9}
.pill{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600}
.empty{padding:32px;text-align:center;color:#b0a090;font-style:italic}
</style>
</head>
<body>
<header>
  <h1>💍 Wedding Admin — Saurabh &amp; Shreya</h1>
  <span>Dec 8–9, 2026 · Bundigarh Resort, Lucknow</span>
</header>
<div class="wrap">

  <!-- Stats -->
  <div class="stats">
    <div class="stat"><div class="num">${rsvpList.length}</div><div class="lbl">RSVPs Received</div></div>
    <div class="stat"><div class="num">${attendingCount}</div><div class="lbl">Total Guests Attending</div></div>
    <div class="stat"><div class="num">${wishesList.length}</div><div class="lbl">Wishes Posted</div></div>
    <div class="stat"><div class="num">${photosList.length}</div><div class="lbl">Guest Photos Uploaded</div></div>
    <div class="stat"><div class="num">${eventTally['wedding'] || 0}</div><div class="lbl">Wedding Attendees</div></div>
    <div class="stat"><div class="num">${foodTally['vegetarian'] || 0}</div><div class="lbl">Vegetarian Guests</div></div>
  </div>

  <!-- RSVP Table -->
  <h2>📋 RSVP Submissions (${rsvpList.length})</h2>
  ${rsvpList.length === 0 ? '<div class="empty">No RSVPs yet</div>' : `
  <div style="overflow-x:auto"><table>
    <thead><tr>
      <th>Submitted</th><th>Name</th><th>Phone</th><th>Email</th>
      <th>Guests</th><th>Events</th><th>Food</th><th>Song Request</th><th>Note</th>
    </tr></thead>
    <tbody>${rsvpRows}</tbody>
  </table></div>`}

  <!-- Wishes Table -->
  <h2>💌 Guestbook Wishes (${wishesList.length})</h2>
  ${wishesList.length === 0 ? '<div class="empty">No wishes yet</div>' : `
  <div style="overflow-x:auto"><table>
    <thead><tr>
      <th>Submitted</th><th>Sticker</th><th>Name</th><th>Relation</th><th>Message</th><th>Likes</th>
    </tr></thead>
    <tbody>${wishRows}</tbody>
  </table></div>`}

  <!-- Guest Photos -->
  <h2>📸 Guest Photos (${photosList.length})</h2>
  ${photosList.length === 0
    ? '<div class="empty">No guest photos yet</div>'
    : `<div>${photoCards}</div>`}

</div>
</body>
</html>`);
});

function esc(str: string): string {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  const index = path.join(DIST, 'index.html');
  if (fs.existsSync(index)) {
    res.sendFile(index);
  } else {
    res.status(404).send('Run `npm run build` first.');
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`\n🎊 Wedding server running at http://localhost:${PORT}`);
  console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin?key=${ADMIN_KEY}\n`);
});
