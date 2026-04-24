'use client'

import { useEffect, useRef, useState } from 'react'

export interface ExitOffer {
    title: string
    desc: string
    icon: string
    price: number
}

interface ExitIntentModalProps {
    roomName?: string
    intent?: string
    onAccept: (offer: ExitOffer) => void
    onDismiss: () => void
}

export const EXIT_OFFERS: Record<string, ExitOffer> = {
    Romantic: { title: 'Early Check-in gratis', desc: 'Entra desde las 10am sin costo adicional. ¡Tu estadía empieza antes!', icon: '🌅', price: 0 },
    Business: { title: '20% OFF en tu reserva', desc: 'Descuento especial válido solo en los próximos 10 minutos.', icon: '💼', price: 0 },
    Family: { title: 'Kids Buffet incluido', desc: 'Desayuno gratis para los niños si reservas en los próximos 10 min.', icon: '🍳', price: 0 },
    Wellness: { title: 'Sesión Spa 30 min gratis', desc: 'Masaje de 30 minutos de regalo si confirmas ahora.', icon: '💆', price: 0 },
    default: { title: 'Early Check-in gratis', desc: 'Entra a tu habitación desde las 10am sin costo adicional.', icon: '✨', price: 0 },
}

export default function ExitIntentModal({ roomName, intent, onAccept, onDismiss }: ExitIntentModalProps) {
    const [countdown, setCountdown] = useState(600) // 10 min
    const offer = EXIT_OFFERS[intent ?? 'default'] ?? EXIT_OFFERS.default

    // Cuenta regresiva
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) { clearInterval(timer); onDismiss(); return 0 }
                return c - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [onDismiss])

    const mins = Math.floor(countdown / 60)
    const secs = countdown % 60

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px',
                animation: 'fadeIn 0.3s ease',
            }}
            onClick={onDismiss}
        >
            <div
                className="glass-card"
                style={{
                    maxWidth: '480px', width: '100%', padding: '40px',
                    textAlign: 'center',
                    border: '1px solid rgba(201, 169, 110, 0.4)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                    animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{offer.icon}</div>

                <div style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    ¡Espera! Oferta exclusiva
                </div>

                <h2 className="font-serif text-gold-gradient" style={{ fontSize: '2rem', fontWeight: '400', marginBottom: '12px' }}>
                    {offer.title}
                </h2>

                {roomName && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--gold-light)', marginBottom: '8px', fontStyle: 'italic' }}>
                        Para: {roomName}
                    </p>
                )}

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                    {offer.desc}
                </p>

                {/* Countdown */}
                <div
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(201, 169, 110, 0.1)',
                        border: '1px solid rgba(201, 169, 110, 0.25)',
                        borderRadius: '8px', padding: '8px 16px', marginBottom: '28px',
                        fontSize: '0.85rem', color: 'var(--gold-light)',
                    }}
                >
                    ⏱ Esta oferta expira en{' '}
                    <strong>{mins}:{secs.toString().padStart(2, '0')}</strong>
                </div>

                <button onClick={() => onAccept(offer)} className="btn-gold w-full" style={{ marginBottom: '12px' }}>
                    Sí, quiero esta oferta
                </button>
                <button
                    onClick={onDismiss}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                    No gracias, continuar sin oferta
                </button>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
        </div>
    )
}
