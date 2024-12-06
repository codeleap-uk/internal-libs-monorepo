import { useState } from 'react'
import { DeepPartial } from '@codeleap/types'
import { deepMerge } from '@codeleap/utils'

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

  return [state as T, setPartial] as const
}
