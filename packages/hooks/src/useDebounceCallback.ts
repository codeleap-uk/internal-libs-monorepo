import { useRef, useCallback } from 'react'

export function useDebounceCallback<T extends any[]>(
    callback: (...args: T) => void,
    delay: number = 1000
) {
    const timeoutRef = useRef(null)

    const debounce = useCallback((...args: T) => {
        cancel()

        timeoutRef.current = setTimeout(() => {
            callback(...args)
            timeoutRef.current = null
        }, delay)
    }, [callback])

    const flush = useCallback((...args: T) => {
        cancel()
        callback(...args)
    }, [callback])

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    return {
        debounce,
        flush,
        cancel
    }
}