import { useState, SetStateAction, Dispatch } from 'react'
import { TypeGuards } from '..'

type UseConditionalStateOptions<T> = {
    initialValue?: T
  }

  type UseConditionalState = <T>(
    value: T | undefined,
    setter: Dispatch<SetStateAction<T>> | ((value: T) => void),
    options?: UseConditionalStateOptions<T>
  ) => [T, Dispatch<SetStateAction<T>> | ((value: T) => void)]

export const useConditionalState: UseConditionalState = (value, setter, options) => {
  const state = useState(options?.initialValue)

  if (!TypeGuards.isNil(value) && TypeGuards.isFunction(setter)) {
    return [value, setter]
  }

  return state
}
