'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Square, MapPin, Star, Loader2, CalendarDays } from 'lucide-react'
import { Room } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

function formatCOP(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)
}

export default function RoomDetailPage() {
    const { slug } = useParams() as { slug: string }
    const router = useRouter()
    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadRoom = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('rooms').select('*').eq('slug', slug).single()
            if (!data) { router.push('/'); return }
            setRoom(data as Room)
            setLoading(false)
        }
        loadRoom()
    }, [slug, router])

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={32} style={{ color: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    )

    if (!room) return null

    const today = new Date()
    const checkIn = new Date(today); checkIn.setDate(today.getDate() + 2)
    const checkOut = new Date(today); checkOut.setDate(today.getDate() + 4)
    const fmt = (d: Date) => d.toISOString().split('T')[0]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--obsidian)' }}>
            {/* Hero */}
            <div style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), var(--obsidian))',
                borderBottom: '1px solid var(--border)',
                padding: '120px 24px 64px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div className="container-hotel" style={{ maxWidth: '900px', position: 'relative' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '28px' }}>
                        <ArrowLeft size={14} /> Inicio
                    </Link>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        {room.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="price-badge" style={{ fontSize: '0.7rem' }}>{tag}</span>
                        ))}
                    </div>
                    <h1 className="font-serif text-gold-gradient" style={{ fontSize: '3rem', fontWeight: '300', lineHeight: 1.1, marginBottom: '16px' }}>
                        {room.name}
                    </h1>
                    <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} />{room.max_guests} huéspedes</span>
                        {room.size_sqm && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Square size={14} />{room.size_sqm} m²</span>}
                        {room.floor && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} />Piso {room.floor}</span>}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={14} style={{ color: 'var(--gold)' }} />5 estrellas</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Desde</div>
                            <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--gold)' }}>{formatCOP(room.base_price)}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>por noche</div>
                        </div>
                        <Link
                            href={`/checkout?room=${slug}&check_in=${fmt(checkIn)}&check_out=${fmt(checkOut)}&guests=2&intent=${room.intent_profile[0] ?? 'default'}`}
                            className="btn-gold"
                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '0.95rem' }}
                        >
                            <CalendarDays size={16} />
                            Reservar ahora
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="container-hotel" style={{ maxWidth: '900px', padding: '48px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>
                    {/* Descripción & Amenidades */}
                    <div>
                        <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: '300', color: 'var(--text-primary)', marginBottom: '16px' }}>
                            Sobre esta habitación
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.95rem', marginBottom: '32px' }}>
                            {room.description}
                        </p>

                        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Amenidades incluidas
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {room.amenities.map((amenity) => (
                                <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>✦</span>
                                    {amenity}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card de reserva rápida */}
                    <div>
                        <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '20px' }}>
                            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                                Reserva rápida
                            </h3>
                            <div className="font-serif text-gold-gradient" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
                                {room.name}
                            </div>
                            <div className="gold-divider" style={{ marginBottom: '16px' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span>Por noche</span>
                                <span style={{ fontWeight: '600', color: 'var(--gold)' }}>{formatCOP(room.base_price)}</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
                                Los precios pueden variar según fechas, eventos y disponibilidad. El precio final incluye impuestos.
                            </div>
                            <Link
                                href={`/checkout?room=${slug}&check_in=${fmt(checkIn)}&check_out=${fmt(checkOut)}&guests=2&intent=${room.intent_profile[0] ?? 'default'}`}
                                className="btn-gold"
                                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '14px', fontSize: '0.9rem' }}
                            >
                                Confirmar reserva
                            </Link>
                            <Link
                                href="/"
                                style={{ display: 'block', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px', textDecoration: 'none' }}
                            >
                                ← Buscar otra habitación
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
