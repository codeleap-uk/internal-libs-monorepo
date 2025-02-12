import { useCallback, useState } from 'react'
import { TextInputProps } from './types'
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native/types'
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'

export function useTextInput(props: Partial<TextInputProps>) {
  const { 
    onFocus, 
    onBlur, 
    secure, 
    field, 
    autoAdjustSelection, 
    selectionStart,
    masking,
    onChangeMask,
    multiline,
    forceError,
  } = props

  const [isFocused, setIsFocused] = useState(false)

  const [currentSelection, setCurrentSelection] = useState({ start: 0 })

  const [secureTextEntry, setSecureTextEntry] = useState(secure)

  const toggleSecureTextEntry = () => setSecureTextEntry(s => !s)

  const {
    fieldHandle,
    validation,
    innerInputRef,
    wrapperRef,
  } = useInputBase(field, fields.text, {
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

  const handleBlur = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation.onInputBlurred()
    setIsFocused(false)
    if (autoAdjustSelection) setCurrentSelection({ start: selectionStart })
    onBlur?.(e)
  }, [validation.onInputBlurred, onBlur])

  const handleFocus = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true)
    if (autoAdjustSelection) setCurrentSelection(null)
    onFocus?.(e)
  }, [onFocus])

  const handleMaskChange = useCallback((masked, unmasked) => {
    fieldHandle.setValue(masking?.saveFormatted ? masked : masked)
    if (onChangeMask) onChangeMask(masked, unmasked)
  }, [masking?.saveFormatted, onChangeMask])

  const hasMultipleLines = multiline && fieldHandle?.value?.includes('\n')

  const hasValue = fieldHandle?.value?.length > 0

  const hasError = validation.showError || forceError

  return {
    isFocused,
    currentSelection,
    secureTextEntry,
    handleBlur,
    handleFocus,
    handleMaskChange,
    fieldHandle,
    validation,
    innerInputRef,
    wrapperRef,
    toggleSecureTextEntry,
    hasMultipleLines,
    hasValue,
    hasError,
  }
}