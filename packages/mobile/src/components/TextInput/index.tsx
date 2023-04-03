import * as React from 'react'
import {
  ComponentVariants,
  FormTypes,
  PropsOf,
  TypeGuards,
  useDefaultComponentStyle,
  useValidate,
  yup,
  useState,
  useBooleanToggle,
  IconPlaceholder,
} from '@codeleap/common'
import { forwardRef, useImperativeHandle } from 'react'
import { StylesOf } from '../../types'
import { StyleSheet, TextInput as NativeTextInput, TextInputProps as NativeTextInputProps, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { InputBase, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { TextInputComposition, TextInputPresets } from './styles'
import { Touchable } from '../Touchable'
import { MaskedTextInput, TextInputMaskProps } from '../../modules/textInputMask'

export * from './styles'

export type TextInputProps =
  Omit<InputBaseProps, 'styles' | 'variants'> &
  NativeTextInputProps &
  ComponentVariants<typeof TextInputPresets> &
  Omit<
    PropsOf<typeof Touchable>,
    'styles' | 'variants'
  > &
  {
    styles?: StylesOf<TextInputComposition>
    validate?: FormTypes.ValidatorFunctionWithoutForm | yup.SchemaOf<string>
    debugName: string
    visibilityToggle?: boolean
    masking?: FormTypes.TextField['masking']
    onChangeMask?: TextInputMaskProps['onChangeText']
  }

export const TextInput = forwardRef<NativeTextInput, TextInputProps>((props, inputRef) => {

  const innerInputRef = React.useRef<NativeTextInput>(null)

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
    visibilityToggle = false,
    masking,
    onChangeMask,
    ...textInputProps
  } = others

  const [secureTextEntry, toggleSecureTextEntry] = useBooleanToggle(false)

  const isMasked = !!masking

  const InputElement = isMasked ? MaskedTextInput : NativeTextInput

  const variantStyles = useDefaultComponentStyle<'u:TextInput', typeof TextInputPresets>('u:TextInput', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

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

  const isPressable = TypeGuards.isFunction(props.onPress)

  const validation = useValidate(value, validate)

  const handleBlur = React.useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation.onInputBlurred()
    setIsFocused(false)
    props.onBlur?.(e)
  }, [validation.onInputBlurred, props.onBlur])

  const handleFocus = React.useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation.onInputFocused()
    setIsFocused(true)
    props.onFocus?.(e)
  }, [validation.onInputFocused, props.onFocus])

  const handleMaskChange = (masked, unmasked) => {

    if (textInputProps.onChangeText) textInputProps.onChangeText(masking?.saveFormatted ? masked : masked)
    if (onChangeMask) onChangeMask(masked, unmasked)
  }

  const isMultiline = textInputProps.multiline
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
    icon: (secureTextEntry ? 'input-visiblity:visible' : 'input-visiblity:hidden') as IconPlaceholder,
    debugName: `${debugName} toggle visibility`,
  } : null

  const rightIcon = inputBaseProps?.rightIcon ?? visibilityToggleProps

  const maskingExtraProps = isMasked ? {
    onChangeText: handleMaskChange,
    ref: null,

    refInput: (inputRef) => {
      // console.log(inputRef)
      if (!!inputRef) {
        innerInputRef.current = inputRef

      }
    },
    ...masking,
  } : {}

  return <InputBase
    innerWrapper={isPressable ? Touchable : undefined}
    {...inputBaseProps}
    error={validation.isValid ? null : validation.message}
    styles={{
      ...variantStyles,
      innerWrapper: [
        variantStyles.innerWrapper,
        isMultiline && variantStyles['innerWrapper:multiline'],
      ],
    }}
    innerWrapperProps={{
      onPress: props.onPress,
      ...inputBaseProps.innerWrapperProps,
      debugName,
    }}
    rightIcon={rightIcon}
    focused={isFocused}
  >
    <InputElement
      textAlignVertical='center'
      allowFontScaling={false}
      editable={!isPressable && !isDisabled}
      pointerEvents={isPressable ? 'none' : 'auto'}
      placeholderTextColor={placeholderTextColor}
      value={value}
      selectionColor={selectionColor}
      secureTextEntry={secureTextEntry}
      {...textInputProps}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={[
        variantStyles.input,
        isMultiline && variantStyles['input:multiline'],
        isFocused && variantStyles['input:focused'],
        !validation.isValid && variantStyles['input:error'],
        isDisabled && variantStyles['input:disabled'],
      ]}
      ref={innerInputRef}
      {...maskingExtraProps}
    />
  </InputBase>
})
