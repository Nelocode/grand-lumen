import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Endpoint de setup para (re)generar embeddings con OpenAI
export async function POST(request: NextRequest) {
    const { setupKey } = await request.json().catch(() => ({}))

    if (setupKey !== 'grand-lumen-setup-2025') {
        return NextResponse.json({ error: 'Clave de setup inválida' }, { status: 401 })
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            // Service role key bypasea RLS — necesario para guardar embeddings
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

        const { data: rooms, error } = await supabase
            .from('rooms')
            .select('id, name, description, tags, amenities, intent_profile')

        if (error || !rooms) throw error || new Error('No rooms found')

        const results = []
        for (const room of rooms) {
            const embeddingText = [
                room.name,
                room.description,
                `Tags: ${room.tags.join(', ')}`,
                `Amenities: ${room.amenities.join(', ')}`,
                `Perfect for: ${room.intent_profile.join(', ')}`,
            ].join('. ')

            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: embeddingText,
                dimensions: 768,
            })

            const embedding = response.data[0].embedding

            const { error: updateError } = await supabase
                .from('rooms')
                .update({ embedding: JSON.stringify(embedding) })
                .eq('id', room.id)

            results.push({
                id: room.id,
                name: room.name,
                success: !updateError,
                error: updateError?.message,
            })

            // Pequeña pausa para no saturar la API
            await new Promise((resolve) => setTimeout(resolve, 200))
        }

        const successful = results.filter((r) => r.success).length
        return NextResponse.json({
            message: `Embeddings OpenAI generados: ${successful}/${rooms.length}`,
            model: 'text-embedding-3-small (768 dims)',
            results,
        })
    } catch (error: any) {
        console.error('Error generando embeddings:', error)
        return NextResponse.json({ error: error.message ?? 'Error desconocido' }, { status: 500 })
    }
}
