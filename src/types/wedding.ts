export interface WeddingEvent {
  id: string;
  name: string;
  subName?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  description: string;
  themeColor: string;
  calendarTitle: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category: 'all' | 'prewedding' | 'haldi' | 'sangeet';
  date: string;
  likes: number;
}

export interface HotlineContact {
  id: string;
  role: string;
  name: string;
  relation: string;
  phone: string;
  whatsapp: string;
  duty: string;
  avatarColor: string;
  availableHours: string;
}

export interface GuestWish {
  id: string;
  senderName: string;
  relation: string;
  message: string;
  sticker: string;
  timestamp: string;
  likes: number;
}

export interface RSVPSubmission {
  name: string;
  email: string;
  phone: string;
  guestCount: number;
  attendingEvents: string[];
  foodPreference: 'vegetarian' | 'jain' | 'all';
  songRequest?: string;
  note?: string;
}
