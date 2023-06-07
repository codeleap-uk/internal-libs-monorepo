import * as React from 'react'
import {
  ComponentVariants,
  yup,
  useDefaultComponentStyle,
  StylesOf,
  PropsOf,
  TypeGuards,
  useState,
  useRef,
  useValidate,
  FormTypes,
} from '@codeleap/common'
import { View } from '../View'
import { forwardRef, useImperativeHandle } from 'react'
import { NumberIncrementPresets, NumberIncrementComposition } from './styles'
import { InputBase, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import { MaskedTextInput } from '../../modules/textInputMask'
import { TextInput as NativeTextInput, TextInputProps as NativeTextInputProps, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { Touchable } from '../Touchable'

export * from './styles'

export type NumberIncrementProps = 
  Omit<InputBaseProps, 'styles' | 'variants'> &
  NativeTextInputProps & {
  variants?: ComponentVariants<typeof NumberIncrementPresets>['variants']
  styles?: StylesOf<NumberIncrementComposition>
  value: number
  onChange?: NativeTextInputProps['onChange']
  onChangeText?: NativeTextInputProps['onChangeText']
  validate?: FormTypes.ValidatorWithoutForm<string> | yup.SchemaOf<string>
  style?: PropsOf<typeof View>['style']
  max?: number
  min?: number
  step?: number
  editable?: boolean
  _error?: string
  placeholder?: string

  masking?: FormTypes.TextField['masking']
  // prefix?: NFProps['prefix']
  // suffix?: NFProps['suffix']
  // separator?: NFProps['thousandSeparator']
  // format?: PFProps['format']
  // mask?: PFProps['mask']
  // hasSeparator?: boolean
  // formatter?: () => null
} & Pick<PropsOf<typeof Touchable>, 'onPress'>

const defaultProps: Partial<NumberIncrementProps> = {
  max: 1000000000000000,
  min: 0,
  step: 1,
  editable: true,
}

export const NumberIncrement = forwardRef<NativeTextInput, NumberIncrementProps>((props, inputRef) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...NumberIncrement.defaultProps,
    ...props
  })

  const {
    variants = [],
    style = {},
    styles = {},
    value,
    disabled,
    onChangeText,
    max,
    min,
    step,
    editable,
    masking = null,
    validate,
    onPress,
    _error,
    ...textInputProps
  } = others

  const [isFocused, setIsFocused] = useState(false)

  const innerInputRef = useRef<NativeTextInput>(null)

  const validation = useValidate(value, validate)

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error

  const isMasked = !!masking

  const InputElement = isMasked ? MaskedTextInput : NativeTextInput

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

  const incrementDisabled = React.useMemo(() => {
    if (TypeGuards.isNumber(max) && (Number(value) >= max)) {
      return true
    }
    return false
  }, [value])

  const decrementDisabled = React.useMemo(() => {
    if (TypeGuards.isNumber(min) && (Number(value) <= min)) {
      return true
    }
    return false
  }, [value])

  const variantStyles = useDefaultComponentStyle<'u:NumberIncrement', typeof NumberIncrementPresets>(
    'u:NumberIncrement',
    {
      variants,
      styles,
      rootElement: 'wrapper',
    },
  )

  const inputTextStyle = React.useMemo(() => {
    return [
      variantStyles.input,
      isFocused && variantStyles['input:focus'],
      hasError && variantStyles['input:error'],
      disabled && variantStyles['input:disabled'],
    ]
  }, [disabled, isFocused, hasError])

  const placeholderTextColor = [
    [disabled, variantStyles['placeholder:disabled']],
    [hasError, variantStyles['placeholder:error']],
    [isFocused, variantStyles['placeholder:focus']],
    [true, variantStyles.placeholder],
  ].find(([x]) => x)?.[1]?.color

  const selectionColor = [
    [disabled, variantStyles['selection:disabled']],
    [!validation.isValid, variantStyles['selection:error']],
    [isFocused, variantStyles['selection:focus']],
    [true, variantStyles.selection],
  ].find(([x]) => x)?.[1]?.color

  const onChange = (newValue: number) => {
    // @ts-ignore
    if (onChangeText) onChangeText?.(newValue)
  }

  const handleChange = React.useCallback((action: 'increment' | 'decrement') => {
    handleFocus()

    if (action === 'increment' && !incrementDisabled) {
      const newValue = Number(value) + step
      onChange(newValue)
      return
    } else if (action === 'decrement' && !decrementDisabled) {
      const newValue = Number(value) - step
      onChange(newValue)
      return
    }
  }, [validation?.onInputBlurred, validation?.onInputFocused, value])

  const handleBlur = React.useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (TypeGuards.isNumber(max) && (value >= max)) {
      onChange(max)
    } else if (TypeGuards.isNumber(min) && (value <= min) || !value) {
      onChange(min)
    }

    validation?.onInputBlurred()
    setIsFocused(false)
    props.onBlur?.(e)
  }, [validation?.onInputBlurred, props.onBlur, value])

  const handleFocus = React.useCallback((e?: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation?.onInputFocused()
    setIsFocused(true)
    if (e) props.onFocus?.(e)
  }, [validation?.onInputFocused, props.onFocus])

  const handleChangeInput: NativeTextInputProps['onChangeText'] = (text) => {
    const value = Number(text.replace(/[^0-9]/g, ''))

    if (TypeGuards.isNumber(max) && (Number(value) >= max)) {
      onChange(max)
      return
    }

    onChange(Number(value))

    return value
  }

  const onPressInnerWrapper = () => {
    handleFocus()
    innerInputRef.current?.focus?.()
    if (onPress) onPress?.()
  }

  return (
    <InputBase
      {...inputBaseProps}
      error={hasError ? errorMessage : null}
      styles={{
        ...variantStyles,
        innerWrapper: [
          variantStyles.innerWrapper,
          editable && variantStyles['innerWrapper:cursor'],
        ],
      }}
      rightIcon={{
        name: 'plus' as any,
        disabled: disabled || incrementDisabled,
        onPress: () => handleChange('increment'),
        debounce: null,
        ...inputBaseProps.rightIcon,
      }}
      leftIcon={{
        name: 'minus' as any,
        disabled: disabled || decrementDisabled,
        onPress: () => handleChange('decrement'),
        debounce: null,
        ...inputBaseProps.leftIcon,
      }}
      style={style}
      disabled={disabled}
      focused={isFocused}
      innerWrapper={Touchable}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps || {}),
        onPress: onPressInnerWrapper,
      }}
    >
      {editable && !disabled ? (
        <InputElement
          keyboardType='numeric'
          allowFontScaling={false}
          editable={!disabled}
          placeholderTextColor={placeholderTextColor}
          value={String(value)}
          selectionColor={selectionColor}
          onChangeText={handleChangeInput}
          {...textInputProps}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={inputTextStyle}
          ref={innerInputRef}
          // {...maskingExtraProps}
        />
      ) : <Text text={String(value)} css={inputTextStyle} />}
    </InputBase>
  )
})

NumberIncrement.defaultProps = defaultProps
