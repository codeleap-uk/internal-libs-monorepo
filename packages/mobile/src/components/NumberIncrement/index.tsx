import React from 'react'
import { TypeGuards } from '@codeleap/types'
import { forwardRef } from 'react'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import { MaskedTextInput } from '../../modules/textInputMask'
import { TextInput as NativeTextInput } from 'react-native'
import { Touchable } from '../Touchable'
import { NumberIncrementProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import CurrencyInput from 'react-native-currency-input'
import { useInputBasePartialStyles } from '../InputBase/useInputBasePartialStyles'
import { useNumberIncrement } from './useNumberIncrement'

export * from './styles'
export * from './types'

const defaultParseValue = (_value: string) => {
  const value = _value?.length > 0 ? _value : '0'

  const parsedValue = value?.replace(/[^\d.]/g, '')

  return parseFloat(parsedValue)
}

export const NumberIncrement = forwardRef<NativeTextInput, NumberIncrementProps>((props, inputRef) => {
  const allProps = {
    ...NumberIncrement.defaultProps,
    ...props,
  }

  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(allProps)

  const {
    style,
    disabled,
    onChangeMask,
    step,
    editable,
    onPress,
    forceError,
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
    field,
    ...textInputProps
  } = others

  const styles = useStylesFor(NumberIncrement.styleRegistryName, style)

  const {
    fieldHandle,
    validation,
    min,
    max,
    innerInputRef,
    wrapperRef,
    isFocused,
    hasValue,
    hasError,
    incrementDisabled,
    decrementDisabled,
    handleChangeInput,
    handleChange,
    handleMaskChange,
    handleBlur,
    handleFocus,
  } = useNumberIncrement(allProps)

  const isFormatted = TypeGuards.isFunction(formatter)

  const hasMaskProps = [masking, mask].some(v => !!v)
  const hasCurrencyProps = [prefix, suffix, delimiter, separator, precision].some(v => !!v)

  const isCurrency = hasCurrencyProps
  const isMasked = hasMaskProps && !isFormatted && !isCurrency

  const InputElement: any = isMasked ? MaskedTextInput : isCurrency ? CurrencyInput : NativeTextInput

  const partialStyles = useInputBasePartialStyles(
    styles,
    [['input', false], 'placeholder', 'selection'],
    {
      disabled,
      error: !!hasError,
      focus: isFocused,
      typed: hasValue,
    }
  )

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
    value: fieldHandle?.value,
    onChangeText: null,
    onChangeValue: fieldHandle.setValue,
    prefix: prefix,
    separator: separator ?? '.',
    suffix: suffix,
    delimiter: delimiter ?? ',',
    minValue: min,
    maxValue: max,
    precision,
  } : {}

  const onPressInnerWrapper = () => {
    handleFocus(null)
    if (editable) innerInputRef.current?.focus?.()
    if (onPress) onPress?.()
  }

  return (
    <InputBase
      {...inputBaseProps}
      ref={wrapperRef}
      error={hasError ? validation.message || forceError : null}
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
          placeholderTextColor={partialStyles?.placeholder?.color}
          value={isFormatted ? formatter(fieldHandle?.value) : String(fieldHandle?.value)}
          selectionColor={partialStyles?.selection?.color}
          onChangeText={handleChangeInput}
          {...textInputProps}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={[styles.input, partialStyles.input]}
          ref={innerInputRef}
          {...maskingExtraProps}
          {...currencyExtraProps}
        />
      ) : (
        <Text
          text={isFormatted ? formatter(fieldHandle?.value) : String(fieldHandle?.value)}
          style={[styles.input, partialStyles.input]}
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
