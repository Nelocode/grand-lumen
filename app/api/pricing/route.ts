import { NextRequest, NextResponse } from 'next/server'
import { calculateDynamicPrice } from '@/lib/revenue'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const basePrice = parseFloat(searchParams.get('base') ?? '0')
        const checkIn = searchParams.get('check_in')
        const checkOut = searchParams.get('check_out')

        if (!basePrice || !checkIn || !checkOut) {
            return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
        }

        // Obtener ocupación actual
        const supabase = await createClient()
        const { data: occupancy } = await supabase.rpc('get_current_occupancy', {
            check_in_date: checkIn,
            check_out_date: checkOut,
        })

        const occupancyRate = occupancy?.occupancy_rate ?? 50
        const result = await calculateDynamicPrice(basePrice, checkIn, checkOut, occupancyRate)
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: 'Error calculando precio' }, { status: 500 })
    }
}
