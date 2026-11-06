import React from "react";
import Link from "next/link";
import { Scissors, Phone, Mail, MapPin, Instagram, Facebook, ArrowUp } from "lucide-react";
import { SHOP_INFO } from "@/lib/services-data";

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-charcoal-800 text-offwhite pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-500/40 bg-charcoal-850 flex items-center justify-center text-gold-500">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-wider text-offwhite block uppercase">
                  Charlie <span className="text-gold-500 font-normal">Hair Studio</span>
                </span>
                <span className="text-[10px] tracking-widest text-muted uppercase block font-medium">
                  Unisex Salon
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              &ldquo;{SHOP_INFO.tagline}&rdquo; — Ahmedabad&apos;s premier destination for bespoke haircuts, beard sculpting, advanced skincare, and wedding packages.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SHOP_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-850 hover:bg-gold-500 hover:text-charcoal-950 text-muted border border-charcoal-700 flex items-center justify-center transition-all"
                aria-label="Instagram Page"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SHOP_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-850 hover:bg-gold-500 hover:text-charcoal-950 text-muted border border-charcoal-700 flex items-center justify-center transition-all"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="#services" className="hover:text-offwhite transition-colors">
                  Services &amp; Pricing
                </Link>
              </li>
              <li>
                <Link href="#booking" className="hover:text-offwhite transition-colors">
                  Online Booking System
                </Link>
              </li>
              <li>
                <Link href="#barbers" className="hover:text-offwhite transition-colors">
                  Creative Stylists
                </Link>
              </li>
              <li>
                <Link href="#reviews" className="hover:text-offwhite transition-colors">
                  Client Reviews
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Signature Treatments
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>Director Cut &amp; Fade Art</li>
              <li>L&apos;Oréal &amp; INOA Ammonia-Free Colors</li>
              <li>Brazilian Keratin &amp; Smoothing</li>
              <li>Italian Nashi Argan Spa</li>
              <li>Casmara Algae Luxury Facials</li>
              <li>Complete HD Groom &amp; Bridal Rituals</li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Contact &amp; Visit
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-muted">
              <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
              <span>{SHOP_INFO.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <a href={`tel:${SHOP_INFO.phone}`} className="hover:text-offwhite">
                {SHOP_INFO.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <a href={`mailto:${SHOP_INFO.email}`} className="hover:text-offwhite">
                {SHOP_INFO.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {new Date().getFullYear()} Charlie Hair Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Designed for Charlie Hair Studio • Ahmedabad</span>
            <a
              href="#"
              className="p-2 rounded-full bg-charcoal-850 hover:bg-gold-500 hover:text-charcoal-950 text-muted transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
