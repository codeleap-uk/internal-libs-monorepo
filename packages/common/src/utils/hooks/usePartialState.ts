import { useState } from 'react'
import { DeepPartial } from 'src/types'
import { deepMerge } from '../object'

type SetPartialStateCallback<T> = (value: T) => DeepPartial<T>

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

  return [
      state as T,
      setPartial,
  ] as const
}
