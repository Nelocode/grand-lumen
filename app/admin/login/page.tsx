'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })
        if (error) {
            toast.error('Credenciales incorrectas. Verifica tu correo y contraseña.')
            setIsLoading(false)
            return
        }
        router.push('/admin')
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--obsidian)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '48px 40px', textAlign: 'center' }}>
                <div className="font-serif text-gold-gradient" style={{ fontSize: '1.8rem', fontWeight: '300', marginBottom: '4px' }}>
                    ✦ Grand Lumen
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '40px' }}>
                    Panel de Administración
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            className="input-premium"
                            id="admin-email"
                            placeholder="admin@grandlumen.com"
                            style={{ padding: '12px 16px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '32px', textAlign: 'left', position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Contraseña
                        </label>
                        <input
                            type={showPass ? 'text' : 'password'}
                            required
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            className="input-premium"
                            id="admin-password"
                            style={{ padding: '12px 40px 12px 16px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass((v) => !v)}
                            style={{
                                position: 'absolute', right: '12px', bottom: '12px',
                                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                            }}
                        >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button type="submit" className="btn-gold w-full" disabled={isLoading} style={{ padding: '14px' }}>
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                Ingresando...
                            </span>
                        ) : 'Ingresar al panel'}
                    </button>
                </form>

                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        </div>
    )
}
