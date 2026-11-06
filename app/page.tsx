"use client";

import React, { useState } from "react";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Services from "@/components/public/Services";
import BookingForm from "@/components/public/BookingForm";
import Barbers from "@/components/public/Barbers";
import Reviews from "@/components/public/Reviews";
import LocationHours from "@/components/public/LocationHours";
import Footer from "@/components/public/Footer";
import { INITIAL_SERVICES, INITIAL_BARBERS, INITIAL_REVIEWS } from "@/lib/services-data";

export default function HomePage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("m-haircut");
  const [selectedBarberId, setSelectedBarberId] = useState<string>("b-charlie");

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  const handleSelectBarber = (barberId: string) => {
    setSelectedBarberId(barberId);
  };

  return (
    <main className="min-h-screen bg-charcoal-900 text-offwhite flex flex-col selection:bg-gold-500 selection:text-charcoal-950">
      {/* Sticky Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Services Menu Section */}
      <Services
        initialServices={INITIAL_SERVICES}
        onSelectService={handleSelectService}
      />

      {/* Booking Form Wizard */}
      <BookingForm
        services={INITIAL_SERVICES}
        barbers={INITIAL_BARBERS}
        preselectedServiceId={selectedServiceId}
      />

      {/* Barbers / Stylists Showcase */}
      <Barbers
        barbers={INITIAL_BARBERS}
        onSelectBarber={handleSelectBarber}
      />

      {/* Customer Testimonials Carousel */}
      <Reviews reviews={INITIAL_REVIEWS} />

      {/* Map, Opening Hours & Direct Contact */}
      <LocationHours />

      {/* Site Footer */}
      <Footer />
    </main>
  );
}
