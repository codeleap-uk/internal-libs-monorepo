import React, { useCallback, useState } from 'react'
import { TextInputProps } from './types'
import { TypeGuards } from '@codeleap/types'
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'

export function useTextInput(props: Partial<TextInputProps>) {
  const {
    onFocus,
    onBlur,
    field,
    multiline: isMultiline,
    forceError,
    value,
    onValueChange,
    onChangeText,
    rows: providedRows,
  } = props

  const [isFocused, setIsFocused] = useState(false)

  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const toggleSecureTextEntry = () => setSecureTextEntry(s => !s)

  const {
    fieldHandle,
    validation,
    innerInputRef,
    wrapperRef,
    onInputValueChange,
    inputValue,
  } = useInputBase<string>(
    field,
    fields.text,
    { value, onValueChange: onValueChange ?? onChangeText as any },
    {
    revealValue() {
      setSecureTextEntry(false)
    },
    hideValue() {
      setSecureTextEntry(true)
    },
    toggleValueVisibility() {
      toggleSecureTextEntry()
    },
  }, [setSecureTextEntry])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement, Element>) => {
    validation?.onInputBlurred?.()
    setIsFocused(false)
    onBlur?.(e)
  }, [validation?.onInputBlurred, onBlur])

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement, Element>) => {
    setIsFocused(true)
    onFocus?.(e)
  }, [onFocus])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (TypeGuards.isFunction(onChangeText)) return onChangeText(event)
    const inputValue = event?.target?.value
    onInputValueChange(inputValue)
  }, [onInputValueChange, onChangeText])

  const rows = providedRows ?? (isMultiline ? 2 : undefined)

  const hasMultipleLines = isMultiline && (String(inputValue)?.includes('\n') || !!rows)

  const hasError = validation?.showError || forceError

  const errorMessage = validation?.message || forceError

  return {
    isMultiline,
    isFocused,
    secureTextEntry,
    handleBlur,
    handleFocus,
    handleChange,
    fieldHandle,
    validation,
    innerInputRef,
    wrapperRef,
    errorMessage,
    toggleSecureTextEntry,
    hasMultipleLines,
    hasError,
    inputValue: inputValue || '',
    onInputValueChange,
  }
}