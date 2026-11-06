"use client";

import React, { useState, useEffect } from "react";
import { Service, Barber } from "@/types";
import { formatINR, formatTimeDisplay, formatDateDisplay, generateDailyTimeSlots } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Scissors,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";

interface BookingFormProps {
  services: Service[];
  barbers: Barber[];
  preselectedServiceId?: string;
}

export default function BookingForm({
  services,
  barbers,
  preselectedServiceId,
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || "");
  const [selectedBarberId, setSelectedBarberId] = useState(barbers[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Async States
  const [busyTimes, setBusyTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Update selected service if preselected prop changes
  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Fetch busy slots when barber or date changes
  useEffect(() => {
    if (selectedBarberId && selectedDate) {
      setLoadingSlots(true);
      setSelectedTime("");
      fetch(`/api/bookings?barber_id=${selectedBarberId}&date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.busyTimes) {
            setBusyTimes(data.busyTimes);
          }
        })
        .catch((err) => {
          console.error("Failed to load booked slots", err);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    }
  }, [selectedBarberId, selectedDate]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  const allSlots = generateDailyTimeSlots(9, 21, 30);

  // Submission handler
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMessage("Please provide your name, phone number, and email.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: selectedServiceId,
          barber_id: selectedBarberId,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          date: selectedDate,
          time: selectedTime,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to confirm booking.");
      }

      setConfirmedBooking(result.booking);
      setCurrentStep(5); // Confirmation screen

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C9A227", "#FAF7F2", "#DFBA4E"],
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const maxDateStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <section id="booking" className="py-24 bg-charcoal-900 relative border-t border-charcoal-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Seamless Online Booking
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-offwhite mb-3">
            Reserve Your Chair
          </h2>
          <p className="text-muted text-sm max-w-lg mx-auto">
            Choose your service, preferred specialist, and an open slot. Instant confirmation &amp; zero double-booking.
          </p>
        </div>

        {/* Multi-step Progress Bar */}
        {currentStep < 5 && (
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-xs font-semibold text-muted mb-2">
              <span className={currentStep >= 1 ? "text-gold-400 font-bold" : ""}>1. Service</span>
              <span className={currentStep >= 2 ? "text-gold-400 font-bold" : ""}>2. Specialist</span>
              <span className={currentStep >= 3 ? "text-gold-400 font-bold" : ""}>3. Date &amp; Time</span>
              <span className={currentStep >= 4 ? "text-gold-400 font-bold" : ""}>4. Your Details</span>
            </div>
            <div className="h-1.5 w-full bg-charcoal-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Container */}
        <div className="bg-charcoal-850 border border-charcoal-700/80 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center gap-3 text-red-200 text-xs sm:text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: CHOOSE SERVICE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-serif text-xl font-bold text-offwhite flex items-center gap-2">
                <Scissors className="w-5 h-5 text-gold-500" />
                Select Your Treatment
              </h3>

              <div className="max-h-96 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedServiceId === service.id
                        ? "bg-gold-500/10 border-gold-500 shadow-md shadow-gold-500/10"
                        : "bg-charcoal-900 border-charcoal-750 hover:border-gold-500/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-offwhite">{service.name}</span>
                        <span className="text-[10px] bg-charcoal-800 text-muted px-2 py-0.5 rounded">
                          {service.duration} mins
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-1">{service.description}</p>
                    </div>

                    <div className="text-right pl-4">
                      <span className="font-serif text-base font-bold text-gold-400">
                        {formatINR(service.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-charcoal-750">
                <button
                  type="button"
                  disabled={!selectedServiceId}
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed text-charcoal-950 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all"
                >
                  Continue to Stylist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE BARBER / STYLIST */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-offwhite flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-500" />
                  Select Your Artist
                </h3>
                <span className="text-xs text-gold-400">
                  {selectedService?.name} • {formatINR(selectedService?.price || 0)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarberId(barber.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                      selectedBarberId === barber.id
                        ? "bg-gold-500/10 border-gold-500 shadow-md shadow-gold-500/10"
                        : "bg-charcoal-900 border-charcoal-750 hover:border-gold-500/40"
                    }`}
                  >
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-charcoal-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-offwhite">{barber.name}</h4>
                      <span
                        className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mt-1 border ${
                          barber.clientType === "men"
                            ? "bg-charcoal-800 text-offwhite border-charcoal-700"
                            : barber.clientType === "women"
                            ? "bg-pink-950/80 text-pink-300 border-pink-800/50"
                            : "bg-gold-500/15 text-gold-400 border-gold-500/30"
                        }`}
                      >
                        {barber.clientType === "men"
                          ? "Men Only"
                          : barber.clientType === "women"
                          ? "Female Only"
                          : "Unisex (Men & Women)"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-charcoal-750">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-offwhite"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Services
                </button>
                <button
                  type="button"
                  disabled={!selectedBarberId}
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-charcoal-950 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all"
                >
                  Choose Date &amp; Time
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE DATE & AVAILABLE TIME SLOT */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-offwhite flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gold-500" />
                  Pick Date &amp; Free Slot
                </h3>
                <span className="text-xs text-muted">With {selectedBarber?.name}</span>
              </div>

              {/* Date Input */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-750">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  max={maxDateStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-4 py-2.5 text-sm text-offwhite focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Slots Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Available Time Slots ({formatDateDisplay(selectedDate)})
                  </label>
                  {loadingSlots && (
                    <span className="flex items-center gap-1.5 text-xs text-gold-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Checking slots...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {allSlots.map((slot) => {
                    const isBooked = busyTimes.includes(slot);
                    const isSelected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-medium transition-all ${
                          isBooked
                            ? "bg-charcoal-800/40 text-charcoal-600 line-through cursor-not-allowed border border-charcoal-800"
                            : isSelected
                            ? "bg-gold-500 text-charcoal-950 font-bold shadow-md shadow-gold-500/20"
                            : "bg-charcoal-900 text-beige-100 border border-charcoal-750 hover:border-gold-500/50"
                        }`}
                      >
                        {formatTimeDisplay(slot)}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted mt-2">
                  * Strikethrough slots are already occupied to prevent double-booking.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-charcoal-750">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-offwhite"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={!selectedTime}
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-charcoal-950 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all"
                >
                  Enter Your Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CLIENT CONTACT DETAILS & FINAL CONFIRM */}
          {currentStep === 4 && (
            <form onSubmit={handleBookingSubmit} className="space-y-6 animate-fade-in">
              <h3 className="font-serif text-xl font-bold text-offwhite flex items-center gap-2">
                <User className="w-5 h-5 text-gold-500" />
                Your Contact Information
              </h3>

              {/* Booking Summary Pill */}
              <div className="p-4 rounded-xl bg-charcoal-900 border border-gold-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-muted block">Selected Service</span>
                  <span className="font-bold text-offwhite">{selectedService?.name}</span>
                </div>
                <div>
                  <span className="text-muted block">Stylist</span>
                  <span className="font-bold text-offwhite">{selectedBarber?.name}</span>
                </div>
                <div>
                  <span className="text-muted block">Date &amp; Time</span>
                  <span className="font-bold text-gold-400">
                    {formatDateDisplay(selectedDate)} at {formatTimeDisplay(selectedTime)}
                  </span>
                </div>
                <div>
                  <span className="text-muted block">Estimated Price</span>
                  <span className="font-serif font-bold text-gold-400 text-sm">
                    {formatINR(selectedService?.price || 0)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-4 py-2.5 text-sm text-offwhite focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-offwhite focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Email Address (For instant confirmation) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-offwhite focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Special Requests or Hair Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Skin fade with textured top, or allergy notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-charcoal-900 border border-charcoal-700 rounded-lg px-4 py-2 text-sm text-offwhite focus:border-gold-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-charcoal-750">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-offwhite"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-charcoal-950 font-bold px-8 py-3 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reserving Slot...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: SUCCESS / CONFIRMATION SCREEN */}
          {currentStep === 5 && (
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-gold-500/15 border-2 border-gold-500 rounded-full flex items-center justify-center mx-auto text-gold-400">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-offwhite mb-2">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
                  Thank you, <strong className="text-offwhite">{customerName}</strong>. A confirmation email has been dispatched to <strong className="text-gold-400">{customerEmail}</strong>.
                </p>
              </div>

              {/* Ticket Card */}
              <div className="bg-charcoal-900 border border-gold-500/40 rounded-xl p-6 max-w-md mx-auto text-left space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                  <span className="text-xs text-muted uppercase tracking-wider">Booking Ref</span>
                  <span className="font-mono text-xs font-bold text-gold-400">
                    {confirmedBooking?.id || "CH-" + Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Treatment:</span>
                    <span className="font-semibold text-offwhite">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Stylist:</span>
                    <span className="font-semibold text-offwhite">{selectedBarber?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Date:</span>
                    <span className="font-semibold text-offwhite">{formatDateDisplay(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Time:</span>
                    <span className="font-semibold text-gold-400">{formatTimeDisplay(selectedTime)}</span>
                  </div>
                  <div className="flex justify-between border-t border-charcoal-800 pt-2">
                    <span className="text-muted">Total (Pay at Salon):</span>
                    <span className="font-serif font-bold text-base text-gold-400">
                      {formatINR(selectedService?.price || 0)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-muted/80 text-center">
                  📍 15, Ratnanjali Solitaire, Prernatirth Derasar Rd, Jodhpur Village, Ahmedabad
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setSelectedTime("");
                    setConfirmedBooking(null);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-offwhite text-xs font-semibold transition-colors"
                >
                  Book Another Service
                </button>
                <a
                  href={`https://wa.me/919624969690?text=Hi%20Charlie%20Hair%20Studio,%20I%20just%20booked%20an%20appointment%20for%20${encodeURIComponent(
                    selectedService?.name || "Service"
                  )}%20on%20${selectedDate}%20at%20${selectedTime}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-colors inline-flex items-center justify-center gap-2"
                >
                  Notify via WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
