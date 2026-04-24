-- =============================================
-- GRAND LUMEN HOTEL — Datos de prueba (Seed)
-- =============================================

-- 12 Habitaciones del Grand Lumen Hotel
-- 5★ en El Poblado, Medellín, Colombia
-- Precios en COP (pesos colombianos)

INSERT INTO rooms (name, slug, description, short_description, base_price, max_guests, size_sqm, floor, tags, amenities, images, intent_profile) VALUES

-- 1. Suite Romántica "La Orquídea"
(
  'Suite La Orquídea',
  'suite-la-orquidea',
  'Nuestra suite más romántica, diseñada para parejas que buscan una experiencia íntima e inolvidable. Jacuzzi privado con vista a las montañas del Aburrá, cama king-size canopy con dosel blanco, y una bañera de mármol italiana. Incluye pétalos de rosas al check-in, champagne de bienvenida y velas aromáticas. La luz natural filtra suavemente por cortinas de seda, creando un ambiente que invita al descanso y la conexión.',
  'Jacuzzi privado, cama canopy, champagne de bienvenida y vista a las montañas.',
  1850000,
  2, 68, 12,
  ARRAY['romantic', 'sea-view', 'jacuzzi', 'suite', 'private'],
  ARRAY['Jacuzzi privado', 'Cama king canopy', 'Bañera de mármol', 'Champagne de bienvenida', 'Pétalos de rosas', 'Smart TV 65"', 'Minibar premium', 'Balcón privado', 'Room service 24h'],
  ARRAY['/rooms/orquidea/main.jpg', '/rooms/orquidea/bath.jpg', '/rooms/orquidea/view.jpg'],
  ARRAY['Romantic', 'Anniversary', 'Honeymoon']
),

-- 2. Suite Ejecutiva "El Cóndor"
(
  'Suite El Cóndor',
  'suite-el-condor',
  'La suite preferida por ejecutivos y profesionales que visitan Medellín por negocios. Escritorio de roble macizo de 180cm con doble pantalla montada, silla ergonómica Aeron, impresora láser y scanner disponibles. Conexión WiFi empresarial de fibra óptica dedicada de 500Mbps. Sala de reuniones privada para hasta 4 personas con pantalla de presentación. La habitación está insonorizada para garantizar concentración total. Servicio de desayuno ejecutivo en habitación incluido.',
  'Escritorio ejecutivo, WiFi 500Mbps dedicado, sala de reuniones privada y desayuno incluido.',
  1650000,
  2, 72, 15,
  ARRAY['business', 'work', 'desk', 'silent', 'executive', 'meeting'],
  ARRAY['Escritorio ejecutivo 180cm', 'Doble monitor', 'WiFi 500Mbps dedicado', 'Sala de reuniones privada', 'Impresora y scanner', 'Desayuno ejecutivo incluido', 'Prensa diaria', 'Caja fuerte XL', 'Plancha y centro de planchado', 'Late check-out estándar 14h'],
  ARRAY['/rooms/condor/main.jpg', '/rooms/condor/desk.jpg', '/rooms/condor/meeting.jpg'],
  ARRAY['Business', 'Work', 'Corporate']
),

-- 3. Suite Familiar "Los Colibríes"
(
  'Suite Los Colibríes',
  'suite-los-colibries',
  'Diseñada especialmente para que las familias disfruten Medellín sin preocupaciones. Cuenta con dos dormitorios conectados: uno principal con cama king y uno infantil con dos camas individuales temáticas. Zona de juegos interior con consola de videojuegos, mini cine proyector y zona de arte. Cocina americana equipada con microondas, nevera grande y cafetera. Bañera con juegos de agua para niños. Acceso preferencial a la piscina familiar. Baby kit disponible para bebés.',
  'Dos dormitorios conectados, zona de juegos, cocina americana y acceso preferencial a piscina.',
  2200000,
  6, 98, 8,
  ARRAY['family', 'kids', 'family-friendly', 'connected', 'kitchen'],
  ARRAY['2 dormitorios conectados', 'Zona de juegos infantil', 'Consola de videojuegos', 'Mini cine proyector', 'Cocina americana', 'Bañera infantil con juegos', 'Baby kit disponible', 'Smart TV por habitación', 'Acceso preferencial piscina'],
  ARRAY['/rooms/colibries/main.jpg', '/rooms/colibries/kids.jpg', '/rooms/colibries/kitchen.jpg'],
  ARRAY['Family', 'Kids', 'Group']
),

