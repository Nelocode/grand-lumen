'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import RoomCard from '@/components/RoomCard'
import NaturalSearchBar from '@/components/NaturalSearchBar'
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'
import { RoomWithSimilarity, DynamicPriceResult, SearchParams } from '@/lib/types'

interface SearchResult {
    rooms: (RoomWithSimilarity & { dynamic_price?: DynamicPriceResult })[]
    search_params: SearchParams
    query: string
}

function SearchResults() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const query = searchParams.get('q') ?? ''

    const [results, setResults] = useState<SearchResult | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!query) {
            router.push('/')
            return
        }

        const fetchResults = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const res = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query }),
                })
                if (!res.ok) throw new Error('Error al buscar habitaciones')
                const data = await res.json()
                setResults(data)
            } catch (err) {
                setError('No pudimos procesar tu búsqueda. Por favor intenta de nuevo.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [query])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--obsidian)' }}>
            {/* Header */}
            <header style={{
                padding: '20px 40px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                background: 'rgba(10,10,11,0.9)',
                backdropFilter: 'blur(20px)',
                position: 'sticky',
                top: 0,
                zIndex: 40,
            }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <ArrowLeft size={16} /> Inicio
                </Link>
                <div style={{ flex: 1, maxWidth: '600px' }}>
                    <NaturalSearchBar />
                </div>
                <Link href="/admin" style={{ textDecoration: 'none' }}>
                    <div className="font-serif text-gold-gradient" style={{ fontSize: '1rem' }}>✦ Grand Lumen</div>
                </Link>
            </header>

            <div className="container-hotel" style={{ padding: '48px 24px' }}>
                {/* Búsqueda original */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Sparkles size={16} style={{ color: 'var(--gold)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Búsqueda con IA
                        </span>
                    </div>
                    <h1 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: '300', color: 'var(--text-primary)' }}>
                        "{query}"
                    </h1>
                    {results?.search_params && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                            {results.search_params.check_in && (
                                <span className="price-badge">
                                    📅 {new Date(results.search_params.check_in + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                                    {results.search_params.check_out && ` → ${new Date(results.search_params.check_out + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}`}
                                </span>
                            )}
                            {results.search_params.guests > 1 && (
                                <span className="price-badge">👥 {results.search_params.guests} huéspedes</span>
                            )}
                            {results.search_params.intent && (
                                <span className="price-badge">✦ Perfil: {results.search_params.intent}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Estado de carga */}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: '48px', height: '48px',
                            border: '2px solid var(--border)',
                            borderTopColor: 'var(--gold)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px',
                        }} />
                        <p className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            La IA está buscando la habitación perfecta para ti...
                        </p>
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <div className="glass-card" style={{ padding: '32px', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        <AlertCircle size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-gold" style={{ marginTop: '20px' }}>
                            Intentar de nuevo
                        </button>
                    </div>
                )}

                {/* Resultados */}
                {results && !isLoading && (
                    <>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
                            {results.rooms?.length ?? 0} habitaciones recomendadas · Precios ajustados en tiempo real
                        </p>
                        <div className="rooms-grid">
                            {results.rooms?.map((room, index) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    searchParams={results.search_params}
                                    rank={index + 1}
                                />
                            ))}
                        </div>
                        {(!results.rooms || results.rooms.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                                <p className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--text-secondary)' }}>
                                    No encontramos habitaciones exactas, pero quizás te interese...
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: 'var(--obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Cargando...</div>
            </div>
        }>
            <SearchResults />
        </Suspense>
    )
}
