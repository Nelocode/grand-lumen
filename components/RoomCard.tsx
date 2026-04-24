'use client'

import Link from 'next/link'
import { Users, Maximize2, MapPin, Star } from 'lucide-react'
import { RoomWithSimilarity, DynamicPriceResult } from '@/lib/types'

interface RoomCardProps {
    room: RoomWithSimilarity & { dynamic_price?: DynamicPriceResult }
    searchParams?: {
        check_in?: string | null
        check_out?: string | null
        guests?: number
        intent?: string
    }
    rank?: number
}

function formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export default function RoomCard({ room, searchParams, rank = 1 }: RoomCardProps) {
    const price = room.dynamic_price
    const hasMultipliers = price && price.multipliers.length > 0
    const priceChanged = price && price.final_price !== price.base_price

    // Color del ranking
    const rankColors = ['var(--gold)', '#C0C0C0', '#CD7F32']
    const rankLabel = ['1ª opción', '2ª opción', '3ª opción']

    return (
        <Link
            href={`/rooms/${room.slug}?${new URLSearchParams({
                ...(searchParams?.check_in ? { check_in: searchParams.check_in } : {}),
                ...(searchParams?.check_out ? { check_out: searchParams.check_out } : {}),
                ...(searchParams?.guests ? { guests: String(searchParams.guests) } : {}),
                ...(searchParams?.intent ? { intent: searchParams.intent } : {}),
            }).toString()}`}
            style={{ textDecoration: 'none', display: 'block' }}
        >
            <article
                className="glass-card overflow-hidden cursor-pointer group"
                style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.3)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = ''
                }}
            >
                {/* Imagen */}
                <div
                    className="relative overflow-hidden"
                    style={{ height: '220px', background: 'var(--slate)' }}
                >
                    {/* Placeholder artístico mientras no hay imagen real */}
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(135deg, 
                hsl(${(rank * 37 + 200) % 360}, 20%, 18%) 0%, 
                hsl(${(rank * 37 + 240) % 360}, 25%, 12%) 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            transition: 'transform 0.5s ease',
                        }}
                        className="group-hover:scale-105"
                    >
                        {room.intent_profile.includes('Romantic') ? '🌹' :
                            room.intent_profile.includes('Business') ? '💼' :
                                room.intent_profile.includes('Family') ? '👨‍👩‍👧' :
                                    room.intent_profile.includes('Wellness') ? '🧘' :
                                        room.intent_profile.includes('Luxury') ? '👑' :
                                            room.intent_profile.includes('Nature') ? '🌿' : '🏨'}
                    </div>

                    {/* Badge de ranking */}
                    <div
                        className="absolute top-3 left-3"
                        style={{
                            background: 'rgba(10, 10, 11, 0.85)',
                            border: `1px solid ${rankColors[rank - 1] ?? 'var(--border)'}`,
                            borderRadius: '20px',
                            padding: '4px 10px',
                            fontSize: '0.7rem',
                            color: rankColors[rank - 1] ?? 'var(--text-secondary)',
                            fontWeight: '600',
                            letterSpacing: '0.03em',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        ✦ {rankLabel[rank - 1] ?? `#${rank}`}
                    </div>

                    {/* Piso y m² */}
                    {(room.floor || room.size_sqm) && (
                        <div
                            className="absolute top-3 right-3"
                            style={{
                                background: 'rgba(10, 10, 11, 0.85)',
                                borderRadius: '8px',
                                padding: '4px 10px',
                                fontSize: '0.7rem',
                                color: 'var(--text-secondary)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                gap: '8px',
                            }}
                        >
                            {room.floor && <span>Piso {room.floor}</span>}
                            {room.size_sqm && <span>{room.size_sqm}m²</span>}
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <div style={{ padding: '20px' }}>
                    {/* Nombre */}
                    <h3
                        className="font-serif text-gold-gradient"
                        style={{ fontSize: '1.4rem', fontWeight: '400', marginBottom: '8px', lineHeight: 1.2 }}
                    >
                        {room.name}
                    </h3>

                    {/* Razonamiento AI */}
                    {room.ai_reasoning && (
                        <p
                            style={{
                                fontSize: '0.82rem',
                                color: 'var(--gold-light)',
                                fontStyle: 'italic',
                                marginBottom: '12px',
                                lineHeight: 1.5,
                                opacity: 0.85,
                            }}
                        >
                            ✦ {room.ai_reasoning}
                        </p>
                    )}

                    {/* Descripción corta */}
                    <p
                        style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '16px',
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {room.short_description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {room.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="room-tag">{tag}</span>
                        ))}
                    </div>

                    {/* Info rápida */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '16px',
                            marginBottom: '16px',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={12} /> Hasta {room.max_guests}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} /> El Poblado, Medellín
                        </span>
                    </div>

                    {/* Divisor */}
                    <div className="gold-divider mb-4" />

                    {/* Precio */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <div>
                            {priceChanged && (
                                <span
                                    style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text-muted)',
                                        textDecoration: 'line-through',
                                        display: 'block',
                                        lineHeight: 1,
                                        marginBottom: '2px',
                                    }}
                                >
                                    {formatCOP(price!.base_price)}
                                </span>
                            )}
                            <span
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                    color: priceChanged ? 'var(--gold)' : 'var(--text-primary)',
                                    lineHeight: 1,
                                }}
                            >
                                {formatCOP(price ? price.final_price : room.base_price)}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                                / noche
                            </span>
                            {price && price.nights > 1 && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    Total {price.nights} noches: {formatCOP(price.total)}
                                </div>
                            )}
                        </div>

                        {/* Multiplicadores de precio */}
                        {hasMultipliers && (
                            <div style={{ textAlign: 'right' }}>
                                {price!.multipliers.slice(0, 2).map((m) => (
                                    <span key={m.reason} className="price-badge" style={{ display: 'block', marginBottom: '4px' }}>
                                        {m.multiplier > 1 ? '↑' : '↓'} {m.description.split('·')[1]?.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <button
                        className="btn-gold w-full mt-4"
                        style={{ fontSize: '0.8rem', padding: '12px' }}
                    >
                        Ver habitación →
                    </button>
                </div>
            </article>
        </Link>
    )
}
