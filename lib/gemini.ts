import OpenAI from 'openai'

let _openai: OpenAI | null = null
function getOpenAI() {
    if (!_openai) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('Missing OPENAI_API_KEY')
        }
        _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }
    return _openai
}


/**
 * Genera un embedding vectorial de 768 dimensiones con text-embedding-3-small
 * Usamos dimensions:768 para mantener compatibilidad con el schema de pgvector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await getOpenAI().embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 768,
    })
    return response.data[0].embedding
}

/**
 * Parsea una búsqueda en lenguaje natural y extrae parámetros estructurados
 */
export async function parseNaturalSearch(query: string): Promise<{
    check_in: string | null
    check_out: string | null
    guests: number
    intent: string
    preferences: string[]
    search_embedding_text: string
}> {
    const today = new Date().toISOString().split('T')[0]

    const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `Eres el asistente de reservas del Grand Lumen Hotel en Medellín, Colombia. Hoy es ${today}.
Analiza la búsqueda del huésped y responde ÚNICAMENTE con JSON válido con esta estructura:
{
  "check_in": "YYYY-MM-DD o null",
  "check_out": "YYYY-MM-DD o null",
  "guests": número (default 2),
  "intent": "Romantic|Business|Family|Wellness|Luxury|Solo|Group|Nature",
  "preferences": ["array de preferencias, máx 5"],
  "search_embedding_text": "texto enriquecido en inglés para búsqueda semántica, máx 2 oraciones"
}
Para fechas relativas: "fin de semana" = próximo sábado-domingo, "esta semana" = próximos 7 días.`,
            },
            { role: 'user', content: query },
        ],
    })

    const text = completion.choices[0].message.content ?? '{}'
    return JSON.parse(text)
}

/**
 * Genera un razonamiento personalizado para recomendar una habitación
 */
export async function generateRoomReasoning(
    roomName: string,
    roomDescription: string,
    userQuery: string,
    userIntent: string
): Promise<string> {
    const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 80,
        messages: [
            {
                role: 'system',
                content: `Eres el concierge del Grand Lumen Hotel en Medellín. Escribe UNA sola oración de 15-25 palabras en español que explique por qué la habitación es perfecta para ESTE huésped específicamente. Sé cálido y personal. No empieces con "La elegimos".`,
            },
            {
                role: 'user',
                content: `El huésped buscó: "${userQuery}"\nIntención: ${userIntent}\nHabitación: ${roomName}\nDescripción: ${roomDescription.slice(0, 200)}`,
            },
        ],
    })

    return completion.choices[0].message.content?.trim().replace(/^[\"']|[\"']$/g, '') ?? ''
}
