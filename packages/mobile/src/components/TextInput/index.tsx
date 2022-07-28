import * as React from 'react'
import {
  ComponentVariants,
  FormTypes,
  getNestedStylesByKey,
  IconPlaceholder,

  useBooleanToggle,
  useDefaultComponentStyle,
  useValidate,
} from '@codeleap/common'
import { ComponentPropsWithoutRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { StylesOf } from '../../types'
import { Icon } from '../Icon'
import { NativeSyntheticEvent, StyleSheet, TextInput as NativeTextInput, TextInputChangeEventData } from 'react-native'
import { Touchable, TouchableProps } from '../Touchable'
import { MaskedTextInput, TextInputMaskProps } from '../../modules/textInputMask'
import { InputLabel } from './Label'

export { InputLabel } from './Label'

export * from './styles'

import {
  InputIconComposition,
  TextInputComposition,
  TextInputStyles,
} from './styles'
import { ActionIcon, ActionIconParts, ActionIconProps } from '../ActionIcon'

type IconProp = { name: IconPlaceholder; action?: () => void }

type NativeProps = ComponentPropsWithoutRef<typeof NativeTextInput>

export type TextInputProps =
  Partial<TextInputMaskProps> &
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
    leftIcon?: Partial<ActionIconProps>
    rightIcon?: Partial<ActionIconProps>
    styles?: StylesOf<TextInputComposition>
    validate?: FormTypes.ValidatorFunctionWithoutForm | string
    value?: string
    password?: boolean
    visibilityToggle?: boolean
    touchableWrapper?: boolean
    onPress?: () => void
    masking?: FormTypes.TextField['masking']
    innerWrapperProps?: ViewProps
    wrapperProps?: TouchableProps
    onChangeMask?: TextInputMaskProps['onChangeText']
    required?:boolean
  }

export const TextInput = forwardRef<NativeTextInput, TextInputProps>((rawprops, inputRef) => {
  const {
    onChange,
    value,
    onChangeText,
    disabled,
    edited,
    onFocus,
    onBlur,
    variants,
    label,
    wrapperProps,
    leftIcon,
    rightIcon,
    styles,
    validate,
    password,
    visibilityToggle,
    innerWrapperProps,
    masking = null,
    onChangeMask,
    debugName,
    required = false,
    ...props
  } = rawprops

  const [isFocused, setFocus] = useState(false)
  const [editedState, setEdited] = useState(edited)

  const input = useRef<any>(null)
  const [textIsVisible, setTextVisible] = useBooleanToggle(false)
  const variantStyles = useDefaultComponentStyle<'u:TextInput', typeof TextInputStyles>('u:TextInput', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })
  const InputElement = masking ? MaskedTextInput : NativeTextInput

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
  const handleMaskChange = (masked, unmasked) => {
    if (onChangeText) onChangeText((typeof masking === 'object' && masking?.saveFormatted) ? masked : unmasked)
    if (onChangeMask) onChangeMask(masked, unmasked)
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

  const commonIconStyles = getNestedStylesByKey('icon', variantStyles)

  const leftIconStyles = getNestedStylesByKey('leftIcon', variantStyles)

  const rightIconStyles = getNestedStylesByKey('rightIcon', variantStyles)

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

  const visibilityToggleProps = visibilityToggle ? {
    onPress: () => setTextVisible(),
    icon: (textIsVisible ? 'input-visiblity:visible' : 'input-visiblity:hidden') as IconPlaceholder,
    debugName: `${debugName} toggle visibility`,
  } : {}

  return (
    <Touchable
      style={getStyles('wrapper')}
      debugName={debugName}
      onPress={handlePress}
      {...wrapperProps}
      android_ripple={null}
    >
      <InputLabel
        label={label}
        style={getStyles('label')}
        asteriskStyle={getStyles('requiredAsterisk')}
        wrapperStyle={getStyles('labelWrapper')}
        required={required}
      />
      <View style={getStyles('innerWrapper')} {...innerWrapperProps}>
        <InputIcon
          isFocused={isFocused}
          showError={showError}
          styles={leftIconStyles}
          commonStyles={commonIconStyles}
          debugName={`${debugName} left icon`}
          {...leftIcon}
        />
        {/* @ts-ignore */}
        <InputElement
          ref={input}
          secureTextEntry={password && !textIsVisible}
          onChange={(e) => masking ? onChange?.(e) : handleChange(e)}
          value={value}
          editable={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={StyleSheet.flatten(getStyles('placeholder'))?.color}
          selectionColor={StyleSheet.flatten(getStyles('selection'))?.color}
          includeRawValueInChangeText={true}
          {...props}
          {...(masking ? { onChangeText: handleMaskChange, type: masking?.type, refInput: (inputRef) => {
            input.current = inputRef
          } } : {})}
          style={getStyles('textField')}
        />
        <InputIcon
          isFocused={isFocused}
          showError={showError}
          styles={rightIconStyles}
          commonStyles={commonIconStyles}
          debugName={`${debugName} right icon`}
          {...rightIcon}
          {...visibilityToggleProps}
        />

      </View>
      <FormError message={error.message} style={getStyles('error')} />
    </Touchable>
  )
})

export const FormError = ({ message, ...props }) => {
  if (['number', 'string', 'undefined'].includes(typeof message)) {
    const text = message ? `${message.charAt(0).toUpperCase() + message.slice(1)}` : ' '
    return <Text text={text} variants={['p2', 'marginTop:1']} {...props} />
  }
  return message
}

type InputIconProps = {
  styles: StylesOf<InputIconComposition>
  commonStyles: StylesOf<InputIconComposition>
  isFocused: boolean
  showError: boolean
} & Omit<ActionIconProps, 'styles'>

export const InputIcon:React.FC<InputIconProps> = ({ styles, commonStyles, isFocused, showError, ...props }) => {
  if (!props.icon) return null

  function getStyles(key: ActionIconParts | '') {
    if (key === 'icon') key = ''
    const requestedStyles = [
      commonStyles[key],
      isFocused ? commonStyles[key + ':focus'] : {},
      showError ? commonStyles[key + ':error'] : {},
      styles[key],
      isFocused ? styles[key + ':focus'] : {},
      showError ? styles[key + ':error'] : {},
    ]
    return StyleSheet.flatten(requestedStyles)
  }
  const iconStyles = {
    icon: getStyles('icon'),
    touchablePressable: getStyles('touchablePressable'),
    touchableWrapper: getStyles('touchableWrapper'),
    touchableRipple: getStyles('touchableRipple'),
  }

  return <ActionIcon
    styles={iconStyles}
    {...props}
  />
}
