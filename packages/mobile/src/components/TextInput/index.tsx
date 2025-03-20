import React from 'react'
import { TypeGuards } from '@codeleap/types'
import { forwardRef } from 'react'
import { TextInput as NativeTextInput } from 'react-native'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Touchable } from '../Touchable'
import { MaskedTextInput } from '../../modules/textInputMask'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { TextInputProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { useTextInput } from './useTextInput'
import { useInputBasePartialStyles } from '../InputBase/useInputBasePartialStyles'

export * from './styles'
export * from './types'

export const TextInput = forwardRef<NativeTextInput, TextInputProps>((props, inputRef) => {
  const allProps = {
    ...TextInput.defaultProps,
    ...props,
  }

  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(allProps)

  const {
    debugName,
    visibilityToggle,
    masking,
    secure,
    field,
    onChangeMask,
    onPress,
    visibleIcon,
    hiddenIcon,
    style,
    autoAdjustSelection,
    selectionStart,
    forceError,
    multiline,
    ...textInputProps
  } = others

  const styles = useStylesFor(TextInput.styleRegistryName, style)

  const {
    fieldHandle,
    validation,
    innerInputRef,
    wrapperRef,
    isFocused, 
    secureTextEntry,
    currentSelection,
    hasMultipleLines,
    hasValue,
    hasError,
    toggleSecureTextEntry,
    handleMaskChange,
    handleBlur,
    handleFocus,
  } = useTextInput(allProps)
  
  const InputElement = masking ? MaskedTextInput : NativeTextInput

  const isPressable = TypeGuards.isFunction(onPress)

  const isDisabled = !!inputBaseProps.disabled

  const partialStyles = useInputBasePartialStyles(styles, ['placeholder', 'selection'], {
    disabled: isDisabled,
    error: !!hasError,
    focus: isFocused,
  })

  const visibilityToggleProps = visibilityToggle ? {
    onPress: toggleSecureTextEntry,
    icon: (secureTextEntry ? hiddenIcon : visibleIcon) as AppIcon,
    debugName: `${debugName} toggle visibility`,
  } : null

  const rightIcon = inputBaseProps?.rightIcon ?? visibilityToggleProps

  const maskingExtraProps = masking ? {
    onChangeText: handleMaskChange,
    ref: null,
    refInput: (inputRef) => {
      if (!!inputRef) innerInputRef.current = inputRef
    },
    ...masking,
  } : {
    onChangeText: fieldHandle.setValue
  }

  const buttonModeProps = isPressable ? {
    editable: false,
    caretHidden: true,
  } : {}

  return <InputBase
    {...inputBaseProps}
    ref={wrapperRef}
    innerWrapper={isPressable ? Touchable : undefined}
    debugName={debugName}
    error={hasError ? validation.message || forceError : null}
    style={{
      ...styles,
      innerWrapper: [
        styles?.innerWrapper,
        multiline && styles['innerWrapper:multiline'],
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
      placeholderTextColor={partialStyles?.placeholder?.color}
      selectionColor={partialStyles?.selection?.color}
      secureTextEntry={secure && secureTextEntry}
      textAlignVertical={multiline ? 'top' : undefined}
      multiline={multiline}
      {...textInputProps}
      value={fieldHandle?.value}
      onChangeText={fieldHandle?.setValue}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={[
        styles?.input,
        multiline && styles['input:multiline'],
        isFocused && styles['input:focused'],
        hasError && styles['input:error'],
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
  secure: false,
} as Partial<TextInputProps>

MobileStyleRegistry.registerComponent(TextInput)
