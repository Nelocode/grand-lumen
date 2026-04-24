import { NextRequest, NextResponse } from 'next/server'
import { parseNaturalSearch, generateRoomReasoning } from '@/lib/gemini'
import { searchRoomsByEmbedding } from '@/lib/embeddings'
import { calculateDynamicPrice } from '@/lib/revenue'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json()
        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Query requerido' }, { status: 400 })
        }

        // 1. Parsear búsqueda con Gemini
        const searchParams = await parseNaturalSearch(query)

        // 2. Buscar habitaciones por similitud semántica (con fallback por intent)
        const rooms = await searchRoomsByEmbedding(
            searchParams.search_embedding_text || query,
            3,
            0.1,
            searchParams.intent ?? undefined
        )

        // 3. Obtener ocupación actual de Supabase
        const supabase = await createClient()
        let occupancyRate = 50
        if (searchParams.check_in && searchParams.check_out) {
            const { data: occupancy } = await supabase.rpc('get_current_occupancy', {
                check_in_date: searchParams.check_in,
                check_out_date: searchParams.check_out,
            })
            occupancyRate = occupancy?.occupancy_rate ?? 50
        }

        // 4. Para cada habitación: calcular precio dinámico + razonamiento AI
        const enrichedRooms = await Promise.all(
            rooms.map(async (room) => {
                const [dynamicPrice, reasoning] = await Promise.all([
                    searchParams.check_in && searchParams.check_out
                        ? calculateDynamicPrice(
                            room.base_price,
                            searchParams.check_in,
                            searchParams.check_out,
                            occupancyRate
                        )
                        : Promise.resolve({
                            base_price: room.base_price,
                            final_price: room.base_price,
                            multipliers: [],
                            nights: 1,
                            total: room.base_price,
                        }),
                    generateRoomReasoning(room.name, room.description, query, searchParams.intent),
                ])

                return {
                    ...room,
                    dynamic_price: dynamicPrice,
                    ai_reasoning: reasoning,
                }
            })
        )

        return NextResponse.json({
            rooms: enrichedRooms,
            search_params: searchParams,
            query,
        })
    } catch (error) {
        console.error('Error en búsqueda semántica:', error)
        return NextResponse.json(
            { error: 'Error al procesar la búsqueda' },
            { status: 500 }
        )
    }
}
