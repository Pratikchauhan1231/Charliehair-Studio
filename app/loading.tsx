import React from "react";
import { Scissors } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-charcoal-900 border border-gold-500/40 flex items-center justify-center text-gold-500 animate-pulse">
        <Scissors className="w-7 h-7 -rotate-45" />
      </div>
      <p className="font-serif text-sm tracking-widest text-gold-400 uppercase">
        Charlie Hair Studio
      </p>
    </div>
  );
}
