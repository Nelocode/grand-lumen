'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, Calendar, Home, TrendingUp, LogOut, Sparkles } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const isLoginPage = pathname === '/admin/login'

    useEffect(() => {
        if (isLoginPage) { setLoading(false); return }
        const checkAuth = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/admin/login')
                return
            }
            setUser(user)
            setLoading(false)
        }
        checkAuth()
    }, [router, isLoginPage])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (isLoginPage) return <>{children}</>

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Verificando acceso...</div>
        </div>
    )

    const navItems = [
        { href: '/admin', icon: BarChart3, label: 'Dashboard' },
        { href: '/admin/bookings', icon: Calendar, label: 'Reservas' },
        { href: '/admin/rooms', icon: Home, label: 'Habitaciones' },
        { href: '/admin/pricing', icon: TrendingUp, label: 'Precios' },
    ]

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--obsidian)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px',
                background: 'var(--charcoal)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '28px 0',
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 30,
            }}>
                {/* Logo */}
                <div style={{ padding: '0 24px 28px', borderBottom: '1px solid var(--border)' }}>
                    <div className="font-serif text-gold-gradient" style={{ fontSize: '1.2rem', fontWeight: '400' }}>
                        ✦ Grand Lumen
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginTop: '2px' }}>
                        PANEL DE GESTIÓN
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '20px 12px' }}>
                    {navItems.map(({ href, icon: Icon, label }) => (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                marginBottom: '4px',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(201,169,110,0.08)'
                                e.currentTarget.style.color = 'var(--gold-light)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = 'var(--text-secondary)'
                            }}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Footer sidebar */}
                <div style={{ padding: '0 12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <Link href="/" style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                        color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', marginBottom: '4px',
                    }}>
                        <Sparkles size={14} />
                        Ver el hotel
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                            fontSize: '0.8rem', width: '100%', borderRadius: '8px',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                        <LogOut size={14} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    )
}
