import { useRef, useCallback, useEffect } from 'react'
import { AnyFunction } from '@codeleap/types'

type UseIntervalHandler = (clear: AnyFunction) => void

/**
 * Hook that manages an interval with start and clear controls.
 * The handler receives a clear function to stop the interval from within.
 *
 * @example
 * const { start, clear } = useInterval((clearFn) => {
 *   console.log('Tick')
 *   if (shouldStop) clearFn()
 * }, 1000)
 *
 * start() // Starts the interval
 * clear() // Stops the interval
 */
export function useInterval(handler: UseIntervalHandler, interval: number) {
  const intervalRef = useRef<NodeJS.Timer | null>(null)
  const handlerRef = useRef<UseIntervalHandler>(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  const clear = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    clear()

    if (intervalRef.current == null) {
      intervalRef.current = setInterval(() => {
        handlerRef.current(clear)
      }, interval)
    }
  }, [])

  useEffect(() => {
    return () => {
      clear()
    }
  }, [clear])

  return {
    clear,
    start,
    interval: intervalRef.current,
  }
}