-- 4. Habitación Deluxe "El Retiro"
(
  'Habitación El Retiro',
  'habitacion-el-retiro',
  'Una habitación de retiro para quien busca paz, silencio y reconexión consigo mismo. Sin televisión (por diseño), con un rincón de meditación y yoga con esterilla premium, difusor de aromas con aceites esenciales de lavanda y eucalipto colombiano, y una colección de libros curada. El colchón ortopédico firmado por especialistas en sueño y las almohadas de plumas de ganso garantizan el descanso más reparador. Habitación orientada al jardín botánico interior del hotel. Silencio garantizado.',
  'Retiro de silencio, rincón de meditación, jardín interior y el colchón más cómodo del hotel.',
  980000,
  2, 45, 3,
  ARRAY['wellness', 'silent', 'meditation', 'yoga', 'quiet', 'retreat'],
  ARRAY['Sin TV (por diseño)', 'Rincón de meditación', 'Esterilla yoga premium', 'Difusor de aromas', 'Colección de libros', 'Colchón ortopédico sensación nube', 'Almohadas pluma de ganso', 'Vista jardín botánico', 'Insonorización premium'],
  ARRAY['/rooms/retiro/main.jpg', '/rooms/retiro/meditation.jpg', '/rooms/retiro/garden.jpg'],
  ARRAY['Wellness', 'Retreat', 'Solo']
),

-- 5. Suite Panorámica "Cristo Rey"
(
  'Suite Cristo Rey',
  'suite-cristo-rey',
  'La habitación más alta del Grand Lumen, con una vista panorámica de 270° de Medellín que quita el aliento. Paredes de cristal del piso al techo que convierte cada amanecer y atardecer en una experiencia cinematográfica. Terraza privada de 40m² con jacuzzi exterior, tumbonas y zona de dining al aire libre. Es nuestra suite insignia y la favorita de celebridades y visitantes VIP. Incluye servicio de mayordomo privado durante su estadía.',
  'Vista 270° de Medellín, terraza 40m² con jacuzzi exterior y servicio de mayordomo.',
  2800000,
  2, 120, 20,
  ARRAY['luxury', 'panoramic', 'view', 'vip', 'suite', 'terrace', 'jacuzzi', 'romantic'],
  ARRAY['Vista 270° Medellín', 'Terraza privada 40m²', 'Jacuzzi exterior', 'Mayordomo privado', 'Paredes de cristal', 'Dining exterior', 'Cama king flotante', 'Bañera frente a la ciudad', 'Champagne y frutas diario'],
  ARRAY['/rooms/cristorey/main.jpg', '/rooms/cristorey/terrace.jpg', '/rooms/cristorey/view.jpg'],
  ARRAY['Luxury', 'VIP', 'Romantic', 'Anniversary', 'Business']
),

-- 6. Habitación Clásica "El Prado"
(
  'Habitación El Prado',
  'habitacion-el-prado',
  'La elegancia clásica del Grand Lumen en su expresión más pura. Decoración inspirada en las haciendas cafeteras antioqueñas del siglo XIX, con madera de cedro, artesanías Zenú y pinturas de artistas locales de El Poblado. Cama queen con ropa de cama egipcia de 600 hilos. Un espacio que respira autenticidad colombiana sin sacrificar ningún confort moderno. Perfecta para viajeros solos o parejas que valoran la cultura local.',
  'Diseño inspirado en haciendas cafeteras, arte local y ropa de cama egipcia.',
  680000,
  2, 38, 5,
  ARRAY['classic', 'cultural', 'colombian', 'comfortable', 'solo'],
  ARRAY['Decoración cafetera auténtica', 'Arte de artistas locales', 'Ropa de cama 600 hilos', 'Ducha efecto lluvia', 'Smart TV 50"', 'Minibar selecto', 'WiFi 200Mbps', 'Caja fuerte'],
  ARRAY['/rooms/prado/main.jpg', '/rooms/prado/decor.jpg', '/rooms/prado/bath.jpg'],
  ARRAY['Solo', 'Cultural', 'Business', 'Romantic']
),

