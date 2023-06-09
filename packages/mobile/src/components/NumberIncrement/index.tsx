import * as React from 'react'
import {
  useDefaultComponentStyle,
  TypeGuards,
  useState,
  useRef,
  useValidate,
  IconPlaceholder,
} from '@codeleap/common'
import { forwardRef, useImperativeHandle } from 'react'
import { NumberIncrementPresets } from './styles'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import { MaskedTextInput } from '../../modules/textInputMask'
import { TextInput as NativeTextInput, TextInputProps as NativeTextInputProps, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { Touchable } from '../Touchable'
import { useActionValidate } from './utils'
import { NumberIncrementProps } from './types'

export * from './styles'
export * from './types'

const MAX_VALID_DIGITS = 1000000000000000 // maximum number of digits that the input supports to perform operations

const defaultParseValue = (_value: string) => {
  const value = _value?.length > 0 ? _value : '0'

  const parsedValue = value?.replace(/[^\d.]/g, '')

  return parseFloat(parsedValue)
}

const defaultProps: Partial<NumberIncrementProps> = {
  max: MAX_VALID_DIGITS,
  min: 0,
  step: 1,
  editable: true,
  separator: null,
  formatter: null,
  parseValue: defaultParseValue,
  delimiter: null,
  mask: null,
  masking: null,
  timeoutActionFocus: 300,
  actionPressAutoFocus: true,
  actionDebounce: null,
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
    onChangeMask,
    max,
    min,
    step,
    editable,
    validate,
    onPress,
    _error,
    masking,
    separator,
    prefix,
    suffix,
    delimiter,
    formatter,
    actionPressAutoFocus,
    parseValue,
    timeoutActionFocus,
    mask,
    actionDebounce,
    ...textInputProps
  } = others

  const [isFocused, setIsFocused] = useState(false)

  const innerInputRef = useRef<NativeTextInput>(null)

  const actionValidation = useActionValidate(validate)
  const validation = useValidate(value, validate)

  const hasError = !validation.isValid || _error || !actionValidation?.isValid
  const errorMessage = validation.message || _error || actionValidation?.message

  const isFormatted = TypeGuards.isFunction(formatter)

  const hasMaskProps = [masking, prefix, suffix, delimiter, separator, mask].some(v => !!v)

  const isMasked = hasMaskProps && !isFormatted

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

  const inputTextStyle = React.useMemo(() => ([
    variantStyles.input,
    isFocused && variantStyles['input:focus'],
    hasError && variantStyles['input:error'],
    disabled && variantStyles['input:disabled'],
  ]), [disabled, isFocused, hasError])

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
    actionValidation.onAction(newValue)
    // @ts-ignore
    if (onChangeText) onChangeText?.(newValue)
  }

  const actionTimeoutRef = useRef(null)

  const clearActionTimeoutRef = React.useCallback(() => {
    if (actionTimeoutRef.current !== null) {
      clearTimeout(actionTimeoutRef.current)
      actionTimeoutRef.current = null
    }
  }, [actionTimeoutRef.current])

  const handleChange = React.useCallback((action: 'increment' | 'decrement') => {
    if (actionPressAutoFocus) setIsFocused(true)
    clearActionTimeoutRef()

    if (action === 'increment' && !incrementDisabled) {
      const newValue = Number(value) + step
      onChange(newValue)
    } else if (action === 'decrement' && !decrementDisabled) {
      const newValue = Number(value) - step
      onChange(newValue)
    }

    if (actionPressAutoFocus) {
      actionTimeoutRef.current = setTimeout(() => { 
        setIsFocused(false)
      }, timeoutActionFocus)
    }
  }, [value])

  const handleBlur = React.useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (TypeGuards.isNumber(max) && (value >= max)) {
      onChange(max)
    } else if (TypeGuards.isNumber(min) && (value <= min) || !value || String(value)?.length <= 0) {
      onChange(min)
    }

    validation?.onInputBlurred()
    setIsFocused(false)
    props?.onBlur?.(e)
  }, [validation?.onInputBlurred, props?.onBlur, value])

  const handleFocus = React.useCallback((e?: NativeSyntheticEvent<TextInputFocusEventData>) => {
    validation?.onInputFocused()
    clearActionTimeoutRef()
    if (editable) setIsFocused(true)
    if (e) props?.onFocus?.(e)
  }, [validation?.onInputFocused, props?.onFocus])

  const handleChangeInput: NativeTextInputProps['onChangeText'] = (text) => {
    const value = parseValue(text)

    if (value >= MAX_VALID_DIGITS) {
      onChange(MAX_VALID_DIGITS)
      return MAX_VALID_DIGITS
    }

    onChange(value)
    return value
  }

  const handleMaskChange = (masked: string, unmasked: any) => {
    handleChangeInput?.(masked)
    if (onChangeMask) onChangeMask(masked, unmasked)
  }

  const maskingExtraProps = isMasked ? {
    type: TypeGuards.isNil(mask) ? 'money' : 'custom',
    onChangeText: handleMaskChange,
    ...masking,
    options: {
      unit: prefix,
      separator: separator ?? '.',
      suffixUnit: suffix,
      delimiter: delimiter ?? ',',
      mask: mask,
      ...masking?.options,
    },
    ref: null,
    refInput: (inputRef) => {
      if (!!inputRef) {
        innerInputRef.current = inputRef
      }
    },
  } : {}

  const onPressInnerWrapper = () => {
    handleFocus()
    if (editable) innerInputRef.current?.focus?.()
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
        ],
      }}
      rightIcon={{
        name: 'plus' as IconPlaceholder,
        disabled: disabled || incrementDisabled,
        onPress: () => handleChange('increment'),
        debounce: actionDebounce,
        ...inputBaseProps.rightIcon,
      }}
      leftIcon={{
        name: 'minus' as IconPlaceholder,
        disabled: disabled || decrementDisabled,
        onPress: () => handleChange('decrement'),
        debounce: actionDebounce,
        ...inputBaseProps.leftIcon,
      }}
      style={style}
      disabled={disabled}
      focused={isFocused}
      innerWrapper={Touchable}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps || {}),
        rippleDisabled: true,
        onPress: onPressInnerWrapper,
      }}
    >
      {editable && !disabled ? (
        <InputElement
          keyboardType='numeric'
          textAlign='center'
          textAlignVertical='center'
          allowFontScaling={false}
          editable={!disabled}
          placeholderTextColor={placeholderTextColor}
          value={isFormatted ? formatter(value) : String(value)}
          selectionColor={selectionColor}
          onChangeText={handleChangeInput}
          {...textInputProps}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={inputTextStyle}
          ref={innerInputRef}
          {...maskingExtraProps}
        />
      ) : (
        <Text 
          text={isFormatted ? formatter(value) : String(value)} 
          style={inputTextStyle} 
        />
      )}
    </InputBase>
  )
})

NumberIncrement.defaultProps = defaultProps
