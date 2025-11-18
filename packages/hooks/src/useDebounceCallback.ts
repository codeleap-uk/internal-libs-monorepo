import { useRef, useCallback } from 'react'

/**
 * Hook that creates debounced, flush, and cancel functions for a callback.
 *
 * @example
 * const { debounce, flush, cancel } = useDebounceCallback((value) => {
 *   console.log(value)
 * }, 500)
 *
 * debounce('hello') // Will call callback after 500ms
 * flush('immediate') // Calls callback immediately
 * cancel() // Cancels pending debounced call
 */
export function useDebounceCallback<T extends any[]>(
  callback: (...args: T) => void,
  delay = 1000,
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
    cancel,
  }
}
