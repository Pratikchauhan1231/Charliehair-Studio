import React from "react";
import Link from "next/link";
import { Scissors, Star, MapPin, Calendar, ArrowRight } from "lucide-react";
import { SHOP_INFO } from "@/lib/services-data";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Dark Vignette & Gradient Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/80 to-charcoal-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-charcoal-950/60 to-charcoal-950" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Premium Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-charcoal-800/90 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-black/40 backdrop-blur-md animate-fade-in">
          <Scissors className="w-3.5 h-3.5" />
          <span>Ahmedabad&apos;s Premier Unisex Hair &amp; Grooming Studio</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-offwhite mb-4 animate-slide-up">
          CHARLIE <span className="text-gold-gradient">HAIR STUDIO</span>
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-beige-200/90 tracking-wide mb-6">
          &ldquo;{SHOP_INFO.tagline}&rdquo;
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted leading-relaxed mb-10">
          Precision haircuts, bespoke beard sculpting, organic Nashi hair spas, advanced facials, and luxury bridal &amp; groom packages in Jodhpur Village, Ahmedabad.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="#booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-charcoal-950 font-bold px-8 py-3.5 rounded-full text-sm uppercase tracking-wider shadow-xl shadow-gold-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </Link>
          <Link
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal-850/80 hover:bg-charcoal-800 text-offwhite hover:text-gold-400 border border-charcoal-700 hover:border-gold-500/50 font-semibold px-8 py-3.5 rounded-full text-sm uppercase tracking-wider backdrop-blur-sm transition-all"
          >
            View Services &amp; Prices
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bottom Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-charcoal-800/80 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3 bg-charcoal-850/40 p-3 rounded-lg border border-charcoal-800/50">
            <div className="p-2 bg-gold-500/10 rounded-full text-gold-400">
              <Star className="w-4 h-4 fill-gold-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-offwhite">4.9 / 5.0 Rating</p>
              <p className="text-[11px] text-muted">Over 500+ happy clients</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-charcoal-850/40 p-3 rounded-lg border border-charcoal-800/50">
            <div className="p-2 bg-gold-500/10 rounded-full text-gold-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-offwhite">Senior Stylists</p>
              <p className="text-[11px] text-muted">12+ years master artistry</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center gap-3 bg-charcoal-850/40 p-3 rounded-lg border border-charcoal-800/50">
            <div className="p-2 bg-gold-500/10 rounded-full text-gold-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-offwhite">Jodhpur Village</p>
              <p className="text-[11px] text-muted">Near Axis Bank, Ahmedabad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
