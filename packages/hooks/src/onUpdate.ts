import { useEffect } from 'react'
import { AnyFunction } from '@codeleap/types'

/**
 * Hook that runs a function when specified dependencies change.
 *
 * @example
 * onUpdate(() => {
 *   console.log('Count changed:', count)
 * }, [count])
 */
export const onUpdate = (func: AnyFunction, listeners = []) => {
  useEffect(() => {
    return func()
  }, listeners)
}
