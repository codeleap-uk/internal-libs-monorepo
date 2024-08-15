import { useState, SetStateAction, Dispatch } from 'react'
import * as TypeGuards from '../typeGuards'
import { useBooleanToggle } from './useBooleanToggle'

type UseConditionalStateOptions<T> = {
  initialValue?: T
  isBooleanToggle?: boolean
}

type UseConditionalState = <T>(
  value: T | undefined,
  setter: Dispatch<SetStateAction<T>> | ((value: T) => void),
  options?: UseConditionalStateOptions<T>
) => [T, Dispatch<SetStateAction<T>> | ((value: T) => void)]

// @ts-expect-error
export const useConditionalState: UseConditionalState = (value, setter, options) => {

  const state = options?.isBooleanToggle
    ? useBooleanToggle(options?.initialValue as boolean)
    : useState(options?.initialValue)

  if (!TypeGuards.isNil(value) && TypeGuards.isFunction(setter)) {
    return [value, setter]
  }

  return state
}
