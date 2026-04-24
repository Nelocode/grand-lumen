'use client'

import NaturalSearchBar from '@/components/NaturalSearchBar'
import { Star, MapPin, Award, Wifi } from 'lucide-react'

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--obsidian)' }}>
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 10, 11, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201, 169, 110, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4rem', color: 'var(--gold)', fontWeight: '300' }}>✦</span>
          <div>
            <div
              className="font-serif text-gold-gradient"
              style={{ fontSize: '1.2rem', fontWeight: '400', letterSpacing: '0.06em' }}
            >
              Grand Lumen
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Hotel & Spa · El Poblado
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Habitaciones', 'Experiencias', 'Gastronomía', 'Contacto'].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {item}
            </a>
          ))}
          <a href="/admin" style={{ textDecoration: 'none' }}>
            <button className="btn-outline-gold" style={{ fontSize: '0.75rem', padding: '8px 20px' }}>
              Administrar
            </button>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="hero-gradient"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Círculos decorativos de fondo */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(139,105,20,0.05) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Rating */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(201, 169, 110, 0.08)',
            border: '1px solid rgba(201, 169, 110, 0.2)',
            borderRadius: '20px',
            padding: '6px 16px',
            marginBottom: '32px',
            fontSize: '0.75rem',
            color: 'var(--gold-light)',
            letterSpacing: '0.1em',
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} fill="currentColor" />
          ))}
          <span style={{ marginLeft: '4px' }}>5 Estrellas · El Poblado, Medellín</span>
        </div>

        {/* Headline principal */}
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '300',
            lineHeight: 1.1,
            marginBottom: '20px',
            maxWidth: '800px',
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>Dinos qué buscas.</span>
          <br />
          <span className="text-gold-gradient">La IA encuentra tu lugar.</span>
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: '540px',
            marginBottom: '48px',
            lineHeight: 1.7,
          }}
        >
          Sin formularios. Sin filtros aburridos. Cuéntanos en tus propias palabras
          qué necesitas y nuestro concierge de IA encontrará la habitación perfecta para ti.
        </p>

        {/* Barra de búsqueda */}
        <NaturalSearchBar />

        {/* Características */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '56px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { icon: '🤖', label: 'IA Conversacional' },
            { icon: '💰', label: 'Precio Justo en Tiempo Real' },
            { icon: '🎁', label: 'Upselling Personalizado' },
            { icon: '⭐', label: '12 Suites de Lujo' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Sección "Cómo funciona" */}
      <section style={{ padding: '100px 24px', background: 'var(--charcoal)' }}>
        <div className="container-hotel">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="font-serif text-gold-gradient" style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '12px' }}>
              Así de simple
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Tres pasos para la habitación perfecta
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              {
                step: '01',
                title: 'Cuéntanos qué buscas',
                desc: 'Escribe en lenguaje natural. "Quiero algo romántico este fin de semana" es todo lo que necesitamos.',
                icon: '💬',
              },
              {
                step: '02',
                title: 'La IA analiza y recomienda',
                desc: 'Gemini AI extrae tus preferencias, busca por semántica y aplica precios justos en tiempo real.',
                icon: '🧠',
              },
              {
                step: '03',
                title: 'Reserva en segundos',
                desc: 'Elige tu favorita, personaliza con extras a tu medida y confirma tu reserva instantáneamente.',
                icon: '✨',
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{icon}</div>
                <div
                  style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.2em', marginBottom: '8px' }}
                >
                  PASO {step}
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.3rem', fontWeight: '400', marginBottom: '12px', color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer mínimo */}
      <footer
        style={{
          padding: '40px 24px',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
        }}
      >
        <div className="font-serif text-gold-gradient" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
          Grand Lumen Hotel
        </div>
        <p>El Poblado, Medellín, Colombia · ©2025 · Powered by AI</p>
      </footer>
    </main>
  )
}
