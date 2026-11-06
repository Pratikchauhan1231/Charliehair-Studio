"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  INITIAL_SERVICES,
  INITIAL_BARBERS,
} from "@/lib/services-data";
import { Service, Barber } from "@/types";
import { formatINR, formatTimeDisplay } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Scissors,
  Users,
  TrendingUp,
  Lock,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Key,
  UserPlus,
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");

  // Auth form states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change password states inside dashboard
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [activeTab, setActiveTab] = useState<
    "bookings" | "services" | "schedule" | "account"
  >("bookings");

  // Bookings state
  const [bookings, setBookings] = useState<any[]>([
    {
      id: "BK-101",
      customer_name: "Aakash Patel",
      customer_phone: "+91 98251 12345",
      customer_email: "aakash@example.com",
      service_name: "Haircut with Creative Director",
      barber_name: "Jigar Solanki",
      date: new Date().toISOString().split("T")[0],
      time: "10:30",
      price: 450,
      status: "confirmed",
    },
    {
      id: "BK-102",
      customer_name: "Manish Shah",
      customer_phone: "+91 97123 45678",
      customer_email: "manish@example.com",
      service_name: "Beard Grooming & Shape",
      barber_name: "Akshay Bavaliya",
      date: new Date().toISOString().split("T")[0],
      time: "11:30",
      price: 200,
      status: "confirmed",
    },
    {
      id: "BK-103",
      customer_name: "Krupa Thanki",
      customer_phone: "+91 98980 98765",
      customer_email: "krupa@example.com",
      service_name: "Nashi Argan Luxury Spa",
      barber_name: "Parth Solanki",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "14:00",
      price: 3000,
      status: "pending",
    },
    {
      id: "BK-104",
      customer_name: "Pooja Mehta",
      customer_phone: "+91 99090 11223",
      customer_email: "pooja@example.com",
      service_name: "Bridal Styling & Makeup",
      barber_name: "Hetal Jigar Solanki",
      date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      time: "16:00",
      price: 5000,
      status: "confirmed",
    },
  ]);

  // Services state for CRUD
  const [servicesList, setServicesList] = useState<Service[]>(INITIAL_SERVICES);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("30");

  // Blocked slots state
  const [blockedDays, setBlockedDays] = useState<string[]>([
    "2026-11-15 (Diwali Holiday)",
  ]);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  // Restore session from sessionStorage on initial load
  useEffect(() => {
    const savedToken = sessionStorage.getItem("admin_token");
    const savedEmail = sessionStorage.getItem("admin_email");
    if (savedToken) {
      setAdminToken(savedToken);
      setCurrentAdminEmail(savedEmail || "Owner");
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch real-time bookings from API
  const loadBookings = (tokenToUse?: string) => {
    const activeSec = tokenToUse || adminToken || sessionStorage.getItem("admin_token") || "charlie-admin-2024";
    fetch("/api/bookings?all=true", {
      headers: { "x-admin-secret": activeSec },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings && data.bookings.length > 0) {
          const formatted = data.bookings.map((b: any) => ({
            id: b.id,
            customer_name: b.customer_name,
            customer_phone: b.customer_phone,
            customer_email: b.customer_email,
            service_name: b.service?.name || "Salon Treatment",
            barber_name: b.barber?.name || "Charlie Stylist",
            date: b.date,
            time: b.time?.substring(0, 5) || b.time,
            price: b.service?.price || 400,
            status: b.status,
          }));
          setBookings(formatted);
        }
      })
      .catch((err) => console.log("Bookings fetch notice:", err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  // ── Handle Login & Account Registration ─────────────────────────────────────
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");
    setIsSubmitting(true);

    try {
      if (authMode === "register") {
        if (loginPassword !== confirmPassword) {
          setLoginError("Passwords do not match.");
          setIsSubmitting(false);
          return;
        }

        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "register",
            email: loginEmail,
            password: loginPassword,
            setupCode,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          setLoginError(data.error || "Failed to create admin account.");
          setIsSubmitting(false);
          return;
        }

        // Account created & auto-logged in
        sessionStorage.setItem("admin_token", data.token);
        sessionStorage.setItem("admin_email", data.email);
        setAdminToken(data.token);
        setCurrentAdminEmail(data.email);
        setIsAuthenticated(true);
        loadBookings(data.token);
      } else {
        // Standard Login
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "login",
            email: loginEmail,
            password: loginPassword,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          setLoginError(data.error || "Invalid credentials.");
          setIsSubmitting(false);
          return;
        }

        sessionStorage.setItem("admin_token", data.token);
        sessionStorage.setItem("admin_email", data.email);
        setAdminToken(data.token);
        setCurrentAdminEmail(data.email);
        setIsAuthenticated(true);
        loadBookings(data.token);
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_email");
    setAdminToken("");
    setCurrentAdminEmail("");
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    try {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminToken || sessionStorage.getItem("admin_token") || "charlie-admin-2024",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword !== confirmNewPassword) {
      setPwdMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminToken || sessionStorage.getItem("admin_token") || "charlie-admin-2024",
        },
        body: JSON.stringify({
          action: "change-password",
          email: currentAdminEmail,
          oldPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setPwdMsg({ type: "error", text: data.error || "Failed to update password." });
      } else {
        setPwdMsg({ type: "success", text: "Password changed successfully!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch {
      setPwdMsg({ type: "error", text: "Network error occurred." });
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    const newSvc: Service = {
      id: "svc-" + Date.now(),
      name: newServiceName,
      category: "haircut_men",
      categoryLabel: "Custom Service",
      price: Number(newServicePrice),
      duration: Number(newServiceDuration),
      gender: "unisex",
    };

    setServicesList([newSvc, ...servicesList]);
    setNewServiceName("");
    setNewServicePrice("");
  };

  const handleDeleteService = (id: string) => {
    setServicesList(servicesList.filter((s) => s.id !== id));
  };

  const handleAddBlockedDate = () => {
    if (newBlockedDate) {
      setBlockedDays([...blockedDays, newBlockedDate]);
      setNewBlockedDate("");
    }
  };

  // ── RENDER LOGIN / REGISTER SCREEN IF NOT AUTHENTICATED ─────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal-950 text-offwhite flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-charcoal-900 border border-charcoal-750 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto text-gold-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-offwhite">
              Studio Owner Portal
            </h1>
            <p className="text-xs text-muted mt-1">
              Charlie Hair Studio • Protected Access
            </p>
          </div>

          {/* Toggle between Sign In and Set Custom Account */}
          <div className="flex rounded-lg bg-charcoal-850 p-1 border border-charcoal-750 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setLoginError("");
                setLoginSuccess("");
              }}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                authMode === "login"
                  ? "bg-gold-500 text-charcoal-950 shadow"
                  : "text-muted hover:text-offwhite"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setLoginError("");
                setLoginSuccess("");
              }}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                authMode === "register"
                  ? "bg-gold-500 text-charcoal-950 shadow"
                  : "text-muted hover:text-offwhite"
              }`}
            >
              Set My Own Password
            </button>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="p-3 bg-green-950/60 border border-green-500/40 rounded-lg text-xs text-green-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>{loginSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Staff / Owner Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="charliehairstudio26@gmail.com"
                className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-4 py-2.5 text-sm text-offwhite focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                {authMode === "register" ? "Create Your Password (Min 6 chars)" : "Password"}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-4 py-2.5 text-sm text-offwhite focus:border-gold-500 focus:outline-none"
              />
            </div>

            {authMode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-4 py-2.5 text-sm text-offwhite focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5 flex items-center justify-between">
                    <span>Salon Setup Security Key</span>
                    <span className="text-[10px] text-gold-400 font-normal">Default: charlie2024</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={setupCode}
                    onChange={(e) => setSetupCode(e.target.value)}
                    placeholder="Enter salon key (e.g. charlie2024)"
                    className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-4 py-2.5 text-sm text-offwhite focus:border-gold-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-muted mt-1">
                    Protects the portal so only the studio owner can register.
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-charcoal-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-lg shadow-gold-500/20"
            >
              {isSubmitting
                ? "Processing..."
                : authMode === "register"
                ? "Create Account & Login"
                : "Sign In to Admin"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-charcoal-800">
            <p className="text-[11px] text-muted">
              Default Login: <span className="text-gold-400">charliehairstudio26@gmail.com</span> / <span className="text-gold-400">charlie123</span>
            </p>
            <Link
              href="/"
              className="inline-block mt-3 text-xs text-muted hover:text-offwhite underline"
            >
              ← Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Simple Dashboard Stats
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen bg-charcoal-950 text-offwhite flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="bg-charcoal-900 border-b border-charcoal-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500 flex items-center justify-center text-gold-400 font-serif font-bold text-sm">
            CH
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-offwhite">
              Charlie Hair Studio • Management
            </h2>
            <span className="text-[10px] text-muted">
              Signed in as: <span className="text-gold-400">{currentAdminEmail}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-muted hover:text-gold-400 transition-colors"
          >
            Preview Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/40 border border-red-900 px-3 py-1.5 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-charcoal-900 border border-charcoal-800 p-5 rounded-xl">
            <span className="text-xs text-muted uppercase font-semibold">Today&apos;s Bookings</span>
            <p className="font-serif text-2xl font-bold text-offwhite mt-1">
              {bookings.filter((b) => b.date === new Date().toISOString().split("T")[0]).length}
            </p>
            <span className="text-[11px] text-green-400 mt-1 block">Active on schedule</span>
          </div>

          <div className="bg-charcoal-900 border border-charcoal-800 p-5 rounded-xl">
            <span className="text-xs text-muted uppercase font-semibold">Total Appointments</span>
            <p className="font-serif text-2xl font-bold text-gold-400 mt-1">
              {bookings.length} Bookings
            </p>
            <span className="text-[11px] text-muted mt-1 block">Across 4 specialists</span>
          </div>

          <div className="bg-charcoal-900 border border-charcoal-800 p-5 rounded-xl">
            <span className="text-xs text-muted uppercase font-semibold">Estimated Revenue</span>
            <p className="font-serif text-2xl font-bold text-offwhite mt-1">
              {formatINR(totalRevenue)}
            </p>
            <span className="text-[11px] text-muted mt-1 block">Booked services</span>
          </div>

          <div className="bg-charcoal-900 border border-charcoal-800 p-5 rounded-xl">
            <span className="text-xs text-muted uppercase font-semibold">Artists Available</span>
            <p className="font-serif text-base font-bold text-gold-400 mt-1 truncate">
              4 Specialists
            </p>
            <span className="text-[11px] text-muted mt-1 block">Akshay, Jigar, Parth, Hetal</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-charcoal-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "bookings"
                ? "bg-gold-500 text-charcoal-950"
                : "text-muted hover:text-offwhite bg-charcoal-900"
            }`}
          >
            Appointments &amp; Slots
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "services"
                ? "bg-gold-500 text-charcoal-950"
                : "text-muted hover:text-offwhite bg-charcoal-900"
            }`}
          >
            Services &amp; Pricing CRUD
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "schedule"
                ? "bg-gold-500 text-charcoal-950"
                : "text-muted hover:text-offwhite bg-charcoal-900"
            }`}
          >
            Working Hours &amp; Blocked Days
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "account"
                ? "bg-gold-500 text-charcoal-950"
                : "text-muted hover:text-offwhite bg-charcoal-900"
            }`}
          >
            Account &amp; Password
          </button>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-charcoal-800 flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-offwhite">
                Client Appointments Queue
              </h3>
              <span className="text-xs text-muted">{bookings.length} reservations recorded</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-charcoal-850 text-muted uppercase tracking-wider border-b border-charcoal-800">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Stylist</th>
                    <th className="p-3">Schedule</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-800">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-charcoal-850/50">
                      <td className="p-3 font-mono text-gold-400 font-semibold">{b.id}</td>
                      <td className="p-3">
                        <p className="font-bold text-offwhite">{b.customer_name}</p>
                        <p className="text-[11px] text-muted">{b.customer_phone}</p>
                      </td>
                      <td className="p-3 text-offwhite font-medium">{b.service_name}</td>
                      <td className="p-3 text-muted">{b.barber_name}</td>
                      <td className="p-3">
                        <p className="text-offwhite">{b.date}</p>
                        <p className="text-[11px] text-gold-400">{formatTimeDisplay(b.time)}</p>
                      </td>
                      <td className="p-3 font-semibold text-offwhite">{formatINR(b.price)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === "confirmed"
                              ? "bg-green-950 text-green-400 border border-green-800"
                              : b.status === "cancelled"
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-yellow-950 text-yellow-400 border border-yellow-800"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {b.status !== "confirmed" && (
                          <button
                            onClick={() => updateBookingStatus(b.id, "confirmed")}
                            className="p-1 hover:text-green-400 transition-colors"
                            title="Confirm Booking"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => updateBookingStatus(b.id, "cancelled")}
                            className="p-1 hover:text-red-400 transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & PRICING CRUD */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <form
              onSubmit={handleAddService}
              className="bg-charcoal-900 border border-charcoal-800 p-5 rounded-xl flex flex-wrap items-end gap-4"
            >
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold uppercase text-muted mb-1">
                  Treatment / Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scalp Detox Scrub"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-offwhite focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="w-32">
                <label className="block text-xs font-semibold uppercase text-muted mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="500"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-offwhite focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="w-32">
                <label className="block text-xs font-semibold uppercase text-muted mb-1">
                  Duration (Mins)
                </label>
                <input
                  type="number"
                  required
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-offwhite focus:border-gold-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </form>

            <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-charcoal-850 text-muted uppercase tracking-wider border-b border-charcoal-800">
                  <tr>
                    <th className="p-3">Service Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-800">
                  {servicesList.slice(0, 15).map((s) => (
                    <tr key={s.id} className="hover:bg-charcoal-850/50">
                      <td className="p-3 font-semibold text-offwhite">{s.name}</td>
                      <td className="p-3 text-muted">{s.categoryLabel}</td>
                      <td className="p-3 text-muted">{s.duration} mins</td>
                      <td className="p-3 font-bold text-gold-400">{formatINR(s.price)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1 text-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-charcoal-850 text-center text-xs text-muted">
                Showing top 15 of {servicesList.length} services loaded from pricing catalog.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE & BLOCKED DAYS */}
        {activeTab === "schedule" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-charcoal-900 border border-charcoal-800 p-6 rounded-xl">
              <h3 className="font-serif font-bold text-sm text-offwhite mb-4">
                Weekly Regular Hours
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-charcoal-800">
                  <span className="font-medium text-offwhite">Monday - Saturday</span>
                  <span className="text-gold-400">09:00 AM - 09:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-charcoal-800">
                  <span className="font-medium text-offwhite">Sunday</span>
                  <span className="text-gold-400">09:00 AM - 09:00 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-charcoal-900 border border-charcoal-800 p-6 rounded-xl">
              <h3 className="font-serif font-bold text-sm text-offwhite mb-4">
                Block Specific Dates / Holidays
              </h3>

              <div className="flex gap-2 mb-4">
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="bg-charcoal-850 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-offwhite flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddBlockedDate}
                  className="bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-950 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Block Date
                </button>
              </div>

              <div className="space-y-2">
                {blockedDays.map((dateStr, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 rounded bg-charcoal-850 text-xs text-muted"
                  >
                    <span>{dateStr}</span>
                    <span className="text-[10px] text-red-400 font-semibold uppercase">
                      Blocked
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT & SECURITY */}
        {activeTab === "account" && (
          <div className="max-w-2xl bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif font-bold text-base text-offwhite">
                Admin Account &amp; Password Security
              </h3>
              <p className="text-xs text-muted mt-1">
                You are currently logged in as <span className="text-gold-400 font-medium">{currentAdminEmail}</span>.
              </p>
            </div>

            {pwdMsg && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  pwdMsg.type === "success"
                    ? "bg-green-950/60 border border-green-500/40 text-green-300"
                    : "bg-red-950/60 border border-red-500/40 text-red-300"
                }`}
              >
                {pwdMsg.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-4 py-2.5 text-xs text-offwhite focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  New Password (Min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-4 py-2.5 text-xs text-offwhite focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-lg px-4 py-2.5 text-xs text-offwhite focus:border-gold-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors"
              >
                Update Password
              </button>
            </form>

            <div className="border-t border-charcoal-800 pt-4 text-xs text-muted space-y-2">
              <p className="font-semibold text-offwhite">Alternative / Hosting Setup:</p>
              <p>
                When hosted on Vercel, you can also change the admin password anytime in{" "}
                <span className="text-gold-400 font-mono">Vercel &gt; Settings &gt; Environment Variables</span> by setting:
              </p>
              <div className="bg-charcoal-850 p-2.5 rounded font-mono text-[11px] text-offwhite border border-charcoal-750">
                ADMIN_PASSWORD=your_new_secret_password
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
