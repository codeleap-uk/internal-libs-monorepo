import { useRef } from 'react'
import { useEffectOnce } from './useEffectOnce'

/**
 * Hook that runs a cleanup function when the component unmounts.
 * The function reference is updated on each render to always use the latest version.
 *
 * @example
 * useUnmount(() => {
 *   console.log('Component unmounting')
 *   // Cleanup logic here
 * })
 */
export const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn)

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn

  useEffectOnce(() => () => fnRef.current())
}
