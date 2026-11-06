"use client";

import React, { useState } from "react";
import { Review } from "@/types";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface ReviewsProps {
  reviews: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const current = reviews[currentIndex];

  return (
    <section id="reviews" className="py-24 bg-charcoal-950 relative border-t border-charcoal-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Client Testimonials
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-offwhite mb-4">
            Words From Our Clients
          </h2>
          <p className="text-muted text-sm sm:text-base">
            Discover why gentlemen and ladies across Ahmedabad trust Charlie Hair Studio for their crowning glory.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="relative bg-charcoal-900 border border-charcoal-800 rounded-3xl p-8 sm:p-14 shadow-2xl overflow-hidden max-w-3xl mx-auto">
          <Quote className="w-16 h-16 text-gold-500/10 absolute -top-2 -left-2 -rotate-12 pointer-events-none" />

          <div className="relative z-10 text-center">
            {/* Star Rating */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < (current?.rating || 5)
                      ? "fill-gold-400 text-gold-400"
                      : "text-charcoal-700"
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="font-serif italic text-lg sm:text-2xl text-beige-100 leading-relaxed mb-8">
              &ldquo;{current?.comment}&rdquo;
            </p>

            {/* Author Info */}
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-offwhite">
                {current?.author}
              </h4>
              <p className="text-xs text-gold-400 font-medium mt-0.5">{current?.serviceName}</p>
              <span className="text-[11px] text-muted block mt-1">{current?.date}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-charcoal-800">
            <button
              onClick={prevReview}
              className="p-2.5 rounded-full bg-charcoal-850 hover:bg-gold-500 hover:text-charcoal-950 text-muted border border-charcoal-750 transition-all active:scale-95"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "w-8 bg-gold-500"
                      : "w-2 bg-charcoal-700 hover:bg-charcoal-600"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="p-2.5 rounded-full bg-charcoal-850 hover:bg-gold-500 hover:text-charcoal-950 text-muted border border-charcoal-750 transition-all active:scale-95"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
