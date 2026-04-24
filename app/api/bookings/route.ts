import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

// Cliente admin con service role key — bypasea RLS para escrituras públicas
function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// GET /api/bookings — listar (requiere auth de admin)
export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const limit = parseInt(searchParams.get('limit') ?? '50')

        // Para lectura de admin usamos el cliente con auth
        const admin = getAdminClient()
        let query = admin
            .from('bookings')
            .select('*, room:rooms(id, name, slug)')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (status) query = query.eq('status', status)

        const { data, error } = await query
        if (error) throw error

        return NextResponse.json({ bookings: data })
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
    }
}

// POST /api/bookings — crear reserva (público, sin auth de usuario)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            room_id, customer_name, customer_email, customer_phone,
            check_in, check_out, guests, intent_profile, search_query,
            base_price, final_price, price_multipliers, upsells, upsells_total, notes,
        } = body

        // Validaciones básicas
        if (!room_id || !customer_name || !customer_email || !check_in || !check_out) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
        }

        // Usamos el admin client (service role) para bypasar RLS en bookings
        const admin = getAdminClient()

        // Verificar disponibilidad
        const { data: conflicting } = await admin
            .from('bookings')
            .select('id')
            .eq('room_id', room_id)
            .in('status', ['Confirmed', 'Pending'])
            .lt('check_in', check_out)
            .gt('check_out', check_in)
            .limit(1)

        if (conflicting && conflicting.length > 0) {
            return NextResponse.json(
                { error: 'La habitación no está disponible en esas fechas' },
                { status: 409 }
            )
        }

        const { data, error } = await admin
            .from('bookings')
            .insert({
                room_id,
                customer_name,
                customer_email,
                customer_phone: customer_phone || null,
                check_in,
                check_out,
                guests: guests ?? 2,
                intent_profile,
                search_query,
                status: 'Pending',
                base_price,
                final_price,
                price_multipliers: price_multipliers ?? [],
                upsells: upsells ?? [],
                upsells_total: upsells_total ?? 0,
                notes: notes || null,
            })
            .select('*, room:rooms(name)')
            .single()

        if (error) throw error

        return NextResponse.json({ booking: data }, { status: 201 })
    } catch (error) {
        console.error('Error al crear reserva:', error)
        return NextResponse.json({ error: 'Error al crear la reserva' }, { status: 500 })
    }
}
