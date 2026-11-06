# 💈 Charlie Hair Studio — Unisex Salon Ahmedabad

A high-performance, responsive, luxury website and automated booking platform for **Charlie Hair Studio (Unisex Salon)** located in Jodhpur Village, Ahmedabad.

Built with **Next.js (App Router)**, **Tailwind CSS**, **Supabase (PostgreSQL + RLS)**, and **Resend**.

---

## ✨ Features

- **Luxury Classic-Modern Aesthetic:** Deep charcoal (`#111111`), warm beige (`#FAF7F2`), and refined gold accents (`#C9A227`).
- **Complete Pricing & Treatment Menu:** All treatments from the Charlie Hair Studio catalog categorized into:
  - Men's Haircuts & Grooming (Regular, Beard, Wash, Director Cut)
  - Men's Chemical Services (L'Oréal Majirel, INOA Ammonia-Free, Keratin, Smoothing, Highlights)
  - Relaxing Services & Spas (Head massage, Dandruff spa, Full body massage)
  - Waxing & Trimmer (Men & Women)
  - Women's Hair (Styling, Blowdry, Ironing, Tongs, Director Cut)
  - Women's Chemical & Italian Nashi Argan Luxury Treatments
  - Skin Care, Casmara Algae Clean Up, O3+ & Premium Facials
  - D-Tan & Body Polishing
  - Manicure, Pedicure & Foot Reflexology
  - Bridal & Groom Makeup (HD wedding day packages)
  - Exclusive Groom & Bridal Packages (1 & 2 Sittings)
  - Annual Haircut & Membership Passes (12 Haircuts for 1 year, Silver/Gold/Platinum)
- **Zero Double-Booking Engine:** Dynamic slot validator that disables occupied intervals.
- **Interactive Multi-Step Booking Wizard:**
  1. Select treatment
  2. Choose preferred stylist or director
  3. Pick appointment date
  4. Choose free 30-min time slot
  5. Provide contact details
  6. Instant confirmation screen with confetti, booking ref, and WhatsApp notification button!
- **Email Dispatch:** Automated confirmation emails powered by Resend.
- **Password-Protected Admin Portal (`/admin`):**
  - Live appointments queue with Confirm / Cancel / Reschedule controls
  - Services & Pricing CRUD (add new services, adjust prices on the fly)
  - Block specific dates & holidays
  - Quick metrics: Today's bookings, weekly volume, estimated revenue
- **Click-to-Call & Direct WhatsApp:** One-tap calling (`+91 9624969690`) and pre-filled WhatsApp chat.
- **Embedded Dark Google Map:** Location directions to Ratnanjali Solitaire, Ahmedabad.

---

## 🚀 Quick Start (Local Development)

### 1. Open in Antigravity IDE
- In Antigravity IDE: Click **File** > **Open Folder...** (or press `Ctrl+K, Ctrl+O`).
- Select: `C:\Users\csidd\.gemini\antigravity\scratch\charlie-hair-studio`

### 2. Start the Development Server
Open the integrated terminal in Antigravity IDE (`Ctrl + ~`) and run:
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

### 3. Access Admin Panel
Visit [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email:** `admin@charlie.com` (or `charliehairstudio26@gmail.com`)
- **Password:** `charlie123`

---

## 🗄️ Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab in your Supabase dashboard.
3. Copy and run the contents of [`supabase/schema.sql`](./supabase/schema.sql) to create all tables and anti-double-booking constraints.
4. Copy and run the contents of [`supabase/seed.sql`](./supabase/seed.sql) to populate initial treatments, barbers, and working hours.
5. In your Supabase Project Settings, copy:
   - **Project URL**
   - **anon public key**
6. Paste them into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## ✉️ Resend Email Setup (Optional for live production emails)

1. Sign up at [resend.com](https://resend.com).
2. Generate an API Key in your Resend dashboard.
3. Paste it into `.env.local`:
   ```env
   RESEND_API_KEY=re_your_resend_api_key
   ```
*(Note: In local development without this key, the booking system runs in mock mode and logs simulated emails to the console).*

---

## ☁️ Deployment to Vercel (1-Click)

1. Push this project folder to your GitHub / GitLab repository.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. In the **Environment Variables** section on Vercel, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
5. Click **Deploy**. Vercel will automatically build and publish your high-speed website on a custom domain or `.vercel.app` URL!

---

## 📍 Studio Details
- **Studio Name:** Charlie Hair Studio (Unisex Salon)
- **Tagline:** Look Good • Feel Good
- **Address:** 15, Ratnanjali Solitaire, Nr. Axis Bank, Prernatirth Derasar Rd, Jodhpur Village, Ahmedabad, Gujarat 380015
- **Phone:** +91 9624969690
- **Email:** charliehairstudio26@gmail.com
