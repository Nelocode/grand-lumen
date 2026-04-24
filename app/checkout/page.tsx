'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Room, UpsellOffer, DynamicPriceResult } from '@/lib/types'
import { useExitIntent } from '@/hooks/useExitIntent'
import ExitIntentModal, { ExitOffer } from '@/components/ExitIntentModal'
import { createClient } from '@/lib/supabase/client'

function formatCOP(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)
}

function CheckoutContent() {
    const params = useSearchParams()
    const router = useRouter()

    const roomSlug = params.get('room')
    const checkIn = params.get('check_in')
    const checkOut = params.get('check_out')
    const guests = parseInt(params.get('guests') ?? '2')
    const intent = params.get('intent') ?? 'default'
    const [dynamicPrice, setDynamicPrice] = useState<DynamicPriceResult | null>(null)

    const [room, setRoom] = useState<Room | null>(null)
    const [upsells, setUpsells] = useState<UpsellOffer[]>([])
    const [selectedUpsells, setSelectedUpsells] = useState<string[]>([])
    const [showExitModal, setShowExitModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })

    const [exitOffer, setExitOffer] = useState<ExitOffer | null>(null)

    useExitIntent({ onExit: () => setShowExitModal(true), delay: 4000 })

    useEffect(() => {
        const loadData = async () => {
            if (!roomSlug) { router.push('/'); return }
            const supabase = createClient()
            // Cargar habitación
            const { data: roomData } = await supabase.from('rooms').select('*').eq('slug', roomSlug).single()
            if (!roomData) { router.push('/'); return }
            setRoom(roomData as Room)

            // Calcular precio dinámico
            if (checkIn && checkOut) {
                const res = await fetch(`/api/pricing?base=${roomData.base_price}&check_in=${checkIn}&check_out=${checkOut}`)
                if (res.ok) setDynamicPrice(await res.json())
            }

            // Cargar upsells por intent
            const { data: upsellData } = await supabase
                .from('upsell_offers')
                .select('*')
                .eq('is_active', true)
                .contains('target_intents', [intent])
                .limit(4)
            setUpsells((upsellData ?? []) as UpsellOffer[])
            setIsLoading(false)
        }
        loadData()
    }, [roomSlug, checkIn, checkOut, intent, router])

    const upsellTotal = upsells
        .filter((u) => selectedUpsells.includes(u.id))
        .reduce((sum, u) => sum + u.price, 0)

    const nightlyPrice = dynamicPrice?.final_price ?? room?.base_price ?? 0
    const nights = dynamicPrice?.nights ?? 1
    const subtotal = nightlyPrice * nights
    // El exitOffer siempre tiene precio 0 (es gratis) pero lo sumamos por claridad
    const exitOfferTotal = exitOffer?.price ?? 0
    const grandTotal = subtotal + upsellTotal + exitOfferTotal

    const toggleUpsell = (id: string) =>
        setSelectedUpsells((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!room || !form.name || !form.email) {
            toast.error('Completa tu nombre y correo')
            return
        }
        setIsSubmitting(true)
        try {
            const selectedOffers = upsells
                .filter((u) => selectedUpsells.includes(u.id))
                .map((u) => ({ offer_id: u.id, title: u.title, price: u.price }))

            // Si hay oferta del exit intent modal, añadirla como upsell especial
            if (exitOffer) {
                selectedOffers.push({
                    offer_id: 'exit-intent-offer',
                    title: exitOffer.title,
                    price: 0,
                })
            }

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    room_id: room.id,
                    customer_name: form.name,
                    customer_email: form.email,
                    customer_phone: form.phone || null,
                    check_in: checkIn,
                    check_out: checkOut,
                    guests,
                    intent_profile: intent,
                    base_price: room.base_price,
                    final_price: nightlyPrice,
                    price_multipliers: dynamicPrice?.multipliers ?? [],
                    upsells: selectedOffers,
                    upsells_total: upsellTotal,
                    notes: form.notes || null,
                }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? 'Error al reservar')
            }
            const { booking } = await res.json()
            router.push(`/confirmation?id=${booking.id}`)
        } catch (err: any) {
            toast.error(err.message ?? 'Ocurrió un error al procesar tu reserva')
            setIsSubmitting(false)
        }
    }

    if (isLoading) return (
        <div style={{ minHeight: '100vh', background: 'var(--obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={32} style={{ color: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: 'var(--obsidian)', padding: '40px 24px' }}>
            {showExitModal && (
                <ExitIntentModal
                    roomName={room?.name}
                    intent={intent}
                    onAccept={(offer: ExitOffer) => {
                        setExitOffer(offer)
                        setShowExitModal(false)
                        toast.success(`🎁 ¡${offer.title} añadido a tu reserva!`, { duration: 5000 })
                    }}
                    onDismiss={() => setShowExitModal(false)}
                />
            )}

            <div className="container-hotel" style={{ maxWidth: '900px' }}>
                <Link href={`/rooms/${roomSlug}`} style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '32px' }}>
                    <ArrowLeft size={14} /> Volver a la habitación
                </Link>

                <h1 className="font-serif text-gold-gradient" style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '32px' }}>
                    Confirma tu reserva
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '20px', color: 'var(--text-primary)' }}>
                                Tus datos
                            </h2>
                            {[
                                { key: 'name', label: 'Nombre completo *', type: 'text', required: true },
                                { key: 'email', label: 'Correo electrónico *', type: 'email', required: true },
                                { key: 'phone', label: 'Teléfono (opcional)', type: 'tel', required: false },
                            ].map(({ key, label, type, required }) => (
                                <div key={key} style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        required={required}
                                        value={(form as any)[key]}
                                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                        className="input-premium"
                                        style={{ padding: '12px 16px' }}
                                    />
                                </div>
                            ))}
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Notas especiales
                            </label>
                            <textarea
                                value={form.notes}
                                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                className="input-premium"
                                rows={3}
                                style={{ resize: 'none' }}
                                placeholder="Alergias, preferencias, ocasiones especiales..."
                            />
                        </div>

                        {/* Upsells */}
                        {upsells.length > 0 && (
                            <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>
                                    Mejora tu experiencia
                                </h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                    Seleccionados especialmente para ti
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {upsells.map((offer) => {
                                        const selected = selectedUpsells.includes(offer.id)
                                        return (
                                            <button
                                                key={offer.id}
                                                type="button"
                                                onClick={() => toggleUpsell(offer.id)}
                                                style={{
                                                    background: selected ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.03)',
                                                    border: selected ? '1px solid rgba(201,169,110,0.5)' : '1px solid var(--border)',
                                                    borderRadius: '12px',
                                                    padding: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'left',
                                                    width: '100%',
                                                }}
                                            >
                                                <span style={{ fontSize: '1.5rem' }}>{offer.icon}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '500', color: selected ? 'var(--gold-light)' : 'var(--text-primary)', marginBottom: '2px' }}>
                                                        {offer.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                                        {offer.description}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: selected ? 'var(--gold)' : 'var(--text-secondary)' }}>
                                                        +{formatCOP(offer.price)}
                                                    </div>
                                                    {selected && <CheckCircle size={14} style={{ color: 'var(--gold)', marginTop: '4px' }} />}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn-gold w-full" disabled={isSubmitting} style={{ fontSize: '0.95rem', padding: '16px' }}>
                            {isSubmitting ? 'Procesando...' : `Confirmar reserva · ${formatCOP(grandTotal)}`}
                        </button>
                    </form>

                    {/* Resumen */}
                    <div>
                        <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '20px' }}>
                            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                                Resumen
                            </h3>
                            {room && (
                                <>
                                    <h4 className="font-serif text-gold-gradient" style={{ fontSize: '1.2rem', fontWeight: '400', marginBottom: '12px' }}>
                                        {room.name}
                                    </h4>
                                    <div className="gold-divider" style={{ marginBottom: '16px' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                                        {checkIn && checkOut && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                                    <span>Check-in</span>
                                                    <span>{new Date(checkIn + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                                    <span>Check-out</span>
                                                    <span>{new Date(checkOut + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                                </div>
                                            </>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                            <span>Huéspedes</span><span>{guests}</span>
                                        </div>
                                        <div className="gold-divider" />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                            <span>{nights} noche{nights > 1 ? 's' : ''} × {formatCOP(nightlyPrice)}</span>
                                            <span>{formatCOP(subtotal)}</span>
                                        </div>
                                        {dynamicPrice?.multipliers.map((m) => (
                                            <div key={m.reason} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                                <span className="price-badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{m.description.split('·')[0].trim()}</span>
                                            </div>
                                        ))}
                                        {exitOffer && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontSize: '0.82rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span>{exitOffer.icon}</span>
                                                    {exitOffer.title}
                                                </span>
                                                <span style={{ fontWeight: '600' }}>¡GRATIS!</span>
                                            </div>
                                        )}
                                        {selectedUpsells.length > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                                <span>Extras</span><span>+{formatCOP(upsellTotal)}</span>
                                            </div>
                                        )}
                                        <div className="gold-divider" />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                                            <span>Total</span><span style={{ color: 'var(--gold)' }}>{formatCOP(grandTotal)}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--obsidian)' }} />}>
            <CheckoutContent />
        </Suspense>
    )
}
