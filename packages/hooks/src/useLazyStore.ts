import { globalState } from '@codeleap/store'
import { useMemo } from 'react'

/**
 * Hook that lazily creates a global store with an initial value.
 * The store is created only once and persists across re-renders.
 *
 * @example
 * const counterStore = useLazyStore(0)
 * // Store is created once and can be used across components
 */
export function useLazyStore<T>(initialValue: T) {
  const store = useMemo(() => {
    return globalState(initialValue)
  }, [])

  return store
}
