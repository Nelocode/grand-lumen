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
