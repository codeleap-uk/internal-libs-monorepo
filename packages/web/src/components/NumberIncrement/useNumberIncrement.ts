import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { NumberIncrementProps } from './types'
import { useInputBase } from '../InputBase/useInputBase'
import { Field, fields } from '@codeleap/form'
import { TypeGuards } from '@codeleap/types'
import { NumericFormatProps as NFProps } from 'react-number-format'

export function useNumberIncrement(props: Partial<NumberIncrementProps>) {
  const {
    value,
    onValueChange,
    field,
    min,
    max,
    forceError,
    step,
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

  const innerWrapperRef = useRef(null)

  const hasValue = TypeGuards.isString(inputValue)
    ? (inputValue as string)?.length > 0
    : !TypeGuards.isNil(inputValue)

  const hasError = validation?.showError || !!forceError

  const errorMessage = validation?.message || forceError

  const incrementDisabled = useMemo(() => {
    if (TypeGuards.isNumber(max) && (Number(inputValue) >= max)) {
      return true
    }
    return false
  }, [inputValue])

  const decrementDisabled = useMemo(() => {
    if (TypeGuards.isNumber(min) && (Number(inputValue) <= min)) {
      return true
    }
    return false
  }, [inputValue])

  const handleChange = useCallback((action: 'increment' | 'decrement') => {
    if (action === 'increment' && !incrementDisabled) {
      const newValue = Number(inputValue || min) + step
      onInputValueChange(newValue)
      return
    } else if (action === 'decrement' && !decrementDisabled) {
      const newValue = Number(inputValue || min) - step
      onInputValueChange(newValue)
      return
    }

    validation?.onInputBlurred?.()
  }, [validation?.onInputBlurred, inputValue])

  const handleBlur = useCallback(() => {
    if (TypeGuards.isNumber(max) && (inputValue >= max)) {
      onInputValueChange(max)
      return
    } else if (TypeGuards.isNumber(min) && (inputValue <= min) || !inputValue) {
      onInputValueChange(min)
      return
    }

    validation?.onInputBlurred?.()
  }, [validation?.onInputBlurred, inputValue])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  useEffect(() => {
    function handleKeyboardEvent(event: KeyboardEvent) {
      if (!isFocused) return

      if (event.keyCode === 39 || event.key === 'ArrowRight') {
        handleChange('increment')
      } else if (event.keyCode === 37 || event.key === 'ArrowLeft') {
        handleChange('decrement')
      }
    }

    document.addEventListener('keydown', handleKeyboardEvent)

    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent)
    }
  }, [handleChange, isFocused])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (innerWrapperRef.current && !innerWrapperRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [innerWrapperRef])

  const handleChangeInput: NFProps['onValueChange'] = (values) => {
    const { floatValue } = values

    onInputValueChange(Number(floatValue))
  }

  const onPressInnerWrapper = () => {
    setIsFocused(true)
    innerInputRef.current?.focus?.()
  }

  return {
    hasValue,
    hasError,
    errorMessage,
    inputValue: inputValue || min,
    isFocused,
    incrementDisabled,
    decrementDisabled,
    innerInputRef,
    innerWrapperRef,
    handleBlur,
    handleFocus,
    handleChange,
    handleChangeInput,
    onPressInnerWrapper,
    fieldHandle,
    wrapperRef,
  }
}