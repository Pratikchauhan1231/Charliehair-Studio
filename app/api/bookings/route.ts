import { NextResponse } from "next/server";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { INITIAL_SERVICES, INITIAL_BARBERS } from "@/lib/services-data";

// ─── Security Constants ───────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s\-()\\.]{7,20}$/;
const VALID_BARBER_IDS = INITIAL_BARBERS.map((b) => b.id);
const VALID_STATUSES = ["confirmed", "cancelled", "pending"];
const ADMIN_SECRET = process.env.ADMIN_SECRET || "charlie-admin-2024";

// Working hours: 10:00 AM – 8:00 PM
const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;

// Simple in-memory rate limiter: email → timestamps[]
const bookingRateMap = new Map<string, number[]>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const times = (bookingRateMap.get(email) || []).filter((t) => now - t < ONE_HOUR);
  if (times.length >= 3) return false; // blocked
  bookingRateMap.set(email, [...times, now]);
  return true;
}

// In-memory store for instant zero-config testing if Supabase is not yet connected
const inMemoryBookings: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barberId = searchParams.get("barber_id");
  const date = searchParams.get("date");
  const fetchAll = searchParams.get("all") === "true";

  // ── Admin-only: require secret header when fetching all bookings
  if (fetchAll) {
    const secret = request.headers.get("x-admin-secret");
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = getSupabaseBrowserClient();

  // If requesting all bookings for Admin Dashboard
  if (fetchAll || (!barberId && !date)) {
    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service:services(name, price),
          barber:barbers(name)
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return NextResponse.json({ bookings: data });
      }
    }
    return NextResponse.json({ bookings: inMemoryBookings });
  }

  // Otherwise, slot checking for booking wizard
  if (!barberId || !date) {
    return NextResponse.json({ error: "barber_id and date are required" }, { status: 400 });
  }

  // Validate barber_id is a known ID
  if (!VALID_BARBER_IDS.includes(barberId)) {
    return NextResponse.json({ error: "Invalid barber." }, { status: 400 });
  }

  if (supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .select("time, status")
      .eq("barber_id", barberId)
      .eq("date", date)
      .neq("status", "cancelled");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const busyTimes = (data || []).map((b) => b.time.substring(0, 5));
    return NextResponse.json({ busyTimes });
  }

  // Fallback to local memory store
  const busyTimes = inMemoryBookings
    .filter((b) => b.barber_id === barberId && b.date === date && b.status !== "cancelled")
    .map((b) => b.time.substring(0, 5));

  return NextResponse.json({ busyTimes });
}

export async function PATCH(request: Request) {
  try {
    // ── Auth guard: only admin can update booking status
    const secret = request.headers.get("x-admin-secret");
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    // Validate status is one of the allowed values
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.from("bookings").update({ status }).eq("id", id);
    }

    const localItem = inMemoryBookings.find((b) => b.id === id);
    if (localItem) {
      localItem.status = status;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      service_id,
      barber_id,
      customer_name,
      customer_phone,
      customer_email,
      date,
      time,
      notes,
    } = body;

    // ── 1. Required fields check
    if (
      !service_id ||
      !barber_id ||
      !customer_name ||
      !customer_phone ||
      !customer_email ||
      !date ||
      !time
    ) {
      return NextResponse.json(
        { error: "Please fill in all required booking fields." },
        { status: 400 }
      );
    }

    // ── 2. Field length & format validation
    if (typeof customer_name !== "string" || customer_name.trim().length < 2 || customer_name.length > 100) {
      return NextResponse.json({ error: "Please enter a valid name (2–100 characters)." }, { status: 400 });
    }

    if (typeof customer_phone !== "string" || !PHONE_REGEX.test(customer_phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number (7–20 digits)." }, { status: 400 });
    }

    if (typeof customer_email !== "string" || !EMAIL_REGEX.test(customer_email) || customer_email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // ── 3. Sanitize notes (strip HTML tags, limit length)
    const sanitizedNotes = typeof notes === "string"
      ? notes.replace(/<[^>]*>/g, "").slice(0, 500)
      : "";

    // ── 4. Validate barber_id and service_id against known catalog
    if (!VALID_BARBER_IDS.includes(barber_id)) {
      return NextResponse.json({ error: "Invalid stylist selected." }, { status: 400 });
    }

    const service = INITIAL_SERVICES.find((s) => s.id === service_id);
    if (!service) {
      return NextResponse.json({ error: "Invalid service selected." }, { status: 400 });
    }

    const barber = INITIAL_BARBERS.find((b) => b.id === barber_id);

    // ── 5. Date must not be in the past
    const todayStr = new Date().toISOString().split("T")[0];
    if (date < todayStr) {
      return NextResponse.json({ error: "Cannot book appointments in the past." }, { status: 400 });
    }

    // ── 6. Validate time is within working hours (10:00 – 20:00)
    const [hourStr] = (time as string).split(":");
    const hour = parseInt(hourStr, 10);
    if (isNaN(hour) || hour < OPEN_HOUR || hour >= CLOSE_HOUR) {
      return NextResponse.json({ error: "Please select a time within working hours (10 AM – 8 PM)." }, { status: 400 });
    }

    // ── 7. Rate limiting: max 3 bookings per email per hour
    if (!checkRateLimit(customer_email.toLowerCase())) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please wait an hour and try again." },
        { status: 429 }
      );
    }

    const newBooking = {
      id: "bk-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      service_id,
      barber_id,
      customer_name: customer_name.trim(),
      customer_phone,
      customer_email: customer_email.toLowerCase().trim(),
      date,
      time: time.length === 5 ? `${time}:00` : time,
      status: "confirmed",
      notes: sanitizedNotes,
      created_at: new Date().toISOString(),
      service,
      barber,
    };

    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      // Check if already booked
      const { data: existing } = await supabase
        .from("bookings")
        .select("id")
        .eq("barber_id", barber_id)
        .eq("date", date)
        .eq("time", newBooking.time)
        .neq("status", "cancelled")
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "This time slot was just booked by another client. Please choose another slot." },
          { status: 409 }
        );
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            service_id,
            barber_id,
            customer_name: customer_name.trim(),
            customer_phone,
            customer_email: customer_email.toLowerCase().trim(),
            date,
            time: newBooking.time,
            status: "confirmed",
            notes: sanitizedNotes,
          },
        ])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Send email in background
      await sendBookingConfirmationEmail({
        customerName: customer_name.trim(),
        customerEmail: customer_email,
        customerPhone: customer_phone,
        serviceName: service?.name || "Salon Treatment",
        barberName: barber?.name || "Charlie Stylist",
        date,
        time,
        price: service?.price || 0,
      });

      return NextResponse.json({ success: true, booking: data });
    }

    // In-Memory Fallback Check
    const exists = inMemoryBookings.some(
      (b) =>
        b.barber_id === barber_id &&
        b.date === date &&
        b.time.substring(0, 5) === time.substring(0, 5) &&
        b.status !== "cancelled"
    );

    if (exists) {
      return NextResponse.json(
        { error: "This time slot is already reserved. Please select another slot." },
        { status: 409 }
      );
    }

    inMemoryBookings.unshift(newBooking);

    // Send confirmation email
    await sendBookingConfirmationEmail({
      customerName: customer_name.trim(),
      customerEmail: customer_email,
      customerPhone: customer_phone,
      serviceName: service?.name || "Salon Treatment",
      barberName: barber?.name || "Charlie Stylist",
      date,
      time,
      price: service?.price || 0,
    });

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process booking." }, { status: 500 });
  }
}
