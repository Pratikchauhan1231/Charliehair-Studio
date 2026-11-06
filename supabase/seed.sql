-- ==============================================================================
-- CHARLIE HAIR STUDIO - SUPABASE SEED DATA
-- ==============================================================================

-- 1. Working Hours (Open Everyday 9:00 AM - 9:00 PM)
INSERT INTO working_hours (day_of_week, day_name, open_time, close_time, is_closed) VALUES
  (0, 'Sunday', '09:00:00', '21:00:00', false),
  (1, 'Monday', '09:00:00', '21:00:00', false),
  (2, 'Tuesday', '09:00:00', '21:00:00', false),
  (3, 'Wednesday', '09:00:00', '21:00:00', false),
  (4, 'Thursday', '09:00:00', '21:00:00', false),
  (5, 'Friday', '09:00:00', '21:00:00', false),
  (6, 'Saturday', '09:00:00', '21:00:00', false)
ON CONFLICT (day_of_week) DO NOTHING;

-- 2. Hair Artists
INSERT INTO barbers (id, name, client_type, image, available_days) VALUES
  ('b-akshay', 'Akshay Bavaliya', 'men', '/images/barbers/akshay.jpg', ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
  ('b-jigar', 'Jigar Solanki', 'unisex', '/images/barbers/jigar.jpg', ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
  ('b-parth', 'Parth Solanki', 'unisex', '/images/barbers/parth.jpg', ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
  ('b-hetal', 'Hetal Jigar Solanki', 'women', '/images/barbers/hetal.jpg', ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
ON CONFLICT (id) DO UPDATE SET client_type = EXCLUDED.client_type;

-- 3. Core Services from Pricing Menu
INSERT INTO services (id, name, category, category_label, price, duration, description, popular, gender) VALUES
  ('m-haircut', 'Haircut (Men)', 'haircut_men', 'Men''s Hair & Grooming', 400, 30, 'Classic or modern cut tailored to your facial structure, finished with styling.', true, 'men'),
  ('m-beard', 'Beard Grooming & Shape', 'haircut_men', 'Men''s Hair & Grooming', 200, 20, 'Precision beard shaping, edge trimming, and conditioning oil application.', true, 'men'),
  ('m-hairwash-styling', 'Hair Wash + Styling', 'haircut_men', 'Men''s Hair & Grooming', 250, 20, 'Invigorating cleanse with premium shampoo followed by blow dry & styling.', false, 'men'),
  ('m-haircut-director', 'Haircut with Creative Director', 'haircut_men', 'Men''s Hair & Grooming', 450, 40, 'Master haircut with personalized style consultation by our senior director.', true, 'men'),
  ('m-chem-majirel', 'Hair Color [Majirel]', 'chemical_men', 'Men''s Chemical & Color', 1100, 45, 'L''Oréal Majirel rich permanent hair color coverage.', false, 'men'),
  ('m-chem-inoa', 'Hair Color [INOA Ammonia-Free]', 'chemical_men', 'Men''s Chemical & Color', 1200, 45, 'Ammonia-free luxury oil-delivery system hair coloring.', false, 'men'),
  ('m-chem-keratin', 'Brazilian Keratin Treatment', 'chemical_men', 'Men''s Chemical & Color', 4000, 90, 'Deep restorative protein treatment giving smooth, healthy, glossy locks.', true, 'men'),
  ('rel-head-massage', 'Traditional Head Massage', 'relaxing_men', 'Relaxation & Spa', 450, 25, 'Soothing acupressure head massage relieving mental tension and promoting circulation.', false, 'unisex'),
  ('rel-body-massage', 'Full Body Massage (45 Mins)', 'relaxing_men', 'Relaxation & Spa', 1500, 45, 'Relaxing muscle-relief massage by professional masseur.', true, 'unisex'),
  ('f-haircut', 'Female Haircut & Styling', 'female_hair', 'Women''s Hair Care', 800, 45, 'Precision haircut tailored to length and texture with styling blowdry.', true, 'women'),
  ('f-nashi-spa', 'Nashi Argan Luxury Spa', 'female_relaxing', 'Women''s Luxury Treatments', 3000, 60, 'Exclusive Italian Nashi Argan organic hair restoration spa.', true, 'women'),
  ('f-balayage', 'Balayage / Global Highlights', 'female_chemical', 'Women''s Chemical & Color', 7000, 120, 'Sun-kissed hand-painted balayage or seamless full global dimension.', true, 'women'),
  ('sk-casmara-clean', 'Casmara Clean Up', 'skin_care', 'Skin Care & Facials', 2500, 50, 'Luxury Casmara algae peel-off cleansing protocol.', true, 'unisex'),
  ('fac-o3-plus', 'O3+ Professional Facial', 'facial', 'Skin Care & Facials', 3500, 60, 'Renowned radiant glow and skin brightening treatment.', true, 'unisex'),
  ('dtan-face-neck', 'Face & Neck D-Tan', 'dtan', 'D-Tan & Polishing', 600, 25, 'Instantly removes stubborn tan, pollution, and dullness.', true, 'unisex'),
  ('pedi-spa', 'Spa Pedicure', 'manicure_pedicure', 'Nails & Hand/Foot Care', 1300, 45, 'Foot soak, callus smoothing, invigorating scrub, and massage.', true, 'unisex'),
  ('mu-groom', 'Groom Makeup (HD)', 'makeup', 'Bridal & Party Makeup', 2500, 45, 'High-definition camera-ready matte makeup for the groom.', true, 'men'),
  ('mu-bride-hd', 'Bride Makeup & Hair (HD)', 'makeup', 'Bridal & Party Makeup', 21000, 150, 'Complete signature HD bridal transformation with bridal hairstyling, lashes, and draping.', true, 'women'),
  ('pkg-groom-1', 'Groom Package (1 Sitting)', 'groom_package', 'Exclusive Packages', 5000, 120, 'Includes: Haircut, Beard Grooming, D-Tan, Facial, Manicure + Pedicure, Facemask.', true, 'men'),
  ('pkg-bridal-1', 'Bridal Package (1 Sitting)', 'bridal_package', 'Exclusive Packages', 13900, 240, 'Includes: Body D-Tan, Body Polishing, Facial, Waxing, Haircut, Hairspa, Mani + Pedi, Threading, Facemask.', true, 'women'),
  ('pkg-combo-1', 'Annual Haircut Pass (Combo 1)', 'combo_memberships', 'Annual Memberships', 3800, 30, 'Avail 12 Haircuts for 1 Full Year (Male). Massive savings for regulars!', true, 'men')
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  description = EXCLUDED.description;
