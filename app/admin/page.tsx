'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar, TrendingUp, Home, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function formatCOP(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ rooms: 0, bookings: 0, revenue: 0, pending: 0 })
    const [recentBookings, setRecentBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            const supabase = createClient()
            const [roomsRes, bookingsRes] = await Promise.all([
                supabase.from('rooms').select('id', { count: 'exact' }),
                supabase.from('bookings').select('id, status, final_price, upsells_total, customer_name, check_in, check_out, created_at').order('created_at', { ascending: false }).limit(10),
            ])
            const bookings = bookingsRes.data ?? []
            const revenue = bookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + (b.final_price ?? 0) + (b.upsells_total ?? 0), 0)
            const pending = bookings.filter(b => b.status === 'Pending').length
            setStats({ rooms: roomsRes.count ?? 0, bookings: bookings.length, revenue, pending })
            setRecentBookings(bookings.slice(0, 5))
            setLoading(false)
        }
        loadData()
    }, [])

    const statCards = [
        { label: 'Habitaciones', value: stats.rooms, icon: Home, color: 'var(--gold)' },
        { label: 'Reservas totales', value: stats.bookings, icon: Calendar, color: '#60a5fa' },
        { label: 'Revenue confirmado', value: formatCOP(stats.revenue), icon: TrendingUp, color: '#34d399', isString: true },
        { label: 'Pendientes', value: stats.pending, icon: AlertCircle, color: '#f87171' },
    ]

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ color: 'var(--text-muted)' }}>Cargando datos...</div>
        </div>
    )

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 className="font-serif text-gold-gradient" style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '4px' }}>
                    Dashboard
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Vista general del Grand Lumen Hotel
                </p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {statCards.map(({ label, value, icon: Icon, color, isString }) => (
                    <div key={label} className="glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {label}
                            </span>
                            <Icon size={16} style={{ color }} />
                        </div>
                        <div style={{ fontSize: isString ? '1.3rem' : '2rem', fontWeight: '600', color }}>
                            {value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Reservas recientes */}
            <div className="glass-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                        Reservas recientes
                    </h2>
                    <Link href="/admin/bookings" style={{ fontSize: '0.78rem', color: 'var(--gold)', textDecoration: 'none' }}>
                        Ver todas →
                    </Link>
                </div>

                {recentBookings.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px' }}>
                        Aún no hay reservas. ¡Haz la primera búsqueda en el hotel! 🏨
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentBookings.map((booking) => (
                            <div key={booking.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px',
                                border: '1px solid var(--border)',
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                        {booking.customer_name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        {booking.check_in} → {booking.check_out}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px', fontWeight: '500',
                                        background: booking.status === 'Confirmed' ? 'rgba(52,211,153,0.15)' :
                                            booking.status === 'Pending' ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)',
                                        color: booking.status === 'Confirmed' ? '#34d399' :
                                            booking.status === 'Pending' ? '#fbbf24' : '#f87171',
                                    }}>
                                        {booking.status}
                                    </span>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: '600', marginTop: '4px' }}>
                                        {formatCOP((booking.final_price ?? 0) + (booking.upsells_total ?? 0))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Accesos rápidos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
                <Link href="/admin/bookings" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                        <Calendar size={20} style={{ color: 'var(--gold)', marginBottom: '8px' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Gestionar Reservas
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Ver, confirmar y cancelar reservas
                        </div>
                    </div>
                </Link>
                <Link href="/admin/rooms" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }}>
                        <Home size={20} style={{ color: 'var(--gold)', marginBottom: '8px' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Habitaciones
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Estado y disponibilidad de las 12 suites
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}
