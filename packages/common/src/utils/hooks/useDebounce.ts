import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'

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
