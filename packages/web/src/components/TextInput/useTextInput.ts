import React, { useCallback, useState, useMemo } from 'react'
import { TextInputProps } from './types'
import { TypeGuards } from '@codeleap/types'
import { getMaskInputProps } from './mask'
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'

export function useTextInput(props: Partial<TextInputProps>) {
  const {
    onFocus,
    onBlur,
    field,
    masking,
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

  const isMasked = !TypeGuards.isNil(masking)

  const maskProps = useMemo(() => {
    return isMasked ? getMaskInputProps({ masking }) : null
  }, [masking])

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

  const handleAccept = useCallback((value: string, maskRef: any) => {
    const finalValue = isMasked && maskProps?.notSaveFormatted
      ? maskProps?.getRawValue(value)
      : value

    onInputValueChange(finalValue)
    maskProps?.onAccept?.(value, maskRef)
  }, [isMasked, maskProps, onInputValueChange])

  const rows = providedRows ?? (isMultiline ? 2 : undefined)

  const hasMultipleLines = isMultiline && (String(inputValue)?.includes('\n') || !!rows)

  const hasError = validation?.showError || forceError

  const errorMessage = validation?.message || forceError

  return {
    maskProps,
    isMultiline,
    isMasked,
    isFocused,
    secureTextEntry,
    handleBlur,
    handleFocus,
    handleChange,
    handleAccept,
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