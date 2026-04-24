'use client'

import { useEffect, useCallback, useRef } from 'react'

interface UseExitIntentOptions {
    onExit: () => void
    delay?: number      // ms antes de activar
    threshold?: number  // px desde el top del viewport
}

export function useExitIntent({ onExit, delay = 3000, threshold = 20 }: UseExitIntentOptions) {
    const triggered = useRef(false)
    const activateAfter = useRef(Date.now() + delay)

    const handleMouseLeave = useCallback(
        (e: MouseEvent) => {
            // Solo triggear si el cursor sale por arriba, después del delay, y una sola vez
            if (
                !triggered.current &&
                Date.now() >= activateAfter.current &&
                e.clientY < threshold
            ) {
                triggered.current = true
                onExit()
            }
        },
        [onExit, threshold]
    )

    useEffect(() => {
        document.addEventListener('mouseleave', handleMouseLeave)
        return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, [handleMouseLeave])

    // Reset para nuevas sesiones
    const reset = useCallback(() => {
        triggered.current = false
        activateAfter.current = Date.now() + delay
    }, [delay])

    return { reset }
}
