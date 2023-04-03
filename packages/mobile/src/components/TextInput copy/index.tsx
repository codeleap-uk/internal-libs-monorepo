import * as React from 'react'
import {
  ComponentVariants,
  FormTypes,
  getNestedStylesByKey,
  IconPlaceholder,

  TypeGuards,

  useBooleanToggle,
  useDefaultComponentStyle,
  useValidate,
} from '@codeleap/common'
import { ComponentPropsWithoutRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Text, TextProps } from '../Text'
import { View, ViewProps } from '../View'
import { StylesOf } from '../../types'
import { NativeSyntheticEvent, StyleSheet, TextInput as NativeTextInput, TextInputChangeEventData } from 'react-native'
import { Touchable, TouchableProps } from '../Touchable'
import { MaskedTextInput, TextInputMaskProps } from '../../modules/textInputMask'
import { InputLabel } from '../InputLabel'

export * from './styles'

import {
  InputIconComposition,
  TextInputComposition,
  TextInputPresets,
} from './styles'
import { ActionIcon, ActionIconParts, ActionIconProps } from '../ActionIcon'

type NativeProps = ComponentPropsWithoutRef<typeof NativeTextInput>

type SubtitleProps = {
  errorProps: TextProps
  styles: Record<'wrapper'|'error'|'subtitle', any>
}

export type TextInputProps =
  Partial<TextInputMaskProps> &
  ComponentVariants<typeof TextInputPresets> &
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
    subtitle?: string | ((props: SubtitleProps) => React.ReactElement)
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
    masking,
    subtitle = '',
    onChangeMask,
    debugName,
    required = false,
    ...props
  } = rawprops

  const [isFocused, setFocus] = useState(false)
  

  const input = useRef<any>(null)
  const maskInputRef = useRef<any>(null)
  const [textIsVisible, setTextVisible] = useBooleanToggle(false)
  const variantStyles = useDefaultComponentStyle<'u:TextInput', typeof TextInputPresets>('u:TextInput', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })
  const InputElement = masking ? MaskedTextInput : NativeTextInput

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    
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

    if (onChangeText) onChangeText(masking?.saveFormatted ? masked : masked)
    if (onChangeMask) onChangeMask(masked, unmasked)
  }
  const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = event.nativeEvent.text

    if (onChange) onChange(event)
    if (onChangeText) onChangeText(text)
  }

  useImperativeHandle(inputRef, () => {
    return {
      ...input.current,
      focus: () => {
        input.current?.focus?.()
      },
      isTextInput: true,
    }

  }, [!!masking, !!input?.current?.focus])

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
    return StyleSheet.flatten(requestedStyles)
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

  const subtitleStyles = {
    error: getStyles('error'),
    wrapper: getStyles('subtitleWrapper'),
    subtitle: getStyles('subtitle'),

  }
  const errorProps = { text: error.message, style: subtitleStyles.error }

  const subtitleContent = TypeGuards.isFunction(subtitle) ? subtitle({ styles: subtitleStyles, errorProps }) : <View style={subtitleStyles.wrapper}>
    <FormError {...errorProps}/>
    {TypeGuards.isString(subtitle) ? <Text text={subtitle} style={subtitleStyles.subtitle}/> : (subtitle || null)}
  </View>
  return (
    <Touchable
      style={getStyles('wrapper')}
      debugName={debugName}
      onPress={handlePress}
      noFeedback
      android_ripple={null}
      {...wrapperProps}
    >
      <InputLabel
        label={label}
        styles={{
          wrapper: getStyles('labelWrapper'),
          asterisk: getStyles('labelAsterisk'),
          text: getStyles('labelText'),
        }}
        required={required}
      />
      <View style={getStyles('innerWrapper')} {...innerWrapperProps}>
        <InputIcon
          isFocused={isFocused}
          showError={showError}
          styles={leftIconStyles}
          commonStyles={commonIconStyles}
          debugName={`${debugName} left icon`}
          onPress={() => {
            input?.current?.focus?.()
          }}
          noFeedback={!leftIcon?.onPress}
          {...leftIcon}
        />
        {/* @ts-ignore */}
        <InputElement

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
          {...masking}
          {...(!!masking ? {
            onChangeText: handleMaskChange,
            ref: maskInputRef,
            refInput: (inputRef) => {
              // console.log(inputRef)
              if (!!inputRef) {
                input.current = inputRef

              }
            },
            ...masking,
          } : {
            ref: input,
          })}
          style={getStyles('textField')}
        />
        <InputIcon
          isFocused={isFocused}
          showError={showError}
          styles={rightIconStyles}
          commonStyles={commonIconStyles}
          debugName={`${debugName} right icon`}
          onPress={() => {}}
          noFeedback={!rightIcon?.onPress}
          {...rightIcon}
          {...visibilityToggleProps}
        />

      </View>
      {subtitleContent}
    </Touchable>
  )
})

export const FormError:React.FC<TextProps> = ({ text, ...props }) => {
  let message = text
  if (TypeGuards.isNumber(message)) {
    message = message.toString()
  }
  if (typeof message === 'undefined') {
    message = ''
  }

  if (TypeGuards.isString(message)) {
    const text = message ? `${message.charAt(0).toUpperCase() + message.slice(1)}` : ' '
    return <Text text={text} {...props} />
  }
  return <>
    {text}
  </>
}

type InputIconProps = {
  styles: StylesOf<InputIconComposition>
  commonStyles: StylesOf<InputIconComposition>
  isFocused: boolean
  showError: boolean
} & Omit<ActionIconProps, 'styles'>

export const InputIcon:React.FC<InputIconProps> = ({ styles, commonStyles, isFocused, showError, ...props }) => {
  if (!props.icon) return null

  function getStyles(k: ActionIconParts | '') {
    let key = k
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
    touchableFeedback: getStyles('touchableFeedback'),
  }

  return <ActionIcon
    styles={iconStyles}
    {...props}
  />
}
