import * as React from 'react'
import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
  TextInputComposition,
  TextInputStyles,
  useBooleanToggle,
  useComponentStyle,
  useValidate,
} from '@codeleap/common'
import { ComponentPropsWithoutRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Text } from '../Text'
import { View } from '../View'
import { Button } from '../Button'
import { StylesOf } from '../../types/utility'
import { Icon } from '../Icon'
import { NativeSyntheticEvent, StyleSheet, TextInput as NativeTextInput, TextInputChangeEventData } from 'react-native'
import { FormError, InputIcon, InputLabel } from '../TextInput'

type IconProp = { name: IconPlaceholder, action?: () => void }

type NativeProps = ComponentPropsWithoutRef<typeof NativeTextInput>

export type SelectInputProps =
  ComponentVariants<typeof TextInputStyles> &
  Omit<NativeProps, 'value'> &
  {
    multiline?: boolean;
    onChangeText?: (text: string) => void;
    disabled?: boolean;
    label?: React.ReactNode

    leftIcon?: IconProp
    rightIcon?: IconProp
    styles?: StylesOf<TextInputComposition>
    validate?: FormTypes.ValidatorFunctionWithoutForm | string
    value?: string
    visibilityToggle?: boolean
  };

export const SelectInput = forwardRef<NativeTextInput, any>((rawprops, inputRef) => {
  const {
    onChange,
    value,
    onChangeText,
    onFocus,
    onBlur,
    multiline,
    variants,
    label,
    leftIcon,
    rightIcon,
    styles,
    validate,
    visibilityToggle,

    ...props
  } = rawprops

  const [isFocused, setFocus] = useState(false)

  const input = useRef<any>(null)

  const variantStyles = useComponentStyle('TextInput', {
    variants,
    styles,
  })

 
  const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = event.nativeEvent.text

    if (onChange) onChange(event)
    if (onChangeText) onChangeText(text)
  }

  useImperativeHandle(inputRef, () => ({...input.current, focus: () => {
    input.current?.focus?.()
  }, isTextInput: true}))

  const { showError, error } = useValidate(value, validate)

  const leftIconStyle = {
    ...variantStyles.icon,
    ...(isFocused ? variantStyles['icon:focus'] : {}),
    ...(showError ? variantStyles['icon:error'] : {}),
    ...variantStyles.leftIcon,
    ...(isFocused ? variantStyles['leftIcon:focus'] : {}),
    ...(showError ? variantStyles['leftIcon:error'] : {}),
  }

  const rightIconStyle = {
    ...variantStyles.icon,
    ...(isFocused ? variantStyles['icon:focus'] : {}),
    ...(showError ? variantStyles['icon:error'] : {}),
    ...variantStyles.rightIcon,
    ...(isFocused ? variantStyles['rightIcon:focus'] : {}),
    ...(showError ? variantStyles['rightIcon:error'] : {}),
  }

  function getStyles(key: TextInputComposition) {
    const requestedStyles = [
      variantStyles[key],
      isFocused ? variantStyles[key + ':focus'] : {},
      showError ? variantStyles[key + ':error'] : {},
    ]
    return requestedStyles
  }

  return (
    <View
      style={getStyles('wrapper')}
    >
      <InputLabel label={label} style={getStyles('label')} />
      <View style={getStyles('innerWrapper')}>
        <InputIcon {...leftIcon} style={leftIconStyle} />
        {/* <InputElement
          ref={input}
          secureTextEntry={password && !textIsVisible}
          onChange={handleChange}
          value={value}
          editable={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={StyleSheet.flatten(getStyles('placeholder'))?.color}
          {...props}
          style={getStyles('textField')}
        /> */}
        
          
        <InputIcon {...rightIcon} style={rightIconStyle} />
        
      </View>
      <FormError message={error.message} style={{
        ...variantStyles.error,
      }} />
    </View>
  )
})
