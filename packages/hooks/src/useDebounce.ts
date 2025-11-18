import { useEffect, useRef, useState } from 'react'

/**
 * Hook that debounces a value, updating it after a specified delay.
 *
 * @example
 * const [debouncedSearch, resetDebounce] = useDebounce(searchTerm, 500)
 * // debouncedSearch updates 500ms after searchTerm stops changing
 */
export function useDebounce<T>(
  value: T,
  debounce: number,
): [T, () => void] {
  const [debouncedValue, setDebouncedValue] = useState(value)

  const timeoutRef = useRef(null)

  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, debounce)

    return reset
  }, [value])

  return [debouncedValue, reset]
}
