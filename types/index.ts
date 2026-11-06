export type ServiceCategory =
  | "haircut_men"
  | "chemical_men"
  | "relaxing_men"
  | "waxing_men"
  | "female_hair"
  | "female_relaxing"
  | "female_chemical"
  | "skin_care"
  | "facial"
  | "mask_bleach"
  | "dtan"
  | "polishing_threading"
  | "female_waxing"
  | "manicure_pedicure"
  | "nail_art"
  | "makeup"
  | "groom_package"
  | "bridal_package"
  | "combo_memberships";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string;
  price: number;
  duration: number; // in minutes
  description?: string;
  popular?: boolean;
  gender: "men" | "women" | "unisex";
}

export interface Barber {
  id: string;
  name: string;
  role?: string;
  specialty?: string;
  clientType: "men" | "unisex" | "women"; // "men" = Men Only, "unisex" = Men & Women, "women" = Female Only
  rating?: number;
  experience?: string;
  image: string;
  availableDays?: string[];
}

export interface Booking {
  id: string;
  service_id: string;
  barber_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at?: string;
  service?: Service;
  barber?: Barber;
}

export interface BlockedSlot {
  id: string;
  barber_id: string;
  date: string;
  time: string;
  reason?: string;
}

export interface WorkingHour {
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  day_name: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  serviceName: string;
}
