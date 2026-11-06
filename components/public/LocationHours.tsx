"use client";

import React from "react";
import { SHOP_INFO } from "@/lib/services-data";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Navigation,
  CheckCircle,
} from "lucide-react";

export default function LocationHours() {
  const schedule = [
    { day: "Monday", hours: "09:00 AM - 09:00 PM", status: "Open" },
    { day: "Tuesday", hours: "09:00 AM - 09:00 PM", status: "Open" },
    { day: "Wednesday", hours: "09:00 AM - 09:00 PM", status: "Open" },
    { day: "Thursday", hours: "09:00 AM - 09:00 PM", status: "Open" },
    { day: "Friday", hours: "09:00 AM - 09:00 PM", status: "Open" },
    { day: "Saturday", hours: "09:00 AM - 09:00 PM", status: "Open" },
    { day: "Sunday", hours: "09:00 AM - 09:00 PM", status: "Open" },
  ];

  return (
    <section id="location" className="py-24 bg-charcoal-900 relative border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Find Us
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-offwhite mb-4">
            Location &amp; Operating Hours
          </h2>
          <p className="text-muted text-sm sm:text-base">
            Conveniently situated in Jodhpur Village, Ahmedabad with dedicated parking and a relaxing luxury studio atmosphere.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Hours Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-charcoal-850 border border-charcoal-750 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-offwhite mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-500" />
                Studio Address
              </h3>
              <p className="text-sm text-beige-100/90 leading-relaxed mb-6">
                {SHOP_INFO.address}
              </p>

              {/* Direct Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <a
                  href={`tel:${SHOP_INFO.phone}`}
                  className="inline-flex items-center justify-center gap-2 bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-950 text-beige-100 text-xs font-semibold py-3 px-4 rounded-xl border border-charcoal-700 hover:border-gold-500 transition-all active:scale-95 shadow-md"
                >
                  <Phone className="w-4 h-4 text-gold-400" />
                  Call: {SHOP_INFO.phone}
                </a>

                <a
                  href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=Hi%20Charlie%20Hair%20Studio,%20I%20would%20like%20to%20inquire%20about%20an%20appointment.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-700/80 hover:bg-green-600 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted pt-4 border-t border-charcoal-750">
                <Mail className="w-4 h-4 text-gold-500" />
                <span>{SHOP_INFO.email}</span>
              </div>
            </div>

            {/* Hours Table */}
            <div className="bg-charcoal-850 border border-charcoal-750 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-offwhite mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-500" />
                Weekly Schedule
              </h3>

              <div className="space-y-3">
                {schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-charcoal-800/80 last:border-none text-xs"
                  >
                    <span className="font-semibold text-offwhite">{item.day}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted">{item.hours}</span>
                      <span className="text-[10px] text-green-400 bg-green-950/60 border border-green-800 px-2 py-0.5 rounded">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-7 bg-charcoal-850 border border-charcoal-750 rounded-2xl overflow-hidden shadow-2xl h-[420px] lg:h-[590px] relative">
            <iframe
              title="Charlie Hair Studio Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(90%)" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Ratnanjali%20Solitaire%2C%20Prernatirth%20Derasar%20Rd%2C%20Jodhpur%20Village%2C%20Ahmedabad&t=&z=16&ie=UTF8&iwloc=&output=embed"
            />

            <div className="absolute bottom-4 left-4 right-4 bg-charcoal-950/90 backdrop-blur-md border border-charcoal-750 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-offwhite">Charlie Hair Studio</p>
                <p className="text-[11px] text-muted">Ratnanjali Solitaire, Ahmedabad</p>
              </div>
              <a
                href={SHOP_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
