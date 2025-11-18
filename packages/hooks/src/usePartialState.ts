import { useState } from 'react'
import { DeepPartial } from '@codeleap/types'
import { deepMerge } from '@codeleap/utils'

type SetPartialStateCallback<T> = (value: T) => DeepPartial<T>

/**
 * Hook that manages state with partial updates using deep merge.
 *
 * @example
 * const [user, setUser] = usePartialState({ name: 'John', age: 30 })
 * setUser({ age: 31 }) // Only updates age, keeps name
 * setUser(prev => ({ age: prev.age + 1 })) // Functional update
 */
export function usePartialState<T= any>(initial: T | (() => T)) {
  const [state, setState] = useState(initial)

  function setPartial(
    value: DeepPartial<T> | SetPartialStateCallback<T>,
  ) {
    if (typeof value === 'function') {
      setState((v) => deepMerge(v, value(v as T)))
    } else {
      setState(deepMerge(state, value))
    }
  }

  return [state as T, setPartial] as const
}
