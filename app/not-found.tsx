import React from "react";
import Link from "next/link";
import { Scissors, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal-950 text-offwhite flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-500">
          <Scissors className="w-8 h-8 -rotate-45" />
        </div>
        <h1 className="font-serif text-5xl font-bold text-gold-400">404</h1>
        <h2 className="font-serif text-2xl font-bold text-offwhite">
          Page Not Found
        </h2>
        <p className="text-sm text-muted">
          The style or page you are looking for has been moved or doesn&apos;t exist. Return to Charlie Hair Studio homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
