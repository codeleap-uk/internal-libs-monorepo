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
import InputMask from 'react-input-mask'
import { Touchable, TouchableProps } from '../Touchable'
import { StylesOf } from '../../types/utility'
import { InputBase, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { TextInputPresets } from './styles'
import { getMaskInputProps, TextInputMaskingProps } from './mask'

export * from './styles'
export * from './mask'

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
    onChangeText?: (value: string) => void
    caretColor?: string
    focused?: boolean
    _error?: boolean
    rows?: number
    masking?: TextInputMaskingProps
  }

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, inputRef) => {
  const innerInputRef = useRef<HTMLInputElement>(null)

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
    focused,
    _error,
    masking = null,
    ...textInputProps
  } = others

  const [_isFocused, setIsFocused] = useState(false)

  const isFocused = _isFocused || focused

  const [secureTextEntry, toggleSecureTextEntry] = useBooleanToggle(true)

  const isMultiline = multiline

  const isMasked = !TypeGuards.isNil(masking)
  const maskProps = isMasked ? getMaskInputProps({ masking }) : null

  const InputElement = isMasked ? InputMask : isMultiline ? TextareaAutosize : 'input'

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
      isTextInput: true,
    }
  }, [!!innerInputRef?.current?.focus])

  const isPressable = TypeGuards.isFunction(onPress)

  const validation = useValidate(
    value,
    TypeGuards.isFunction(maskProps?.validator) ? maskProps?.validator : validate,
  )

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
    const _text = event?.target?.value

    const _value = isMasked && maskProps?.notSaveFormatted
      ? maskProps?.getRawValue(_text)
      : _text

    if (props?.onChange) props?.onChange(event)
    if (props?.onChangeText) props?.onChangeText(_value)
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
    caretHidden: true,
  } : {}
  const rows = textInputProps?.rows ?? (
    isMultiline ? 2 : undefined
  )
  const hasMultipleLines = isMultiline && (String(value)?.includes('\n') || !!rows)

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error

  const placeholderStyles = [
    variantStyles.placeholder,
    isFocused && variantStyles['placeholder:focus'],
    hasError && variantStyles['placeholder:error'],
    isDisabled && variantStyles['placeholder:disabled'],
  ]

  const selectionStyles = [
    variantStyles.selection,
    isFocused && variantStyles['selection:focus'],
    hasError && variantStyles['selection:error'],
    isDisabled && variantStyles['selection:disabled'],
  ]

  const secureTextProps = (password && secureTextEntry) && {
    type: 'password',
  }

  const caretColorStyle = (caretColor || buttonModeProps.caretHidden) && {
    caretColor: buttonModeProps.caretHidden ? 'transparent' : caretColor,
  }

  const inputBaseAction = isPressable ? 'onPress' : 'onClick'

  const _wrapperOnInputFocus = {
    [inputBaseAction]: () => {
      innerInputRef.current?.focus?.()
    },
  }

  return (
    <InputBase
      innerWrapper={isPressable ? Touchable : undefined}
      {...inputBaseProps}
      debugName={debugName}
      error={hasError ? errorMessage : null}
      styles={{
        ...variantStyles,
        innerWrapper: [
          variantStyles.innerWrapper,
          isMultiline && variantStyles['innerWrapper:multiline'],
          hasMultipleLines && variantStyles['innerWrapper:hasMultipleLines'],
        ],
      }}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps || {}),
        [inputBaseAction]: () => {
          // @ts-ignore
          if (isMasked) innerInputRef.current?.onFocus?.()
          innerInputRef.current?.focus?.()
          if (isPressable) onPress?.()
        },
        debugName,
      }}
      rightIcon={rightIcon}
      focused={isFocused}
      wrapperProps={{
        ...(inputBaseProps.wrapperProps || {}),
        ..._wrapperOnInputFocus,
      }}
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
          hasError && variantStyles['input:error'],
          isDisabled && variantStyles['input:disabled'],
          hasMultipleLines && variantStyles['input:hasMultipleLines'],
          {
            '&::placeholder': placeholderStyles,
          },
          {
            '&::selection': selectionStyles,
          },
          {
            '&:focus': [
              { outline: 'none', borderWidth: 0, borderColor: 'transparent' },
              isFocused && variantStyles['input:focus'],
              caretColorStyle,
            ],
          },
        ]}
        {...maskProps}
        ref={innerInputRef}
      />
    </InputBase>
  )
})
