import React, { useState, useRef } from 'react'
import { TypeGuards } from '@codeleap/types'
import { useValidate } from '@codeleap/form'
import { forwardRef, useImperativeHandle } from 'react'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import { MaskedTextInput } from '../../modules/textInputMask'
import { TextInput as NativeTextInput, TextInputProps as NativeTextInputProps, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { Touchable } from '../Touchable'
import { useActionValidate } from './utils'
import { NumberIncrementProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import CurrencyInput from 'react-native-currency-input'

export * from './styles'
export * from './types'

const MAX_VALID_DIGITS = 1000000000000000 // maximum number of digits that the input supports to perform operations

const defaultParseValue = (_value: string) => {
  const value = _value?.length > 0 ? _value : '0'

  const parsedValue = value?.replace(/[^\d.]/g, '')

  return parseFloat(parsedValue)
}

export const NumberIncrement = forwardRef<NativeTextInput, NumberIncrementProps>((props, inputRef) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...NumberIncrement.defaultProps,
    ...props,
  })

  const {
    style,
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
    precision,
    ...textInputProps
  } = others

  const [isFocused, setIsFocused] = useState(false)

  const innerInputRef = useRef<NativeTextInput>(null)

  const actionValidation = useActionValidate(validate)
  const validation = useValidate(value, validate)

  const hasError = !validation.isValid || _error || !actionValidation?.isValid
  const errorMessage = validation.message || _error || actionValidation?.message

  const isFormatted = TypeGuards.isFunction(formatter)

  const hasMaskProps = [masking, mask].some(v => !!v)
  const hasCurrencyProps = [prefix, suffix, delimiter, separator, precision].some(v => !!v)

  const isCurrency = hasCurrencyProps
  const isMasked = hasMaskProps && !isFormatted && !isCurrency

  const InputElement: any = isMasked ? MaskedTextInput : isCurrency ? CurrencyInput : NativeTextInput

  const hasValue = TypeGuards.isString(value) ? value.length > 0 : !TypeGuards.isNil(value)

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

  const styles = useStylesFor(NumberIncrement.styleRegistryName, style)

  const inputTextStyle = React.useMemo(() => ([
    styles.input,
    isFocused && styles['input:focus'],
    hasError && styles['input:error'],
    disabled && styles['input:disabled'],
    hasValue && styles['input:typed'],
  ]), [disabled, isFocused, hasError])

  const placeholderTextColor = [
    [disabled, styles['placeholder:disabled']],
    [hasError, styles['placeholder:error']],
    [isFocused, styles['placeholder:focus']],
    [hasValue, styles['placeholder:typed']],
    [true, styles.placeholder],
    // @ts-expect-error
  ].find(([x]) => x)?.[1]?.color

  const selectionColor = [
    [disabled, styles['selection:disabled']],
    [!validation.isValid, styles['selection:error']],
    [isFocused, styles['selection:focus']],
    [hasValue, styles['selection:typed']],
    [true, styles.selection],
    // @ts-expect-error
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
    if (TypeGuards.isNumber(max) && (Number(value) >= max)) {
      onChange(max)
    } else if (TypeGuards.isNumber(min) && (Number(value) <= min) || TypeGuards.isNil(value) || String(value)?.length <= 0) {
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

  const currencyExtraProps = isCurrency ? {
    value,
    onChangeText: null,
    onChangeValue: onChange,
    prefix: prefix,
    separator: separator ?? '.',
    suffix: suffix,
    delimiter: delimiter ?? ',',
    minValue: min,
    maxValue: max,
    precision,
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
      style={styles}
      rightIcon={TypeGuards.isComponentOrElement(inputBaseProps.rightIcon) ? inputBaseProps.rightIcon : {
        name: 'plus' as AppIcon,
        disabled: disabled || incrementDisabled || !editable,
        onPress: () => handleChange('increment'),
        debounce: actionDebounce,
        ...inputBaseProps.rightIcon,
      }}
      leftIcon={TypeGuards.isComponentOrElement(inputBaseProps.leftIcon) ? inputBaseProps.leftIcon : {
        name: 'minus' as AppIcon,
        disabled: disabled || decrementDisabled || !editable,
        onPress: () => handleChange('decrement'),
        debounce: actionDebounce,
        ...inputBaseProps.leftIcon,
      }}
      disabled={disabled}
      focused={isFocused}
      innerWrapper={Touchable}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps || {}),
        rippleDisabled: true,
        onPress: onPressInnerWrapper,
      }}
      hasValue={hasValue}
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
          {...currencyExtraProps}
        />
      ) : (
        <Text
          text={isFormatted ? formatter(value) : String(value)}
          style={inputTextStyle}
        />
      )}
    </InputBase>
  )
}) as StyledComponentWithProps<NumberIncrementProps>

NumberIncrement.styleRegistryName = 'NumberIncrement'
NumberIncrement.elements = [...InputBase.elements, 'input', 'placeholder', 'selection']
NumberIncrement.rootElement = 'wrapper'

NumberIncrement.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return NumberIncrement as (props: StyledComponentProps<NumberIncrementProps, typeof styles>) => IJSX
}

NumberIncrement.defaultProps = {
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
} as Partial<NumberIncrementProps>

MobileStyleRegistry.registerComponent(NumberIncrement)
