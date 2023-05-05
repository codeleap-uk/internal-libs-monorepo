import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
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

type NativeTextInputProps = ComponentPropsWithoutRef<'input'> &
  ComponentPropsWithoutRef<'textarea'>

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
    ...textInputProps
  } = others
  
  const [secureTextEntry, toggleSecureTextEntry] = useBooleanToggle(true)

  const isMultiline = multiline

  const InputElement = isMultiline ? TextareaAutosize : 'input'

  const variantStyles = useDefaultComponentStyle<'TextInput', typeof TextInputPresets>('TextInput', {
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

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const _text = event.target.value

    props?.onChange(_text)
  }, [props.onChange])

  const isDisabled = !!inputBaseProps.disabled

  const placeholderTextColor = [
    [isDisabled, variantStyles['placeholder:disabled']],
    [!validation.isValid, variantStyles['placeholder:error']],
    [isFocused, variantStyles['placeholder:focus']],
    [true, variantStyles.placeholder],
  ].find(([x]) => x)?.[1]?.color

  const selectionColor = [
    [isDisabled, variantStyles['selection:disabled']],
    [!validation.isValid, variantStyles['selection:error']],
    [isFocused, variantStyles['selection:focus']],
    [true, variantStyles.selection],
  ].find(([x]) => x)?.[1]?.color

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

  const hasMultipleLines = isMultiline && String(value)?.includes('\n')

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
        allowFontScaling={false}
        editable={!isPressable && !isDisabled}
        {...buttonModeProps}
        placeholderTextColor={placeholderTextColor}
        selectionColor={selectionColor}
        secureTextEntry={password && secureTextEntry}
        {...textInputProps}
        value={value}
        onChange={(e) => handleChange(e)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={[
          variantStyles.textField,
          isMultiline && variantStyles['input:multiline'],
          isFocused && variantStyles['input:focused'],
          !validation.isValid && variantStyles['input:error'],
          isDisabled && variantStyles['input:disabled'],
          hasMultipleLines && variantStyles['input:hasMultipleLines'],
        ]}
        ref={innerInputRef}
      />
    </InputBase>
  )
})
