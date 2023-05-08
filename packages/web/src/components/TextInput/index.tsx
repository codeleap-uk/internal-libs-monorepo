import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
  onUpdate,
  TextInputComposition,
  TypeGuards,
  useBooleanToggle,
  useDefaultComponentStyle,
  useValidate,
  yup,
} from '@codeleap/common'
import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import { Touchable, TouchableProps } from '../Touchable'

import { StylesOf } from '../../types/utility'
import { InputBase, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { TextInputPresets } from './styles'

export * from './styles'

type NativeTextInputProps = ComponentPropsWithoutRef<'input'>

export type TextInputProps = 
  Omit<InputBaseProps, 'styles' | 'variants'> &
  Omit<NativeTextInputProps, 'value'|'crossOrigin'> & {
    styles?: StylesOf<TextInputComposition>
    password?: boolean
    validate?: FormTypes.ValidatorWithoutForm<string> | yup.SchemaOf<string>
    debugName?: string
    visibilityToggle?: boolean
    variants?: ComponentVariants<typeof TextInputPresets>['variants']
    value?: NativeTextInputProps['value']
    multiline?: boolean
    onPress?: TouchableProps['onPress']
    onChangeText?: NativeTextInputProps['onChange']
    caretColor?: string
  }

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, inputRef) => {
  const innerInputRef = useRef<HTMLInputElement>(null)

  const [isFocused, setIsFocused] = useState(false)

  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(props)

  const {
    variants,
    styles,
    value,
    validate,
    debugName,
    visibilityToggle,
    password,
    onPress,
    multiline,
    caretColor,
    ...textInputProps
  } = others
  
  const [secureTextEntry, toggleSecureTextEntry] = useBooleanToggle(true)

  const isMultiline = multiline

  const InputElement = isMultiline ? TextareaAutosize : 'input'

  const variantStyles = useDefaultComponentStyle<'u:TextInput', typeof TextInputPresets>('u:TextInput', {
    variants,
    styles,
  })

  useImperativeHandle(inputRef, () => {
    return { 
      ...innerInputRef.current, 
      focus: () => {
        innerInputRef.current?.focus?.()
      }, 
      isTextInput: true 
    }
  }, [!!innerInputRef?.current?.focus])

  const isPressable = TypeGuards.isFunction(onPress)

  const validation = useValidate(value, validate)

  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement, Element>) => {
    validation?.onInputBlurred()
    setIsFocused(false)
    props?.onBlur?.(e)
  }, [validation?.onInputBlurred, props?.onBlur])

  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement, Element>) => {
    validation?.onInputFocused()
    setIsFocused(true)
    props?.onFocus?.(e)
  }, [validation?.onInputFocused, props?.onFocus])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _text = event.target.value
    
    if (props?.onChange) props?.onChange(_text)
    if (props?.onChangeText) props?.onChangeText(_text)
  }

  const isDisabled = !!inputBaseProps.disabled

  const visibilityToggleProps = visibilityToggle ? {
    onPress: toggleSecureTextEntry,
    icon: (secureTextEntry ? 'input-visiblity:hidden' : 'input-visiblity:visible') as IconPlaceholder,
    debugName: `${debugName} toggle visibility`,
  } : null

  const rightIcon = inputBaseProps?.rightIcon ?? visibilityToggleProps

  const buttonModeProps = isPressable ? {
    editable: false,
    caretHidden: true
  } : {}

  const hasMultipleLines = isMultiline && (String(value)?.includes('\n') || textInputProps?.rows)

  const placeholderStyles = [
    variantStyles.placeholder,
    isFocused && variantStyles['placeholder:focus'],
    !validation.isValid &&variantStyles['placeholder:error'],
    isDisabled && variantStyles['placeholder:disabled']
  ]

  const selectionStyles = [
    variantStyles.selection,
    isFocused && variantStyles['selection:focus'],
    !validation.isValid &&variantStyles['selection:error'],
    isDisabled && variantStyles['selection:disabled']
  ]

  const secureTextProps = password && secureTextEntry && {
    type: 'password'
  }

  const caretColorStyle = (caretColor || buttonModeProps.caretHidden) && {
    caretColor: buttonModeProps.caretHidden ? 'transparent' : caretColor,
  }

  return (
    <InputBase
      innerWrapper={isPressable ? Touchable : undefined}
      {...inputBaseProps}
      debugName={debugName}
      error={validation.isValid ? null : validation.message}
      styles={{
        ...variantStyles,
        innerWrapper: [
          variantStyles.innerWrapper,
          isMultiline && variantStyles['innerWrapper:multiline'],
          hasMultipleLines && variantStyles['innerWrapper:hasMultipleLines'],
        ],
      }}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps  || {}),
        onPress,
        debugName,
      }}
      rightIcon={rightIcon}
      focused={isFocused}
    >
      <InputElement
        editable={`${!isPressable && !isDisabled}`}
        {...buttonModeProps}
        {...secureTextProps}
        {...textInputProps}
        value={value}
        onChange={(e) => handleChange(e)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        css={[
          variantStyles.input,
          isMultiline && variantStyles['input:multiline'],
          isFocused && variantStyles['input:focus'],
          !validation.isValid && variantStyles['input:error'],
          isDisabled && variantStyles['input:disabled'],
          hasMultipleLines && variantStyles['input:hasMultipleLines'],
          {
            '&::placeholder': placeholderStyles
          },
          {
            '&::selection': selectionStyles
          },
          {
            '&:focus':  [
              { outline: 'none', borderWidth: 0, borderColor: 'transparent' },
              isFocused && variantStyles['input:focus'],
              caretColorStyle,
            ],
          }
        ]}
        ref={innerInputRef}
      />
    </InputBase>
  )
})
