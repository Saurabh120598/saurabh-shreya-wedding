import React, { useState, useEffect } from 'react';
import {
  Heart,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { GalleryPhoto } from '../types/wedding';
import confetti from 'canvas-confetti';
import { weddingAudio } from '../utils/audioPlayer';
import { fetchGuestPhotos, postGuestPhoto, likePhoto, PhotoEntry } from '../utils/api';

import heroCoupleImg from '../assets/images/hero_couple_1790261249180.jpg';
import coupleHaldiImg from '../assets/images/couple_haldi_1790261269833.jpg';
import coupleSangeetImg from '../assets/images/couple_sangeet_1790261286602.jpg';
import coupleCandidImg from '../assets/images/couple_candid_1790261302031.jpg';

// Built-in couple photos always shown (not persisted to server)
const COUPLE_PHOTOS: GalleryPhoto[] = [
  {
    id: 'p1',
    url: heroCoupleImg,
    caption: 'Saurabh & Shreya — An endless promise of laughter and devotion',
    category: 'prewedding',
    date: 'Autumn Pre-Wedding Shoot',
    likes: 142,
  },
  {
    id: 'p2',
    url: coupleHaldiImg,
    caption: 'Vibrant yellow blooms & pure joy at the auspicious Haldi Utsav',
    category: 'haldi',
    date: 'Haldi & Floral Celebration',
    likes: 98,
  },
  {
    id: 'p3',
    url: coupleSangeetImg,
    caption: 'Twirling under starlit canopies at our magical Sangeet Night',
    category: 'sangeet',
    date: 'Musical Sangeet Gala',
    likes: 124,
  },
  {
    id: 'p4',
    url: coupleCandidImg,
    caption: 'Candid chai dates, deep conversations, and how forever started',
    category: 'prewedding',
    date: 'Garden Cafe Memories',
    likes: 87,
  },
];

// Convert server PhotoEntry → GalleryPhoto shape
function toGalleryPhoto(p: PhotoEntry): GalleryPhoto {
  return {
    id: p.id,
    url: p.url,
    caption: p.caption,
    category: 'prewedding',
    date: `Uploaded by Guest · ${new Date(p.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
    likes: p.likes,
  };
}

export function Gallery() {
  const [guestPhotos, setGuestPhotos] = useState<GalleryPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);

  // All photos = couple photos + guest photos (guest photos prepended)
  const photos = [...guestPhotos, ...COUPLE_PHOTOS];

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'prewedding' | 'haldi' | 'sangeet'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});

  // Guest upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadPosting, setUploadPosting] = useState(false);

  // Load guest photos from server on mount
  useEffect(() => {
    fetchGuestPhotos()
      .then(data => setGuestPhotos(data.map(toGalleryPhoto)))
      .catch(() => {/* server not running yet */})
      .finally(() => setPhotosLoading(false));
  }, []);

  const filteredPhotos = photos.filter(
    p => selectedFilter === 'all' || p.category === selectedFilter
  );

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    weddingAudio.playChime();

    const isLiked = likedPhotos[id];
    // Optimistic update for couple photos or guest photos
    setGuestPhotos(prev => prev.map(p => p.id === id ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p));
    setLikedPhotos(prev => ({ ...prev, [id]: !prev[id] }));

    confetti({
      particleCount: 20,
      spread: 40,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#FF69B4', '#FFB6C1', '#F43F5E'],
    });

    // Persist like for guest photos only
    if (id.startsWith('photo-')) {
      try {
        await likePhoto(id);
      } catch {
        // Revert
        setGuestPhotos(prev => prev.map(p => p.id === id ? { ...p, likes: isLiked ? p.likes + 1 : p.likes - 1 } : p));
        setLikedPhotos(prev => ({ ...prev, [id]: !!isLiked }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGuestPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedPreview) return;
    setUploadPosting(true);
    try {
      const res = await postGuestPhoto({
        url: uploadedPreview,
        caption: uploadCaption.trim() || 'Guest Memory for Saurabh & Shreya',
      });
      setGuestPhotos(prev => [toGalleryPhoto(res.entry), ...prev]);
      setShowUploadModal(false);
      setUploadedPreview(null);
      setUploadCaption('');
      confetti({ particleCount: 60, spread: 60, colors: ['#FFB6C1', '#FF69B4', '#F59E0B'] });
    } catch {
      alert('Could not upload photo right now. Please try again.');
    } finally {
      setUploadPosting(false);
    }
  };

  const currentLightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-16 md:py-24 bg-[#FFFDF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              Precious Memories &amp; Moments
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 font-medium">
              Saurabh &amp; Shreya's Gallery
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Glimpses of shared laughter, quiet sunset walks, and celebration frames leading up to our forever.
            </p>
          </div>

          {/* Guest upload memory button */}
          <div>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium rounded-full shadow-xs text-xs transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add Your Guest Photo</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'prewedding', label: 'Pre-Wedding & Dates' },
            { id: 'haldi', label: 'Haldi & Blossoms' },
            { id: 'sangeet', label: 'Sangeet & Dance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as typeof selectedFilter)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => {
            const isLiked = likedPhotos[photo.id];
            return (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container with Styled Fallback */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-rose-50">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 bg-white/90 rounded-full text-stone-900 shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Date badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-stone-900/60 backdrop-blur-md rounded-full text-[10px] text-white font-medium">
                    {photo.date}
                  </div>
                </div>

                {/* Caption & Hearts */}
                <div className="mt-3 flex items-start justify-between gap-2 px-1 pb-1">
                  <p className="text-xs text-stone-700 font-medium line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                  
                  <button
                    type="button"
                    onClick={(e) => handleLike(photo.id, e)}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full hover:bg-rose-50 transition-colors shrink-0"
                    title="Like this photo"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isLiked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-stone-400'
                      }`}
                    />
                    <span className="font-mono text-[11px] text-stone-500">{photo.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      {currentLightboxPhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Controls */}
          {filteredPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Lightbox Content */}
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
              <img
                src={currentLightboxPhoto.url}
                alt={currentLightboxPhoto.caption}
                className="max-h-[75vh] w-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-4 text-center text-white max-w-xl">
              <p className="text-base font-serif font-medium">{currentLightboxPhoto.caption}</p>
              <div className="flex items-center justify-center gap-3 mt-2 text-xs text-white/70">
                <span>{currentLightboxPhoto.date}</span>
                <span>·</span>
                <span>
                  Photo {lightboxIndex + 1} of {filteredPhotos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Upload Polaroid Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
              aria-label="Close upload modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Pin Your Memory with Saurabh &amp; Shreya
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Upload a candid selfie or photo with the couple to display on the live celebration board!
              </p>
            </div>

            <form onSubmit={handleAddGuestPhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Select Photo
                </label>
                <label className="border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-rose-50/30 hover:bg-rose-50 transition-colors">
                  {uploadedPreview ? (
                    <img
                      src={uploadedPreview}
                      alt="Preview"
                      className="max-h-40 rounded-xl object-contain"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-rose-400 mb-2" />
                      <span className="text-xs text-rose-700 font-medium">Click to select photo</span>
                      <span className="text-[10px] text-stone-400 mt-0.5">PNG, JPG, WebP supported</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Caption or Blessing
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="e.g., So excited for Saurabh & Shreya's big day! - Priya"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none"
                  maxLength={100}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadedPreview || uploadPosting}
                  className="px-5 py-2 text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {uploadPosting
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Uploading…</span></>
                    : <span>Pin to Couple's Album</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
