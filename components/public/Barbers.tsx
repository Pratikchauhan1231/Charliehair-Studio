"use client";

import React, { useState } from "react";
import { Barber } from "@/types";
import { Calendar, Users } from "lucide-react";

interface BarbersProps {
  barbers: Barber[];
  onSelectBarber?: (barberId: string) => void;
}

const CLIENT_TYPE_CONFIG = {
  men: {
    label: "Men Only",
    className: "bg-charcoal-800/90 text-offwhite border-charcoal-600",
  },
  women: {
    label: "Female Only",
    className: "bg-pink-950/80 text-pink-300 border-pink-800/50",
  },
  unisex: {
    label: "Unisex (Men & Women)",
    className: "bg-gold-500/20 text-gold-400 border-gold-500/40",
  },
};

// Fallback placeholder if real photo is not found
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";

export default function Barbers({ barbers, onSelectBarber }: BarbersProps) {
  const handleBookWithBarber = (barberId: string) => {
    if (onSelectBarber) {
      onSelectBarber(barberId);
    }
    const bookingElement = document.getElementById("booking");
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="barbers" className="py-24 bg-charcoal-950 relative border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            Our Hair Artists
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-offwhite mb-4">
            Meet Our Artists
          </h2>
          <p className="text-muted text-sm sm:text-base">
            Select your preferred hair artist to book your appointment.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {barbers.map((barber) => {
            const badge = CLIENT_TYPE_CONFIG[barber.clientType] || CLIENT_TYPE_CONFIG.unisex;
            return (
              <div
                key={barber.id}
                className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden group card-hover flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-850">
                  <img
                    src={barber.image}
                    alt={`${barber.name} - Hair Artist at Charlie Hair Studio`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/10 to-transparent" />

                  {/* Client Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-md border ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <div className="text-center">
                    <h3 className="font-serif text-xl font-bold text-offwhite group-hover:text-gold-400 transition-colors">
                      {barber.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleBookWithBarber(barber.id)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-950 text-beige-100 text-xs font-semibold py-3 rounded-full border border-charcoal-700 hover:border-gold-500 transition-all active:scale-95 shadow-md"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Appointment with {barber.name.split(" ")[0]}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