-- 7. Suite Wellness "La Cascada"
(
  'Suite La Cascada',
  'suite-la-cascada',
  'Una suite concebida como un spa privado dentro del hotel. La ducha de lluvia tropical de 4 cabezales simula el sonido y la sensación de una cascada de la selva colombiana. Tina de cromoterapia con 16 colores y sistema de aromaterapia integrado. Acceso exclusivo al spa del hotel con tratamientos ilimitados durante la estadía (30 minutos de masaje diario incluido). Menú de wellness room service con jugos prensados en frío y snacks saludables. Floor heating para las mañanas frescas de Medellín.',
  'Spa privado, ducha cascada, cromoterapia, y masaje diario de 30 min incluido.',
  1450000,
  2, 65, 7,
  ARRAY['wellness', 'spa', 'relax', 'therapy', 'luxury', 'health'],
  ARRAY['Ducha cascada 4 cabezales', 'Tina cromoterapia', 'Aromaterapia integrada', 'Masaje 30min/día incluido', 'Acceso spa ilimitado', 'Floor heating', 'Menú wellness', 'Ropa de baño premium', 'Productos spa Natura Bissé'],
  ARRAY['/rooms/cascada/main.jpg', '/rooms/cascada/spa.jpg', '/rooms/cascada/shower.jpg'],
  ARRAY['Wellness', 'Retreat', 'Romantic', 'Solo']
),

-- 8. Habitación Garden "Heliconias"
(
  'Habitación Las Heliconias',
  'habitacion-heliconias',
  'La única habitación con jardín privado accesible directamente desde la habitación. Un jardín de 25m² con heliconias, orquídeas y matas de platanillo típicas de la flora antioqueña. Perfecta para quienes viajan con mascotas (pet-friendly) o simplemente aman despertar con el trino de los pájaros y el olor a tierra mojada. La habitación tiene techo de doble altura con claraboya. Desayuno jardín disponible en su espacio verde privado.',
  'Jardín privado 25m², pet-friendly, flora antioqueña y desayuno en el jardín.',
  870000,
  2, 52, 1,
  ARRAY['garden', 'pet-friendly', 'nature', 'outdoor', 'family', 'quiet'],
  ARRAY['Jardín privado 25m²', 'Pet-friendly', 'Claraboya', 'Desayuno en jardín', 'Flora antioqueña', 'Hamaca exterior', 'Ducha outdoor', 'Smart TV', 'WiFi 200Mbps'],
  ARRAY['/rooms/heliconias/main.jpg', '/rooms/heliconias/garden.jpg', '/rooms/heliconias/flowers.jpg'],
  ARRAY['Family', 'Solo', 'Wellness', 'Nature']
),

-- 9. Suite Loft "El Tranvía"
(
  'Suite Loft El Tranvía',
  'suite-loft-tranvia',
  'Un loft de doble altura inspirado en la arquitectura industrial de Medellín y el patrimonio del tranvía que conectaba El Poblado a principios del siglo XX. Estructura de acero expuesto, ladrillo vista y concreto pulido conviven con mobiliario de diseño contemporáneo colombiano. Cocina completa de gourmet con electrodomésticos Smeg. Estudio en planta baja y dormitorio en mezanine. Ideal para estancias largas o para artistas y creativos en residencia.',
  'Loft industrial doble altura, cocina gourmet Smeg, estudio privado y diseño colombiano.',
  1250000,
  3, 88, 6,
  ARRAY['loft', 'design', 'creative', 'kitchen', 'work', 'long-stay', 'modern'],
  ARRAY['Doble altura industrial', 'Cocina gourmet Smeg', 'Mezanine con vista', 'Escritorio creativo', 'Smart TV cinema 75"', 'Barra americana', 'Lavadora y secadora', 'Terraza pequeña', 'WiFi 300Mbps'],
  ARRAY['/rooms/tranvia/main.jpg', '/rooms/tranvia/loft.jpg', '/rooms/tranvia/kitchen.jpg'],
  ARRAY['Business', 'Creative', 'Solo', 'Long Stay']
),

