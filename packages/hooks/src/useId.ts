import { useRef, useId as _useId } from 'react'

/**
 * Hook that returns a stable ID, using provided ID if available or generating one.
 *
 * @example
 * const id = useId('custom-id') // Returns 'custom-id'
 * const id = useId() // Returns generated ID like ':r1:'
 */
export function useId<T>(id?: T) {
  const defaultId = _useId()
  const idRef = useRef(id)

  return idRef.current ?? defaultId
}
