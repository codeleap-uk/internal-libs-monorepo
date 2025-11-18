import { useEffect } from 'react'
import { AnyFunction } from '@codeleap/types'

/**
 * Hook that runs a function once when the component mounts.
 *
 * @example
 * onMount(() => {
 *   console.log('Component mounted')
 *   return () => console.log('Component unmounted')
 * })
 */
export const onMount = (func: AnyFunction) => {
  useEffect(() => {
    return func()
  }, [])
}
