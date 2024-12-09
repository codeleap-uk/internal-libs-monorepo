import { useState, SetStateAction, Dispatch } from 'react'
import { AnyFunction } from '@codeleap/types'
import { useBooleanToggle } from './useBooleanToggle'

type UseConditionalStateOptions<T> = {
  initialValue?: T
  isBooleanToggle?: boolean
}

type SetState<T> = Dispatch<SetStateAction<T>> & ((value: T) => void) & (() => void)

export const useConditionalState = <T>(
  value: T | undefined,
  setter: AnyFunction,
  options: UseConditionalStateOptions<T> = {}
): [T, SetState<T>] => {
  const state = options?.isBooleanToggle
    ? useBooleanToggle(options?.initialValue as boolean)
    : useState(options?.initialValue)

  if (!value && typeof setter === 'function') {
    return [value, setter]
  }

  return state as unknown as [T, SetState<T>]
}
