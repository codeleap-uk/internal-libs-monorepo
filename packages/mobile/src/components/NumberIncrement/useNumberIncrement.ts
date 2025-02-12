import { useCallback, useMemo, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native/types'
import { useInputBase } from '../InputBase/useInputBase'
import { NumberIncrementProps } from './types'
import { TypeGuards } from '@codeleap/types'
import { Field, FieldOptions, fields } from '@codeleap/form'

export const MAX_VALID_DIGITS = 1000000000000000 // maximum number of digits that the input supports to perform operations

export function useNumberIncrement(props: Partial<NumberIncrementProps>) {
  const {
    onFocus,
    onBlur,
    field,
    actionPressAutoFocus,
    timeoutActionFocus,
    onChangeMask,
    forceError,
    editable,
    step,
    parseValue,
  } = props

  const [isFocused, setIsFocused] = useState(false)

  const {
    fieldHandle,
    validation,
    innerInputRef,
    wrapperRef,
  } = useInputBase(field as Field<number, any, any>, fields.number as () => Field<number, any, any>)

  const options = fieldHandle.options as FieldOptions<any, any> & { min: number; max: number }

  const max = props?.max ?? options?.max
  const min = props?.min ?? options?.min

  const actionTimeoutRef = useRef(null)

  const clearActionTimeoutRef = useCallback(() => {
    if (actionTimeoutRef.current !== null) {
      clearTimeout(actionTimeoutRef.current)
      actionTimeoutRef.current = null
    }
  }, [actionTimeoutRef.current])

  const handleChange = useCallback((action: 'increment' | 'decrement') => {
    if (actionPressAutoFocus) setIsFocused(true)
    clearActionTimeoutRef()

    if (action === 'increment' && !incrementDisabled) {
      const newValue = Number(fieldHandle?.value) + step
      fieldHandle.setValue(newValue)
    } else if (action === 'decrement' && !decrementDisabled) {
      const newValue = Number(fieldHandle?.value) - step
      fieldHandle.setValue(newValue)
    }

    if (actionPressAutoFocus) {
      actionTimeoutRef.current = setTimeout(() => {
        setIsFocused(false)
      }, timeoutActionFocus)
    }
  }, [fieldHandle?.value])

  const checkValue = useCallback((newValue: number = null, withLimits = true) => {
    const value = newValue ?? fieldHandle?.value

    if (withLimits) {
      if (TypeGuards.isNumber(max) && (Number(value) >= max)) {
        return max
      } else if (TypeGuards.isNumber(min) && (Number(value) <= min) || TypeGuards.isNil(value) || String(value)?.length <= 0) {
        return min
      }
    }

    if (!value) {
      return min
    }

    if (value >= MAX_VALID_DIGITS) {
      fieldHandle.setValue(MAX_VALID_DIGITS)
      return MAX_VALID_DIGITS
    }

    return value
  }, [])

  const handleBlur = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    fieldHandle.setValue(checkValue())
    validation.onInputBlurred()
    setIsFocused(false)
    onBlur?.(e)
  }, [validation.onInputBlurred, onBlur])

  const handleFocus = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    clearActionTimeoutRef()
    if (editable) setIsFocused(true)
    onFocus?.(e)
  }, [onFocus])

  const handleChangeInput = useCallback((text: string) => {
    const value = checkValue(parseValue(text), false)

    fieldHandle.setValue(value)

    return value
  }, [])

  const handleMaskChange = useCallback((masked, unmasked) => {
    handleChangeInput?.(masked)
    if (onChangeMask) onChangeMask(masked, unmasked)
  }, [onChangeMask])

  const incrementDisabled = useMemo(() => {
    const maxLimit = TypeGuards.isNumber(max) && (Number(fieldHandle?.value) >= max)
    return maxLimit
  }, [fieldHandle?.value])

  const decrementDisabled = useMemo(() => {
    const minLimit = TypeGuards.isNumber(min) && (Number(fieldHandle?.value) <= min)
    return minLimit
  }, [fieldHandle?.value])

  const hasValue = TypeGuards.isString(fieldHandle?.value)
    ? (fieldHandle?.value as string).length > 0
    : !TypeGuards.isNil(fieldHandle?.value)

  const hasError = validation.showError || forceError

  return {
    isFocused,
    handleBlur,
    handleFocus,
    handleMaskChange,
    handleChange,
    handleChangeInput,
    fieldHandle,
    validation,
    innerInputRef,
    wrapperRef,
    hasValue,
    hasError,
    incrementDisabled,
    decrementDisabled,
    min,
    max,
  }
}