// =============================================
// Tipos TypeScript globales — Grand Lumen Hotel
// =============================================

export interface Room {
    id: string
    name: string
    slug: string
    description: string
    short_description: string
    base_price: number
    max_guests: number
    size_sqm: number | null
    floor: number | null
    tags: string[]
    amenities: string[]
    images: string[]
    intent_profile: string[]
    is_available: boolean
    created_at: string
    updated_at: string
}

export interface RoomWithSimilarity extends Room {
    similarity: number
    ai_reasoning?: string
}

export interface Booking {
    id: string
    room_id: string | null
    room?: Room
    customer_name: string
    customer_email: string
    customer_phone: string | null
    check_in: string
    check_out: string
    guests: number
    intent_profile: string | null
    search_query: string | null
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Exit Intent Abandoned'
    base_price: number | null
    final_price: number | null
    price_multipliers: PriceMultiplier[]
    upsells: UpsellSelection[]
    upsells_total: number
    notes: string | null
    created_at: string
    updated_at: string
}

export interface UpsellOffer {
    id: string
    type: string
    target_intents: string[]
    title: string
    description: string
    price: number
    icon: string | null
    is_active: boolean
}

export interface UpsellSelection {
    offer_id: string
    title: string
    price: number
}

export interface SpecialEvent {
    id: string
    name: string
    start_date: string
    end_date: string
    price_multiplier: number
    description: string | null
    is_active: boolean
}

export interface PriceMultiplier {
    reason: string
    multiplier: number
    description: string
}

export interface DynamicPriceResult {
    base_price: number
    final_price: number
    multipliers: PriceMultiplier[]
    nights: number
    total: number
}

export interface SearchParams {
    check_in: string | null
    check_out: string | null
    guests: number
    intent: string
    preferences: string[]
    search_embedding_text: string
}

export interface AdminUser {
    id: string
    full_name: string | null
    role: 'super_admin' | 'manager' | 'front_desk'
    hotel_name: string
    created_at: string
}
