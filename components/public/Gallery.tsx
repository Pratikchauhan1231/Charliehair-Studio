"use client";

import React, { useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const GALLERY_IMAGES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80",
    title: "Precision Razor Fade & Beard Sculpting",
    category: "Men's Grooming",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",
    title: "Luxury Unisex Salon Interior & Styling Stations",
    category: "Studio Ambience",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80",
    title: "Balayage Highlights & Blowout",
    category: "Hair Coloring",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=80",
    title: "Classic Barber Tools & Fine Shears",
    category: "Artisanal Craft",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
    title: "Casmara Algae Peel-Off Facial",
    category: "Skin Aesthetics",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80",
    title: "HD Bridal Hairstyling & Crown Setting",
    category: "Bridal Artistry",
  },
];

export default function Gallery() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const nextImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % GALLERY_IMAGES.length);
    }
  };

  const prevImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-charcoal-900 relative border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            Visual Portfolio
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-offwhite mb-4">
            The Charlie Showcase
          </h2>
          <p className="text-muted text-sm sm:text-base">
            Glimpse our work, premium grooming tools, and the tranquil ambience at our studio in Ahmedabad.
          </p>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-charcoal-800 cursor-pointer border border-charcoal-700/60 shadow-lg"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 mb-1">
                  {img.category}
                </span>
                <h4 className="font-serif text-sm font-semibold text-offwhite flex items-center justify-between">
                  {img.title}
                  <ZoomIn className="w-4 h-4 text-gold-400" />
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-charcoal-800 text-offwhite hover:text-gold-400 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal-900/80 text-offwhite hover:text-gold-400 border border-charcoal-700 transition-colors z-50"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={GALLERY_IMAGES[activeImageIndex].src}
              alt={GALLERY_IMAGES[activeImageIndex].title}
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl border border-charcoal-700"
            />
            <div className="mt-4 text-center">
              <span className="text-xs uppercase font-bold text-gold-400 tracking-wider">
                {GALLERY_IMAGES[activeImageIndex].category}
              </span>
              <p className="font-serif text-lg font-medium text-offwhite mt-1">
                {GALLERY_IMAGES[activeImageIndex].title}
              </p>
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal-900/80 text-offwhite hover:text-gold-400 border border-charcoal-700 transition-colors z-50"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
