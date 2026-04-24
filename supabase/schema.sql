-- =============================================
-- GRAND LUMEN HOTEL — Schema SQL para Supabase
-- =============================================

-- 1. Habilitar extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tabla de habitaciones
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  base_price NUMERIC(12, 2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 2,
  size_sqm INTEGER,
  floor INTEGER,
  tags TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  intent_profile TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de reservas
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  intent_profile TEXT,
  search_query TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Exit Intent Abandoned')),
  base_price NUMERIC(12, 2),
  final_price NUMERIC(12, 2),
  price_multipliers JSONB DEFAULT '[]',
  upsells JSONB DEFAULT '[]',
  upsells_total NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de ofertas de upsell
CREATE TABLE IF NOT EXISTS upsell_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  target_intents TEXT[] DEFAULT '{}',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de eventos especiales (para precios dinámicos)
CREATE TABLE IF NOT EXISTS special_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_multiplier NUMERIC(4, 2) DEFAULT 1.20,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 6. Tabla de administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'manager' CHECK (role IN ('super_admin', 'manager', 'front_desk')),
  hotel_name TEXT DEFAULT 'Grand Lumen Hotel',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Función RPC para búsqueda semántica
CREATE OR REPLACE FUNCTION search_rooms_by_embedding(
  query_embedding vector(768),
  similarity_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  short_description TEXT,
  base_price NUMERIC,
  max_guests INTEGER,
  size_sqm INTEGER,
  tags TEXT[],
  amenities TEXT[],
  images TEXT[],
  intent_profile TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.name,
    r.slug,
    r.description,
    r.short_description,
    r.base_price,
    r.max_guests,
    r.size_sqm,
    r.tags,
    r.amenities,
    r.images,
    r.intent_profile,
    1 - (r.embedding <=> query_embedding) AS similarity
  FROM rooms r
  WHERE r.is_available = true
    AND 1 - (r.embedding <=> query_embedding) > similarity_threshold
  ORDER BY r.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 8. Función para obtener ocupación actual
CREATE OR REPLACE FUNCTION get_current_occupancy(check_in_date DATE, check_out_date DATE)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  total_rooms INTEGER;
  occupied_rooms INTEGER;
  occupancy_rate NUMERIC;
BEGIN
  SELECT COUNT(*) INTO total_rooms FROM rooms WHERE is_available = true;
  
  SELECT COUNT(DISTINCT room_id) INTO occupied_rooms
  FROM bookings
  WHERE status IN ('Confirmed', 'Pending')
    AND check_in < check_out_date
    AND check_out > check_in_date;
  
  IF total_rooms = 0 THEN
    occupancy_rate := 0;
  ELSE
    occupancy_rate := (occupied_rooms::NUMERIC / total_rooms::NUMERIC) * 100;
  END IF;
  
  RETURN jsonb_build_object(
    'total_rooms', total_rooms,
    'occupied_rooms', occupied_rooms,
    'occupancy_rate', ROUND(occupancy_rate, 2)
  );
END;
$$;

-- 9. Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 10. Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE upsell_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Rooms: lectura pública
CREATE POLICY "rooms_public_read" ON rooms FOR SELECT USING (true);
-- Rooms: escritura solo admin autenticado
CREATE POLICY "rooms_admin_write" ON rooms FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Bookings: inserción pública (para hacer reservas)
CREATE POLICY "bookings_public_insert" ON bookings FOR INSERT WITH CHECK (true);
-- Bookings: lectura y gestión solo admin
CREATE POLICY "bookings_admin_all" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Upsell offers: lectura pública
CREATE POLICY "upsells_public_read" ON upsell_offers FOR SELECT USING (true);
CREATE POLICY "upsells_admin_write" ON upsell_offers FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Special events: lectura pública
CREATE POLICY "events_public_read" ON special_events FOR SELECT USING (true);
CREATE POLICY "events_admin_write" ON special_events FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Admin users: solo el propio usuario puede ver su perfil
CREATE POLICY "admin_self_read" ON admin_users FOR SELECT USING (id = auth.uid());
CREATE POLICY "admin_self_update" ON admin_users FOR UPDATE USING (id = auth.uid());
