import { EffectCallback, useEffect } from 'react'

/**
 * Hook that runs an effect only once when the component mounts.
 *
 * @example
 * useEffectOnce(() => {
 *   console.log('Runs only once on mount')
 *   return () => console.log('Cleanup on unmount')
 * })
 */
export const useEffectOnce = (effect: EffectCallback) => {
  useEffect(effect, [])
}
