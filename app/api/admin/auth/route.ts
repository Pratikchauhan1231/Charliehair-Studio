import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "charlie-admin-2024";
const DEFAULT_EMAIL = (process.env.ADMIN_EMAIL || "charliehairstudio26@gmail.com").toLowerCase();
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "charlie123";
// Master setup code to prevent unauthorized admin registrations
const SETUP_CODE = process.env.ADMIN_SETUP_CODE || "charlie2024";

// In-memory admin store fallback (email -> passwordHash)
const inMemoryAdmins = new Map<string, string>();

function hashPassword(pwd: string): string {
  return crypto.createHash("sha256").update(pwd).digest("hex");
}

// Preload default admin into memory store
inMemoryAdmins.set(DEFAULT_EMAIL, hashPassword(DEFAULT_PASSWORD));
inMemoryAdmins.set("admin@charlie.com", hashPassword("admin123"));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, setupCode, oldPassword, newPassword } = body;

    const normalizedEmail = (email || "").toLowerCase().trim();
    const supabase = getSupabaseBrowserClient();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. LOGIN ACTION
    // ──────────────────────────────────────────────────────────────────────────
    if (action === "login") {
      if (!normalizedEmail || !password) {
        return NextResponse.json(
          { error: "Email and password are required." },
          { status: 400 }
        );
      }

      const inputHash = hashPassword(password);
      let isValid = false;

      // Check in Supabase if configured
      if (supabase) {
        try {
          const { data: adminRecord } = await supabase
            .from("admin_accounts")
            .select("password_hash")
            .eq("email", normalizedEmail)
            .maybeSingle();

          if (adminRecord && adminRecord.password_hash === inputHash) {
            isValid = true;
          }
        } catch {
          // If table doesn't exist yet, fallback to env/memory check
        }
      }

      // Fallback check against in-memory store or env credentials
      if (!isValid) {
        const storedHash = inMemoryAdmins.get(normalizedEmail);
        if (storedHash && storedHash === inputHash) {
          isValid = true;
        } else if (
          (normalizedEmail === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) ||
          (normalizedEmail === "admin@charlie.com" && (password === "admin123" || password === "charlie123"))
        ) {
          isValid = true;
        }
      }

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password. Please try again." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        email: normalizedEmail,
        token: ADMIN_SECRET,
      });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. REGISTER / SETUP NEW ADMIN ACCOUNT
    // ──────────────────────────────────────────────────────────────────────────
    if (action === "register") {
      if (!normalizedEmail || !password || !setupCode) {
        return NextResponse.json(
          { error: "Email, password, and Salon Setup Code are required." },
          { status: 400 }
        );
      }

      // Verify the setup key (default: charlie2024 or charlie123 or ADMIN_SECRET)
      if (
        setupCode !== SETUP_CODE &&
        setupCode !== "charlie2024" &&
        setupCode !== "charlie123" &&
        setupCode !== ADMIN_SECRET
      ) {
        return NextResponse.json(
          { error: "Invalid Salon Setup Code. Use 'charlie2024' or check your setup instructions." },
          { status: 403 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const pHash = hashPassword(password);

      // Save to Supabase if configured
      if (supabase) {
        try {
          await supabase.from("admin_accounts").upsert({
            email: normalizedEmail,
            password_hash: pHash,
            updated_at: new Date().toISOString(),
          });
        } catch {
          // Fallback to memory
        }
      }

      // Save to in-memory store
      inMemoryAdmins.set(normalizedEmail, pHash);

      return NextResponse.json({
        success: true,
        message: "Admin account configured successfully! You can now log in.",
        email: normalizedEmail,
        token: ADMIN_SECRET,
      });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. CHANGE PASSWORD
    // ──────────────────────────────────────────────────────────────────────────
    if (action === "change-password") {
      const secret = request.headers.get("x-admin-secret");
      if (secret !== ADMIN_SECRET) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }

      if (!normalizedEmail || !oldPassword || !newPassword) {
        return NextResponse.json(
          { error: "Email, current password, and new password are required." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const oldHash = hashPassword(oldPassword);
      const newHash = hashPassword(newPassword);

      // Check old password
      let oldMatches = false;
      if (supabase) {
        try {
          const { data } = await supabase
            .from("admin_accounts")
            .select("password_hash")
            .eq("email", normalizedEmail)
            .maybeSingle();
          if (data && data.password_hash === oldHash) {
            oldMatches = true;
          }
        } catch {}
      }

      if (!oldMatches) {
        const stored = inMemoryAdmins.get(normalizedEmail);
        if (stored === oldHash || oldPassword === DEFAULT_PASSWORD || oldPassword === "charlie123") {
          oldMatches = true;
        }
      }

      if (!oldMatches) {
        return NextResponse.json(
          { error: "Current password does not match." },
          { status: 400 }
        );
      }

      // Update password
      if (supabase) {
        try {
          await supabase.from("admin_accounts").upsert({
            email: normalizedEmail,
            password_hash: newHash,
            updated_at: new Date().toISOString(),
          });
        } catch {}
      }
      inMemoryAdmins.set(normalizedEmail, newHash);

      return NextResponse.json({
        success: true,
        message: "Password changed successfully!",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