-- 10. Habitación Estándar Premium "El Guayabo"
(
  'Habitación El Guayabo',
  'habitacion-el-guayabo',
  'La habitación ideal para el viajero inteligente que no quiere comprometerse en comodidad. Cama queen premium, baño con ducha de lluvia y productos de la marca colombiana La Receta. Escritorio compacto perfectamente iluminado para trabajar. Vista al patio andaluz interior del hotel con fuente. Precio excepcional sin sacrificar nada de lo que el Grand Lumen promete. La más solicitada entre quienes regresan al hotel.',
  'La mejor relación calidad-precio del hotel. Queen premium, ducha lluvia y patio andaluz.',
  520000,
  2, 32, 4,
  ARRAY['standard', 'value', 'comfortable', 'work', 'quiet', 'classic'],
  ARRAY['Cama queen premium', 'Ducha efecto lluvia', 'Escritorio iluminado', 'Vista patio andaluz', 'Smart TV 43"', 'WiFi 100Mbps', 'Minibar básico', 'Productos La Receta', 'Caja fuerte'],
  ARRAY['/rooms/guayabo/main.jpg', '/rooms/guayabo/patio.jpg', '/rooms/guayabo/bath.jpg'],
  ARRAY['Solo', 'Business', 'Romantic', 'Budget-Smart']
),

-- 11. Suite Mirador "El Ávila"
(
  'Suite El Ávila',
  'suite-el-avila',
  'Una suite de estilo contemporáneo con los mejores atardeceres sobre el valle de Aburrá. Perfecta para grupos de amigos o pequeñas celebraciones privadas. Sala de estar amplia con sofá modular para 6 personas, sistema de sonido Sonos multiroom y barra de licores completa. Dos baños completos. La recámara principal tiene cama king con cabecero artístico de madera intervenida por el artista paisa Fernando Botero Zea (no el pintor, pero igual de talentoso). Balcón con hamacas y mesas altas.',
  'Vista al valle, sala para 6, sistema Sonos, barra de licores y dos baños completos.',
  1980000,
  4, 95, 18,
  ARRAY['sunset', 'view', 'social', 'group', 'celebration', 'luxury', 'party'],
  ARRAY['Vista valle Aburrá', 'Sala modular 6 personas', 'Sistema Sonos multiroom', 'Barra de licores', '2 baños completos', 'Balcón con hamacas', 'Cama king artística', 'Smart TV 65" + proyector', 'Servicio de cóctelería'],
  ARRAY['/rooms/avila/main.jpg', '/rooms/avila/view.jpg', '/rooms/avila/living.jpg'],
  ARRAY['Romantic', 'Group', 'Celebration', 'Business']
),

-- 12. Suite Pool Access "Ciénaga de Oro"
(
  'Suite Ciénaga de Oro',
  'suite-cienaga-de-oro',
  'La única suite del Grand Lumen con acceso directo a la piscina desde la terraza privada. Abre las puertas y salta al agua. La piscina infinity del hotel, a temperatura controlada de 28°C, está disponible exclusivamente para los huéspedes de esta suite entre las 6am y las 9am. Decoración inspirada en la sabana de Córdoba con tonos dorados, mostaza y terracota. Cama king con dosel de fibras naturales. Perfecta para luna de miel o para el viajero que ama el agua.',
  'Acceso directo a la piscina infinity, terraza privada y exclusividad matutina.',
  2100000,
  2, 78, 2,
  ARRAY['pool', 'swim', 'water', 'romantic', 'honeymoon', 'luxury', 'suite', 'exclusive'],
  ARRAY['Acceso directo a piscina', 'Exclusividad piscina 6-9am', 'Terraza privada', 'Cama king dosel natural', 'Piscina infinity 28°C', 'Ducha exterior', 'Daybed en terraza', 'Minibar con fresh juices', 'Vista a jardines'],
  ARRAY['/rooms/cienaga/main.jpg', '/rooms/cienaga/pool.jpg', '/rooms/cienaga/terrace.jpg'],
  ARRAY['Romantic', 'Honeymoon', 'Wellness', 'Luxury']
);

