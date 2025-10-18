import { useRef, useCallback, useEffect } from 'react'
import { AnyFunction } from '@codeleap/types'

type UseIntervalHandler = (clear: AnyFunction) => void

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
