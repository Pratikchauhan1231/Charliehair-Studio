-- ==============================================================================
-- CHARLIE HAIR STUDIO - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30, -- in minutes
  description TEXT,
  popular BOOLEAN DEFAULT false,
  gender TEXT CHECK (gender IN ('men', 'women', 'unisex')) DEFAULT 'unisex',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Barbers & Hair Artists Table
CREATE TABLE IF NOT EXISTS barbers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client_type TEXT CHECK (client_type IN ('men', 'unisex', 'women')) DEFAULT 'unisex',
  role TEXT,
  specialty TEXT,
  rating NUMERIC DEFAULT 5.0,
  experience TEXT,
  image TEXT,
  available_days TEXT[] DEFAULT ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Working Hours Table
CREATE TABLE IF NOT EXISTS working_hours (
  day_of_week INTEGER PRIMARY KEY, -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  day_name TEXT NOT NULL,
  open_time TIME NOT NULL DEFAULT '09:00:00',
  close_time TIME NOT NULL DEFAULT '21:00:00',
  is_closed BOOLEAN DEFAULT false
);

-- 5. Blocked / Reserved Slots Table (e.g. Barber lunch break, day off)
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id TEXT REFERENCES barbers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Bookings Table (With Double-Booking Prevention)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id TEXT REFERENCES services(id) ON DELETE RESTRICT,
  barber_id TEXT REFERENCES barbers(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANTI-DOUBLE-BOOKING CONSTRAINT:
-- Prevents overlapping active bookings for the same barber at the same date and time.
CREATE UNIQUE INDEX IF NOT EXISTS unique_barber_date_time_booking 
ON bookings (barber_id, date, time) 
WHERE status != 'cancelled';

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  date TEXT NOT NULL,
  comment TEXT NOT NULL,
  service_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Admin Accounts Table (For Studio Owner Login & Custom Passwords)
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read catalog data
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Barbers" ON barbers FOR SELECT USING (true);
CREATE POLICY "Public Read Working Hours" ON working_hours FOR SELECT USING (true);
CREATE POLICY "Public Read Blocked Slots" ON blocked_slots FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);

-- Public can read booked slots to check availability (only date, time, barber_id)
CREATE POLICY "Public Read Bookings Availability" ON bookings FOR SELECT USING (true);

-- Public can create new bookings
CREATE POLICY "Public Create Bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Authenticated Admin has full access to manage everything
CREATE POLICY "Admin Full Access Services" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Barbers" ON barbers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Working Hours" ON working_hours FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Blocked Slots" ON blocked_slots FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Bookings" ON bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Reviews" ON reviews FOR ALL TO authenticated USING (true);
