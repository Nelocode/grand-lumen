import { Room, RoomWithSimilarity } from './types'
import { generateEmbedding } from './gemini'
import { createClient } from './supabase/server'

/**
 * Busca habitaciones por similitud semántica usando pgvector.
 * Si pgvector devuelve 0 resultados (embeddings sin datos), hace
 * fallback inteligente filtrando por intent_profile.
 */
export async function searchRoomsByEmbedding(
    queryText: string,
    matchCount: number = 3,
    similarityThreshold: number = 0.1,
    intent?: string
): Promise<RoomWithSimilarity[]> {
    const supabase = await createClient()

    // Intentar búsqueda vectorial primero
    try {
        const queryEmbedding = await generateEmbedding(queryText)

        const { data, error } = await supabase.rpc('search_rooms_by_embedding', {
            query_embedding: JSON.stringify(queryEmbedding),
            similarity_threshold: similarityThreshold,
            match_count: matchCount,
        })

        if (!error && data && data.length > 0) {
            return data as RoomWithSimilarity[]
        }
    } catch (err) {
        console.warn('pgvector search failed, using intent fallback:', err)
    }

    // Fallback inteligente: buscar por intent_profile o devolver top rooms
    console.log(`[Search] pgvector returned 0 results. Fallback by intent: ${intent}`)

    let query = supabase
        .from('rooms')
        .select('*')
        .eq('is_available', true)

    // Si hay intent, filtrar por perfil
    if (intent) {
        query = query.contains('intent_profile', [intent])
    }

    const { data: fallback, error: fallbackError } = await query.limit(matchCount)

    // Si el filtro de intent tampoco devuelve nada, devolver cualquier habitación
    if (fallbackError || !fallback || fallback.length === 0) {
        const { data: any } = await supabase
            .from('rooms')
            .select('*')
            .eq('is_available', true)
            .limit(matchCount)
        return (any as Room[])?.map((r) => ({ ...r, similarity: 0.6 })) ?? []
    }

    return (fallback as Room[]).map((r) => ({ ...r, similarity: 0.7 }))
}

/**
 * Genera embeddings para todas las habitaciones en la base de datos.
 * Útil para inicializar la búsqueda semántica.
 */
export async function generateRoomEmbeddings() {
    const supabase = await createClient()
    const { data: rooms, error } = await supabase.from('rooms').select('*')
    if (error || !rooms) throw new Error('Error fetching rooms for embeddings')

    const results = []
    for (const room of rooms) {
        try {
            // Enriquecemos el texto combinando campos clave para un mejor embedding
            const textToEmbed = `
                Room: ${room.name}
                Description: ${room.description}
                Short: ${room.short_description}
                Profiles: ${room.intent_profile?.join(', ') || ''}
                Amenities: ${room.amenities?.join(', ') || ''}
                Tags: ${room.tags?.join(', ') || ''}
            `.trim().slice(0, 1500)

            const embedding = await generateEmbedding(textToEmbed)

            const { error: updateError } = await supabase
                .from('rooms')
                .update({ embedding: JSON.stringify(embedding) })
                .eq('id', room.id)

            results.push({
                room: room.name,
                success: !updateError,
                error: updateError ? updateError.message : null
            })
        } catch (err) {
            results.push({
                room: room.name,
                success: false,
                error: (err as Error).message
            })
        }
    }

    return results
}
