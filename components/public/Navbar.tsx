"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scissors, Menu, X, Phone, Calendar, ShieldCheck } from "lucide-react";
import { SHOP_INFO } from "@/lib/services-data";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-charcoal-950/95 backdrop-blur-md border-b border-charcoal-700/60 shadow-xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-gold-500/40 bg-charcoal-850 flex items-center justify-center text-gold-500 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-offwhite block uppercase">
                Charlie <span className="text-gold-500 font-normal">Hair Studio</span>
              </span>
              <span className="text-[10px] tracking-widest text-muted uppercase block font-medium">
                Unisex Salon • Ahmedabad
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide text-beige-100/90">
            <Link href="#services" className="hover:text-gold-500 transition-colors">
              Services
            </Link>
            <Link href="#barbers" className="hover:text-gold-500 transition-colors">
              Our Stylists
            </Link>
            <Link href="#reviews" className="hover:text-gold-500 transition-colors">
              Reviews
            </Link>
            <Link href="#location" className="hover:text-gold-500 transition-colors">
              Location & Hours
            </Link>
            <Link
              href="/admin"
              className="text-muted hover:text-offwhite flex items-center gap-1 text-xs border border-charcoal-700 px-2 py-1 rounded transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              Admin
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="text-xs text-muted hover:text-gold-500 flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              {SHOP_INFO.phone}
            </a>
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-charcoal-950 font-semibold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Appointment
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="#booking"
              className="bg-gold-500 text-charcoal-950 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-offwhite hover:text-gold-500 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal-950/98 border-b border-charcoal-700/80 px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          <Link
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-beige-100 hover:text-gold-500"
          >
            Services & Pricing
          </Link>
          <Link
            href="#booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gold-500"
          >
            Book Appointment
          </Link>
          <Link
            href="#barbers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-beige-100 hover:text-gold-500"
          >
            Specialists & Barbers
          </Link>
          <Link
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-beige-100 hover:text-gold-500"
          >
            Testimonials
          </Link>
          <Link
            href="#location"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-beige-100 hover:text-gold-500"
          >
            Location & Contact
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-muted pt-2 border-t border-charcoal-800"
          >
            Owner / Staff Admin Login
          </Link>
        </div>
      )}
    </header>
  );
}
