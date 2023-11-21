import { useEffect, useRef } from 'react'

export const useUpdateEffect = (effect, dependencies) => {
    const isMountedRef = useRef(true)

    useEffect(() => {
        if (isMountedRef.current) {
            isMountedRef.current = false
            return
        }

        return effect()
    }, dependencies)
}