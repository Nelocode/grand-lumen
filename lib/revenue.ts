import { DynamicPriceResult, PriceMultiplier } from './types'

// Festivos colombianos 2025–2026
const COLOMBIAN_HOLIDAYS: string[] = [
    '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18',
    '2025-05-01', '2025-06-02', '2025-06-23', '2025-06-30', '2025-07-20',
    '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17',
    '2025-12-08', '2025-12-25',
    '2026-01-01', '2026-01-05', '2026-03-23', '2026-04-02', '2026-04-03',
    '2026-05-01', '2026-06-15', '2026-07-20', '2026-08-07', '2026-08-17',
    '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25',
]

// Eventos especiales Medellín (fuera de la DB para acceso server-side rápido)
const MEDELLIN_EVENTS = [
    { name: 'Feria de las Flores', start: '2025-08-01', end: '2025-08-10', multiplier: 1.30 },
    { name: 'Festival de Luces', start: '2025-12-08', end: '2025-12-15', multiplier: 1.25 },
    { name: 'Semana Santa', start: '2025-04-13', end: '2025-04-20', multiplier: 1.20 },
    { name: 'Año Nuevo', start: '2025-12-30', end: '2026-01-02', multiplier: 1.40 },
    { name: 'Festival de Jazz', start: '2025-09-05', end: '2025-09-07', multiplier: 1.15 },
    { name: 'Semana Santa 2026', start: '2026-04-02', end: '2026-04-05', multiplier: 1.20 },
    { name: 'Feria de las Flores 2026', start: '2026-08-07', end: '2026-08-16', multiplier: 1.30 },
]

/**
 * Calcula el número de noches entre dos fechas
 */
function getNights(checkIn: string, checkOut: string): number {
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diff = outDate.getTime() - inDate.getTime()
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Verifica si un rango de fechas incluye algún festivo colombiano
 */
function hasHoliday(checkIn: string, checkOut: string): boolean {
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    return COLOMBIAN_HOLIDAYS.some((holiday) => {
        const h = new Date(holiday)
        return h >= inDate && h < outDate
    })
}

/**
 * Verifica si las fechas coinciden con fines de semana
 */
function hasWeekend(checkIn: string, checkOut: string): boolean {
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const current = new Date(inDate)
    while (current < outDate) {
        const day = current.getDay()
        if (day === 0 || day === 5 || day === 6) return true
        current.setDate(current.getDate() + 1)
    }
    return false
}

/**
 * Verifica si las fechas coinciden con un evento especial de Medellín
 */
function getSpecialEvent(checkIn: string, checkOut: string) {
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    return MEDELLIN_EVENTS.find((evt) => {
        const evtStart = new Date(evt.start)
        const evtEnd = new Date(evt.end)
        return inDate < evtEnd && outDate > evtStart
    })
}

/**
 * Obtiene el pronóstico de lluvia de Open-Meteo (sin API key)
 * Medellín: lat 6.2442, lon -75.5812
 */
async function getMedellinRainForecast(checkIn: string): Promise<boolean> {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=6.2442&longitude=-75.5812&daily=precipitation_probability_max&forecast_days=7&timezone=America/Bogota&start_date=${checkIn}&end_date=${checkIn}`
        const res = await fetch(url, { next: { revalidate: 3600 } }) // cache 1h
        if (!res.ok) return false
        const data = await res.json()
        const prob = data?.daily?.precipitation_probability_max?.[0] ?? 0
        return prob >= 70 // lluvia si probabilidad >= 70%
    } catch {
        return false
    }
}

/**
 * Motor principal de precios dinámicos
 * Calcula precio final aplicando hasta 3 multiplicadores
 */
export async function calculateDynamicPrice(
    basePrice: number,
    checkIn: string,
    checkOut: string,
    currentOccupancyRate: number = 50
): Promise<DynamicPriceResult> {
    const multipliers: PriceMultiplier[] = []
    let pricePerNight = basePrice
    const nights = getNights(checkIn, checkOut)

    // 1. Ocupación alta → +15%
    if (currentOccupancyRate > 80) {
        multipliers.push({
            reason: 'high_occupancy',
            multiplier: 1.15,
            description: `Alta demanda (${currentOccupancyRate.toFixed(0)}% ocupación) · +15%`,
        })
        pricePerNight *= 1.15
    }

    // 2. Evento especial o festivo → +20% (evento) o +10% (festivo)
    const event = getSpecialEvent(checkIn, checkOut)
    if (event) {
        multipliers.push({
            reason: 'special_event',
            multiplier: event.multiplier,
            description: `${event.name} en Medellín · +${Math.round((event.multiplier - 1) * 100)}%`,
        })
        pricePerNight *= event.multiplier
    } else if (hasHoliday(checkIn, checkOut)) {
        multipliers.push({
            reason: 'holiday',
            multiplier: 1.10,
            description: 'Festivo colombiano · +10%',
        })
        pricePerNight *= 1.10
    } else if (hasWeekend(checkIn, checkOut)) {
        multipliers.push({
            reason: 'weekend',
            multiplier: 1.08,
            description: 'Precio fin de semana · +8%',
        })
        pricePerNight *= 1.08
    }

    // 3. Lluvia pronosticada → -5% "Stay & Relax"
    const isRainy = await getMedellinRainForecast(checkIn)
    if (isRainy) {
        multipliers.push({
            reason: 'rainy_stay_relax',
            multiplier: 0.95,
            description: 'Lluvia en Medellín · Stay & Relax -5%',
        })
        pricePerNight *= 0.95
    }

    const finalPricePerNight = Math.round(pricePerNight)

    return {
        base_price: basePrice,
        final_price: finalPricePerNight,
        multipliers,
        nights,
        total: finalPricePerNight * nights,
    }
}
