import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'Grand Lumen Hotel — El Poblado, Medellín',
    template: '%s | Grand Lumen Hotel',
  },
  description:
    'Hotel de lujo 5 estrellas en El Poblado, Medellín. Reserva tu estadía perfecta con nuestra IA que entiende lo que realmente buscas.',
  keywords: ['hotel medellín', 'hotel el poblado', 'hotel lujo colombia', 'grand lumen'],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Grand Lumen Hotel',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(20, 20, 22, 0.95)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              color: '#FAFAFA',
            },
          }}
        />
      </body>
    </html>
  )
}
