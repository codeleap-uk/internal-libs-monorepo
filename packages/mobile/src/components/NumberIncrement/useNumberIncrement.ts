import { useCallback, useMemo, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native/types'
import { useInputBase } from '../InputBase/useInputBase'
import { NumberIncrementProps } from './types'
import { TypeGuards } from '@codeleap/types'
import { Field, fields } from '@codeleap/form'

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
    min,
    max,
    value,
    onValueChange,
  } = props

  const [isFocused, setIsFocused] = useState(false)

  const {
    fieldHandle,
    validation,
    innerInputRef,
    wrapperRef,
    inputValue,
    onInputValueChange,
  } = useInputBase(
    field as Field<number, any, any>,
    fields.number as () => Field<number, any, any>,
    { value, onValueChange }
  )

  const incrementDisabled = useMemo(() => {
    const maxLimit = TypeGuards.isNumber(max) && (Number(inputValue) >= max)
    return maxLimit
  }, [inputValue])

  const decrementDisabled = useMemo(() => {
    const minLimit = TypeGuards.isNumber(min) && (Number(inputValue) <= min)
    return minLimit
  }, [inputValue])

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
      const newValue = Number(inputValue) + step
      onInputValueChange(newValue)
    } else if (action === 'decrement' && !decrementDisabled) {
      const newValue = Number(inputValue) - step
      onInputValueChange(newValue)
    }

    if (actionPressAutoFocus) {
      actionTimeoutRef.current = setTimeout(() => {
        setIsFocused(false)
      }, timeoutActionFocus)
    }
  }, [inputValue, incrementDisabled, decrementDisabled])

  const checkValue = useCallback((newValue: number = null, withLimits = true) => {
    const value = newValue ?? inputValue

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
      onInputValueChange(MAX_VALID_DIGITS)
      return MAX_VALID_DIGITS
    }

    return value
  }, [inputValue])

  const handleBlur = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    onInputValueChange(checkValue())
    validation?.onInputBlurred?.()
    setIsFocused(false)
    onBlur?.(e)
  }, [validation?.onInputBlurred, onBlur, checkValue])

  const handleFocus = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    clearActionTimeoutRef()
    if (editable) setIsFocused(true)
    onFocus?.(e)
  }, [onFocus])

  const handleChangeInput = useCallback((text: string) => {
    const value = checkValue(parseValue(text), false)

    onInputValueChange(value)

    return value
  }, [checkValue])

  const handleMaskChange = useCallback((masked, unmasked) => {
    handleChangeInput?.(masked)
    if (onChangeMask) onChangeMask(masked, unmasked)
  }, [onChangeMask, handleChangeInput])

  const hasValue = TypeGuards.isString(inputValue)
    ? (inputValue as string).length > 0
    : !TypeGuards.isNil(inputValue)

  const hasError = validation?.showError || forceError

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
    inputValue,
    onInputValueChange,
  }
}