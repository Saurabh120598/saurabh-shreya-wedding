// All data operations go through Firestore directly — no backend server needed.
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// ── Helpers ───────────────────────────────────────────────────────────────────
function tsToISO(ts: Timestamp | undefined): string {
  return ts ? ts.toDate().toISOString() : new Date().toISOString();
}

// Compress a base64 image to under 500 KB before saving to Firestore
export async function compressImage(dataUrl: string, maxKB = 450): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      let quality = 0.8;
      let result = dataUrl;
      const canvas = document.createElement('canvas');
      // Scale down if very large
      const MAX_DIM = 1200;
      let w = img.width, h = img.height;
      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      // Reduce quality until under maxKB
      while (quality > 0.2) {
        result = canvas.toDataURL('image/jpeg', quality);
        if (result.length * 0.75 < maxKB * 1024) break;
        quality -= 0.1;
      }
      resolve(result);
    };
    img.src = dataUrl;
  });
}

// ════════════════════════════════════════════════════════════════════
//  RSVP
// ════════════════════════════════════════════════════════════════════
export interface RSVPPayload {
  name: string;
  email: string;
  phone: string;
  guestCount: number;
  attendingEvents: string[];
  foodPreference: string;
  songRequest?: string;
  note?: string;
}

export async function submitRSVP(data: RSVPPayload): Promise<{ ok: boolean; id: string }> {
  const ref = await addDoc(collection(db, 'rsvp'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { ok: true, id: ref.id };
}

// ════════════════════════════════════════════════════════════════════
//  WISHES
// ════════════════════════════════════════════════════════════════════
export interface WishPayload {
  senderName: string;
  relation: string;
  message: string;
  sticker: string;
}

export interface WishEntry {
  id: string;
  submittedAt: string;
  senderName: string;
  relation: string;
  message: string;
  sticker: string;
  likes: number;
}

export async function fetchWishes(): Promise<WishEntry[]> {
  const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    submittedAt: tsToISO(d.data().createdAt as Timestamp),
    senderName: d.data().senderName,
    relation: d.data().relation,
    message: d.data().message,
    sticker: d.data().sticker,
    likes: d.data().likes ?? 0,
  }));
}

export async function postWish(data: WishPayload): Promise<{ ok: boolean; id: string; entry: WishEntry }> {
  const ref = await addDoc(collection(db, 'wishes'), {
    ...data,
    likes: 0,
    createdAt: serverTimestamp(),
  });
  const entry: WishEntry = {
    id: ref.id,
    submittedAt: new Date().toISOString(),
    ...data,
    likes: 0,
  };
  return { ok: true, id: ref.id, entry };
}

export async function likeWish(id: string): Promise<{ ok: boolean; likes: number }> {
  await updateDoc(doc(db, 'wishes', id), { likes: increment(1) });
  return { ok: true, likes: 0 }; // optimistic — actual count updated in Firestore
}

// ════════════════════════════════════════════════════════════════════
//  GUEST PHOTOS
// ════════════════════════════════════════════════════════════════════
export interface PhotoEntry {
  id: string;
  submittedAt: string;
  url: string;
  caption: string;
  likes: number;
}

export async function fetchGuestPhotos(): Promise<PhotoEntry[]> {
  const q = query(collection(db, 'guestPhotos'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    submittedAt: tsToISO(d.data().createdAt as Timestamp),
    url: d.data().url,
    caption: d.data().caption,
    likes: d.data().likes ?? 0,
  }));
}

export async function postGuestPhoto(data: { url: string; caption: string }): Promise<{ ok: boolean; id: string; entry: PhotoEntry }> {
  // Compress before saving to Firestore (keeps under 1MB document limit)
  const compressed = await compressImage(data.url);
  const ref = await addDoc(collection(db, 'guestPhotos'), {
    url: compressed,
    caption: data.caption,
    likes: 1,
    createdAt: serverTimestamp(),
  });
  const entry: PhotoEntry = {
    id: ref.id,
    submittedAt: new Date().toISOString(),
    url: compressed,
    caption: data.caption,
    likes: 1,
  };
  return { ok: true, id: ref.id, entry };
}

export async function likePhoto(id: string): Promise<{ ok: boolean; likes: number }> {
  await updateDoc(doc(db, 'guestPhotos', id), { likes: increment(1) });
  return { ok: true, likes: 0 };
}