-- =============================================
-- Ofertas de Upsell por perfil de intención
-- =============================================
INSERT INTO upsell_offers (type, target_intents, title, description, price, icon) VALUES
('late_checkout', ARRAY['Business', 'Corporate', 'Work'], 'Late Check-out hasta las 3pm', 'Extiende tu check-out estándar (12m) hasta las 3pm. Perfecto para vuelos vespertinos.', 85000, '🕒'),
('wine_roses', ARRAY['Romantic', 'Anniversary', 'Honeymoon'], 'Botella de Vino + Rosas', 'Una botella de vino colombiano Marqués de Casa Concha y 24 rosas rojas en tu habitación al llegar.', 190000, '🌹'),
('kids_buffet', ARRAY['Family', 'Kids'], 'Kids Buffet Upgrade', 'Desayuno completo en buffet para todos los niños de tu reserva, incluidos los menores de 12 años.', 75000, '🍳'),
('spa_session', ARRAY['Wellness', 'Retreat', 'Solo'], 'Sesión Spa 60 min', 'Un masaje relajante de 60 minutos en nuestro spa con aromaterapia incluida (valorado en $280.000).', 180000, '💆'),
('early_checkin', ARRAY['Business', 'Family', 'Romantic'], 'Early Check-in desde las 10am', 'Entra a tu habitación desde las 10am en lugar de las 3pm estándar, sujeto a disponibilidad.', 95000, '🌅'),
('airport_transfer', ARRAY['Business', 'Corporate', 'Luxury', 'VIP'], 'Transfer Aeropuerto Privado', 'BMW o Mercedes Benz te espera en el Aeropuerto José María Córdova con chofer uniformado.', 320000, '🚘'),
('champagne_fruits', ARRAY['Romantic', 'Honeymoon', 'Anniversary', 'Celebration'], 'Champagne + Tabla de Frutas', 'Moët & Chandon Brut y una tabla de frutas exóticas colombianas esperando en tu habitación.', 280000, '🍾'),
('bike_rental', ARRAY['Solo', 'Nature', 'Cultural', 'Wellness'], 'Bicicleta Eléctrica por el Día', 'Explora El Poblado y Laureles en una bicicleta eléctrica de alta gama. Incluye casco y guía de rutas.', 120000, '🚴');

-- =============================================
-- Eventos especiales 2025–2026
-- =============================================
INSERT INTO special_events (name, start_date, end_date, price_multiplier, description) VALUES
('Feria de las Flores', '2025-08-01', '2025-08-10', 1.30, 'La fiesta más importante de Medellín. Alta demanda hotelera.'),
('Festival de Luces', '2025-12-08', '2025-12-15', 1.25, 'Alumbrados navideños de Medellín, atractivo turístico internacional.'),
('Semana Santa 2025', '2025-04-13', '2025-04-20', 1.20, 'Semana de alta ocupación en todo Colombia.'),
('Año Nuevo 2026', '2025-12-30', '2026-01-02', 1.40, 'Celebración de fin de año y Año Nuevo. Precio premium.'),
('Festival Internacional de Jazz', '2025-09-05', '2025-09-07', 1.15, 'Festival de jazz en el Teatro Metropolitano de Medellín.'),
('Semana Santa 2026', '2026-04-02', '2026-04-05', 1.20, 'Semana de alta ocupación en todo Colombia.'),
('Feria de las Flores 2026', '2026-08-07', '2026-08-16', 1.30, 'La fiesta más importante de Medellín.');
