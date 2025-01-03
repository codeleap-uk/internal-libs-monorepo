import React, { useState } from 'react'
import { useValidate } from '@codeleap/form'
import { useBooleanToggle } from '@codeleap/hooks'
import { TypeGuards } from '@codeleap/types'
import { forwardRef, useImperativeHandle } from 'react'
import { TextInput as NativeTextInput, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Touchable } from '../Touchable'
import { MaskedTextInput } from '../../modules/textInputMask'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { TextInputProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const TextInput = forwardRef<NativeTextInput, TextInputProps>((props, inputRef) => {
  const innerInputRef = React.useRef<NativeTextInput>(null)

  const [isFocused, setIsFocused] = useState(false)
  const [currentSelection, setCurrentSelection] = useState({ start: 0 })

  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...TextInput.defaultProps,
    ...props,
  })

  const {
    value,
    validate,
    debugName,
    visibilityToggle,
    masking,
    password,
    onChangeMask,
    onPress,
    visibleIcon,
    hiddenIcon,
    style,
    autoAdjustSelection,
    selectionStart,
    _error = null,
    ...textInputProps
  } = others

  const [secureTextEntry, toggleSecureTextEntry] = useBooleanToggle(true)

  const isMasked = !!masking

  const InputElement = isMasked ? MaskedTextInput : NativeTextInput

  const styles = useStylesFor(TextInput.styleRegistryName, style)

  // @ts-expect-error - React's ref type system is weird
  useImperativeHandle(inputRef, () => {
    return {
      ...innerInputRef.current,
      focus: () => {
        innerInputRef.current?.focus?.()
      },
      isTextInput: true,
    }
  }, [!!innerInputRef?.current?.focus])

  const isPressable = TypeGuards.isFunction(onPress)

  const validation = useValidate(value, validate)

  const handleBlur = React.useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation.onInputBlurred()
    setIsFocused(false)
    if (autoAdjustSelection) setCurrentSelection({ start: selectionStart })
    props.onBlur?.(e)
  }, [validation.onInputBlurred, props.onBlur])

  const handleFocus = React.useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation.onInputFocused()
    setIsFocused(true)
    if (autoAdjustSelection) setCurrentSelection(null)
    props.onFocus?.(e)
  }, [validation.onInputFocused, props.onFocus])

  const handleMaskChange = (masked, unmasked) => {
    if (textInputProps.onChangeText) textInputProps.onChangeText(masking?.saveFormatted ? masked : masked)
    if (onChangeMask) onChangeMask(masked, unmasked)
  }

  const isMultiline = textInputProps.multiline
  const isDisabled = !!inputBaseProps.disabled

  const placeholderTextColor = [
    [isDisabled, styles['placeholder:disabled']],
    [!validation.isValid, styles['placeholder:error']],
    [isFocused, styles['placeholder:focus']],
    [true, styles?.placeholder],
    // @ts-expect-error
  ].find(([x]) => x)?.[1]?.color

  const selectionColor = [
    [isDisabled, styles['selection:disabled']],
    [!validation.isValid, styles['selection:error']],
    [isFocused, styles['selection:focus']],
    [true, styles?.selection],
    // @ts-expect-error
  ].find(([x]) => x)?.[1]?.color

  const visibilityToggleProps = visibilityToggle ? {
    onPress: toggleSecureTextEntry,
    icon: (secureTextEntry ? hiddenIcon : visibleIcon) as AppIcon,
    debugName: `${debugName} toggle visibility`,
  } : null

  const rightIcon = inputBaseProps?.rightIcon ?? visibilityToggleProps

  const maskingExtraProps = isMasked ? {
    onChangeText: handleMaskChange,
    ref: null,
    refInput: (inputRef) => {
      if (!!inputRef) {
        innerInputRef.current = inputRef
      }
    },
    ...masking,
  } : {}

  const buttonModeProps = isPressable ? {
    editable: false,
    caretHidden: true,
  } : {}

  const hasMultipleLines = isMultiline && value?.includes('\n')

  const hasValue = value?.length > 0

  return <InputBase
    {...inputBaseProps}
    innerWrapper={isPressable ? Touchable : undefined}
    debugName={debugName}
    error={(validation.isValid && !_error) ? null : _error || validation.message}
    style={{
      ...styles,
      innerWrapper: [
        styles?.innerWrapper,
        isMultiline && styles['innerWrapper:multiline'],
        hasMultipleLines && styles['innerWrapper:hasMultipleLines'],
      ],
    }}
    innerWrapperProps={{
      ...(inputBaseProps.innerWrapperProps || {}),
      onPress,
      debugName,
      dismissKeyboard: false,
    }}
    rightIcon={rightIcon}
    focused={isFocused}
    hasValue={hasValue}
  >
    <InputElement
      allowFontScaling={false}
      editable={!isPressable && !isDisabled}
      {...buttonModeProps}
      selection={autoAdjustSelection ? currentSelection : undefined}
      placeholderTextColor={placeholderTextColor}
      value={value}
      selectionColor={selectionColor}
      secureTextEntry={password && secureTextEntry}
      textAlignVertical={isMultiline ? 'top' : undefined}
      {...textInputProps}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={[
        styles?.input,
        isMultiline && styles['input:multiline'],
        isFocused && styles['input:focused'],
        !validation.isValid && styles['input:error'],
        isDisabled && styles['input:disabled'],
        hasMultipleLines && styles['input:hasMultipleLines'],
        hasValue && styles['input:typed'],

      ]}
      ref={innerInputRef}
      pointerEvents={isPressable ? 'none' : undefined}
      {...maskingExtraProps}
    />
  </InputBase>
}) as StyledComponentWithProps<TextInputProps>

TextInput.styleRegistryName = 'TextInput'
TextInput.elements = [...InputBase.elements, 'input', 'placeholder', 'selection']
TextInput.rootElement = 'wrapper'

TextInput.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return TextInput as (props: StyledComponentProps<TextInputProps, typeof styles>) => IJSX
}

TextInput.defaultProps = {
  hiddenIcon: 'input-visiblity:hidden' as AppIcon,
  visibleIcon: 'input-visiblity:visible' as AppIcon,
  visibilityToggle: false,
  autoAdjustSelection: false,
  selectionStart: 0,
} as Partial<TextInputProps>

MobileStyleRegistry.registerComponent(TextInput)
