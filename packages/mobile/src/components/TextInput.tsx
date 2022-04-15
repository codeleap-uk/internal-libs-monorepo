import * as React from 'react'
import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
  TextInputComposition,
  TextInputStyles,
  useBooleanToggle,
  useDefaultComponentStyle,
  useValidate,
} from '@codeleap/common'
import { ComponentPropsWithoutRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Text } from './Text'
import { View, ViewProps } from './View'
import { Button } from './Button'
import { StylesOf } from '../types/utility'
import { Icon } from './Icon'
import { NativeSyntheticEvent, StyleSheet, TextInput as NativeTextInput, TextInputChangeEventData } from 'react-native'
import { Touchable, TouchableProps } from './Touchable'

type IconProp = { name: IconPlaceholder; action?: () => void }

type NativeProps = ComponentPropsWithoutRef<typeof NativeTextInput>

export type TextInputProps =
  ComponentVariants<typeof TextInputStyles> &
  Omit<NativeProps, 'value'> &
  {
    multiline?: boolean
    onChangeText?: (text: string) => void
    disabled?: boolean
    edited?: boolean
    type?: string
    label?: React.ReactNode
    debugName: string
    leftIcon?: IconProp
    rightIcon?: IconProp
    styles?: StylesOf<TextInputComposition>
    validate?: FormTypes.ValidatorFunctionWithoutForm | string
    value?: string
    password?: boolean
    visibilityToggle?: boolean
    touchableWrapper?: boolean
    onPress?: () => void
    innerWrapperProps?: TouchableProps | ViewProps
  }

export const TextInput = forwardRef<NativeTextInput, TextInputProps>((rawprops, inputRef) => {
  const {
    onChange,
    type,
    value,
    onChangeText,
    disabled,
    edited,
    onFocus,
    onBlur,
    variants,
    label,
    leftIcon,
    rightIcon,
    styles,
    validate,
    password,
    visibilityToggle,
    touchableWrapper,
    innerWrapperProps,
    debugName,
    ...props
  } = rawprops

  const [isFocused, setFocus] = useState(false)
  const [editedState, setEdited] = useState(edited)

  const input = useRef<any>(null)
  const [textIsVisible, setTextVisible] = useBooleanToggle(false)
  const variantStyles = useDefaultComponentStyle('TextInput', {
    variants,
    styles,
  })
  const InputElement = NativeTextInput

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    if (!editedState && value) setEdited(true)
    setFocus(false)

    if (onBlur) {
      onBlur(e)
    }
  }

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setFocus(true)
    if (onFocus) {
      onFocus(e)
    }
  }

  const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = event.nativeEvent.text

    if (onChange) onChange(event)
    if (onChangeText) onChangeText(text)
  }

  useImperativeHandle(inputRef, () => ({ ...input.current, focus: () => {
    input.current?.focus?.()
  }, isTextInput: true }))

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

  const buttonIconWrapperStyle = {
    ...variantStyles.buttonIconWrapper,
    ...(isFocused ? variantStyles['buttonIconWrapper:focus'] : {}),
    ...(showError ? variantStyles['buttonIconWrapper:error'] : {}),
  }
  function getStyles(key: TextInputComposition) {
    const requestedStyles = [
      variantStyles[key],
      isFocused ? variantStyles[key + ':focus'] : {},
      showError ? variantStyles[key + ':error'] : {},
    ]
    return requestedStyles
  }

  function handlePress() {
    if (props.onPress) {
      props.onPress()
    } else {
      input.current?.focus?.()
    }
  }

  return (
    <Touchable
      style={getStyles('wrapper')}
      debugName={debugName}
      onPress={handlePress}
      {...innerWrapperProps}
    >
      <InputLabel label={label} style={getStyles('label')} />
      <View style={getStyles('innerWrapper')} {...innerWrapperProps}>
        <InputIcon {...leftIcon} style={leftIconStyle} wrapperStyle={buttonIconWrapperStyle} />
        <InputElement
          ref={input}
          secureTextEntry={password && !textIsVisible}
          onChange={handleChange}
          value={value}
          editable={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={StyleSheet.flatten(getStyles('placeholder'))?.color}
          selectionColor={StyleSheet.flatten(getStyles('selection'))?.color}
          {...props}
          style={getStyles('textField')}
        />
        {
          visibilityToggle ?
            <InputIcon name={
              (textIsVisible ? 'input-visiblity:visible' : 'input-visiblity:hidden') as IconPlaceholder
            } action={() => setTextVisible()} style={rightIconStyle} wrapperStyle={buttonIconWrapperStyle}/>
            :
            <InputIcon {...rightIcon} style={rightIconStyle} wrapperStyle={buttonIconWrapperStyle} />
        }
      </View>
      <FormError message={error.message} style={getStyles('error')} />
    </Touchable>
  )
})

export const FormError = ({ message, ...props }) => {
  if (['number', 'string', 'undefined'].includes(typeof message)) {
    return <Text text={`${message || ' '}`} variants={['p2', 'marginTop:1']} {...props} />
  }
  return message
}

export const InputIcon: React.FC<{ style: any; wrapperStyle: any } & IconProp> = ({ name, style, action, wrapperStyle = {}}) => {
  if (!name) return null
  if (action) {
    return <Touchable debugName={`${name} icon button`} onPress={() => action()} style={wrapperStyle} >
      <Icon name={name} style={style}/>
    </Touchable>
  }
  return <Icon name={name} style={style} />
}

export const InputLabel = ({ label, style }) => {
  if (!label) return null

  switch (typeof label) {
    case 'string':
      return <Text style={style} text={label} />
    case 'object':
      return label
    default:
      return null
  }
}
