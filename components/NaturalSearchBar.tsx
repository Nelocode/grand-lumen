'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Sparkles, Mic } from 'lucide-react'

const PLACEHOLDER_HINTS = [
    'Quiero algo romántico para este fin de semana, somos 2...',
    'Necesito una habitación tranquila para trabajar 3 noches...',
    'Buscamos algo familiar con piscina para Semana Santa...',
    'Suite de lujo para nuestra luna de miel la próxima semana...',
    'Habitación con buena vista para el fin de semana largo...',
]

export default function NaturalSearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [placeholder, setPlaceholder] = useState(PLACEHOLDER_HINTS[0])
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Rotar placeholders cada 3.5 segundos
    useEffect(() => {
        if (isTyping) return
        const interval = setInterval(() => {
            setPlaceholderIndex((i) => {
                const next = (i + 1) % PLACEHOLDER_HINTS.length
                setPlaceholder(PLACEHOLDER_HINTS[next])
                return next
            })
        }, 3500)
        return () => clearInterval(interval)
    }, [isTyping])

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
        }
    }, [query])

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault()
        const trimmed = query.trim()
        if (!trimmed || isLoading) return
        setIsLoading(true)
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSearch()
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div
                className="relative"
                style={{
                    background: 'rgba(20, 20, 22, 0.9)',
                    border: isTyping
                        ? '1px solid rgba(201, 169, 110, 0.6)'
                        : '1px solid rgba(201, 169, 110, 0.25)',
                    borderRadius: '16px',
                    boxShadow: isTyping
                        ? '0 0 0 4px rgba(201, 169, 110, 0.08), 0 20px 60px rgba(0,0,0,0.5)'
                        : '0 20px 60px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Ícono IA */}
                <div
                    className="absolute left-5 top-5 flex items-center gap-1"
                    style={{ color: 'var(--gold)', opacity: 0.8 }}
                >
                    <Sparkles size={18} />
                </div>

                {/* Textarea */}
                <textarea
                    ref={inputRef}
                    id="search-query"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsTyping(e.target.value.length > 0)
                    }}
                    onFocus={() => setIsTyping(query.length > 0 || true)}
                    onBlur={() => !query && setIsTyping(false)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        padding: '18px 60px 18px 48px',
                        color: 'var(--text-primary)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        resize: 'none',
                        minHeight: '60px',
                        maxHeight: '160px',
                        overflowY: 'auto',
                    }}
                />

                {/* Botón buscar */}
                <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="absolute right-4 bottom-4"
                    style={{
                        background:
                            query.trim() && !isLoading
                                ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)'
                                : 'rgba(201, 169, 110, 0.2)',
                        border: 'none',
                        borderRadius: '10px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: query.trim() && !isLoading ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        color: query.trim() ? 'var(--obsidian)' : 'var(--text-muted)',
                    }}
                    aria-label="Buscar habitación"
                >
                    {isLoading ? (
                        <div
                            style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid var(--gold-dark)',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                            }}
                        />
                    ) : (
                        <Search size={16} />
                    )}
                </button>
            </div>

            {/* Sugerencias rápidas */}
            {!isTyping && (
                <div
                    className="flex flex-wrap gap-2 mt-4 justify-center"
                    style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}
                >
                    {['🌙 Noche romántica', '💼 Viaje de negocios', '👨‍👩‍👧 Familia', '🧘 Bienestar'].map((hint) => (
                        <button
                            key={hint}
                            type="button"
                            onClick={() => {
                                const text = hint.split(' ').slice(1).join(' ')
                                setQuery(text)
                                setIsTyping(true)
                                inputRef.current?.focus()
                            }}
                            style={{
                                background: 'rgba(201, 169, 110, 0.08)',
                                border: '1px solid rgba(201, 169, 110, 0.2)',
                                borderRadius: '20px',
                                padding: '6px 14px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.8rem',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(201, 169, 110, 0.15)'
                                e.currentTarget.style.color = 'var(--gold-light)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(201, 169, 110, 0.08)'
                                e.currentTarget.style.color = 'var(--text-secondary)'
                            }}
                        >
                            {hint}
                        </button>
                    ))}
                </div>
            )}

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </form>
    )
}
