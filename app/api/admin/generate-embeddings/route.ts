import { NextRequest, NextResponse } from 'next/server'
import { generateRoomEmbeddings } from '@/lib/embeddings'
import { createClient } from '@/lib/supabase/server'

// POST /api/admin/generate-embeddings — generar embeddings (solo admin)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

        const results = await generateRoomEmbeddings()
        return NextResponse.json({ results, message: 'Embeddings generados exitosamente' })
    } catch (error) {
        console.error('Error generando embeddings:', error)
        return NextResponse.json({ error: 'Error al generar embeddings' }, { status: 500 })
    }
}
