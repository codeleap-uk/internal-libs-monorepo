import { useRef } from 'react'
import { AnyFunction } from '@codeleap/types'

export function useInterval(callback: AnyFunction, interval: number) {
  const intervalRef = useRef(null)

  function clear() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  function start() {
    intervalRef.current = setInterval(callback, interval)
  }

  return {
    clear,
    start,
    interval: intervalRef.current,
  }
}
