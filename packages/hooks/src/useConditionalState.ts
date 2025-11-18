import { useState, SetStateAction, Dispatch } from 'react'
import { AnyFunction } from '@codeleap/types'
import { useBooleanToggle } from './useBooleanToggle'

type UseConditionalStateOptions<T> = {
  initialValue?: T
  isBooleanToggle?: boolean
}

type SetState<T> = Dispatch<SetStateAction<T>> & ((value: T) => void) & (() => void)

/**
 * Hook that uses external state if provided, otherwise creates internal state.
 * Useful for creating controlled/uncontrolled component patterns.
 *
 * @example
 * // Controlled mode
 * const [value, setValue] = useConditionalState(props.value, props.onChange)
 *
 * // Uncontrolled mode
 * const [value, setValue] = useConditionalState(undefined, undefined, { initialValue: 'default' })
 */
export const useConditionalState = <T>(
  value: T | undefined,
  setter: AnyFunction,
  options: UseConditionalStateOptions<T> = {},
): [T, SetState<T>] => {
  const state = options?.isBooleanToggle
    ? useBooleanToggle(options?.initialValue as boolean)
    : useState(options?.initialValue)

  if (typeof value !== 'undefined' && typeof setter === 'function') {
    return [value, setter]
  }

  return state as unknown as [T, SetState<T>]
}
