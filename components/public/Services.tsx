"use client";

import React, { useState } from "react";
import { Service } from "@/types";
import { formatINR } from "@/lib/utils";
import { Clock, Sparkles, Search, CheckCircle2, ArrowRight } from "lucide-react";

interface ServicesProps {
  initialServices: Service[];
  onSelectService?: (serviceId: string) => void;
}

const CATEGORY_FILTERS = [
  { id: "all", label: "All Treatments" },
  { id: "haircut_men", label: "Men's Hair & Beard" },
  { id: "female_hair", label: "Women's Hair Care" },
  { id: "relaxing_men", label: "Relaxation & Spa" },
  { id: "chemical_men", label: "Chemical & Color" },
  { id: "skin_care", label: "Skin & Facials" },
  { id: "dtan", label: "D-Tan & Polishing" },
  { id: "groom_package", label: "Groom Packages" },
  { id: "bridal_package", label: "Bridal Packages" },
  { id: "combo_memberships", label: "Annual Passes" },
];

export default function Services({ initialServices, onSelectService }: ServicesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = initialServices.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" ||
      service.category === selectedCategory ||
      (selectedCategory === "chemical_men" && (service.category === "chemical_men" || service.category === "female_chemical")) ||
      (selectedCategory === "skin_care" && (service.category === "skin_care" || service.category === "facial"));

    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleBookClick = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId);
    }
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-24 bg-charcoal-950 relative border-t border-charcoal-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing Menu &amp; Treatments
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-offwhite mb-4">
            Master Artistry &amp; Care
          </h2>
          <p className="text-muted text-sm sm:text-base">
            From precision gentleman fades and beard trims to Italian Nashi hair spas, luxury facials, and wedding rituals.
          </p>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="mb-10 space-y-4">
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search treatments (e.g. Keratin, Beard, Spa, Facial)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-900 border border-charcoal-700 focus:border-gold-500 rounded-full pl-11 pr-4 py-2.5 text-sm text-offwhite placeholder:text-muted focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gold-500 text-charcoal-950 font-bold shadow-md shadow-gold-500/20"
                    : "bg-charcoal-900 text-beige-100/70 border border-charcoal-800 hover:border-gold-500/40 hover:text-offwhite"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 flex flex-col justify-between card-hover relative overflow-hidden group"
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-gold-500 text-charcoal-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                  Popular
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                    {service.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration} mins</span>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-offwhite group-hover:text-gold-400 transition-colors mb-2">
                  {service.name}
                </h3>

                <p className="text-xs text-muted leading-relaxed mb-6">
                  {service.description || "Premium treatment administered by our certified salon professionals."}
                </p>
              </div>

              <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted block">Price</span>
                  <span className="font-serif text-xl font-bold text-gold-400">
                    {formatINR(service.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleBookClick(service.id)}
                  className="inline-flex items-center gap-1.5 bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-950 text-beige-100 text-xs font-semibold px-4 py-2 rounded-full border border-charcoal-700 hover:border-gold-500 transition-all active:scale-95"
                >
                  Book Slot
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-charcoal-900/50 rounded-xl border border-charcoal-800">
            <p className="text-offwhite font-medium mb-1">No services found</p>
            <p className="text-xs text-muted mb-4">Try adjusting your search or filter keywords.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-xs text-gold-400 underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
