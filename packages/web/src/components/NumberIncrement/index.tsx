import * as React from 'react'
import { TypeGuards } from '@codeleap/types'
import { onUpdate, useState, useRef } from '@codeleap/hooks'
import { useValidate } from '@codeleap/deprecated'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import { PatternFormat, NumericFormat, NumericFormatProps as NFProps, NumberFormatBase } from 'react-number-format'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { NumberIncrementProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

export * from './types'
export * from './styles'

export const NumberIncrement = (props: NumberIncrementProps) => {
  const {
    inputBaseProps,
    others: numberIncrementProps,
  } = selectInputBaseProps({ ...NumberIncrement.defaultProps, ...props })

  const {
    style,
    value,
    disabled,
    onValueChange,
    onChangeText,
    max,
    min,
    step,
    editable,
    hasSeparator,
    format,
    mask,
    suffix,
    separator,
    prefix,
    validate,
    _error,
    formatter,
    placeholder,
  } = numberIncrementProps

  const styles = useStylesFor(NumberIncrement.styleRegistryName, style)

  const [isFocused, setIsFocused] = useState(false)

  const innerWrapperRef = useRef(null)
  const innerInputRef = useRef<HTMLInputElement>(null)

  const validation = useValidate(value, validate)

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error

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

  const onChange = (newValue: number) => {
    if (onValueChange) onValueChange?.(newValue)
    if (onChangeText) onChangeText?.(newValue)
  }

  const handleChange = React.useCallback((action: 'increment' | 'decrement') => {
    validation?.onInputFocused()

    if (action === 'increment' && !incrementDisabled) {
      const newValue = Number(value) + step
      onChange(newValue)
      return
    } else if (action === 'decrement' && !decrementDisabled) {
      const newValue = Number(value) - step
      onChange(newValue)
      return
    }

    validation?.onInputBlurred()
  }, [validation?.onInputBlurred, validation?.onInputFocused, value])

  const inputTextStyle = React.useMemo(() => {
    return [
      styles.input,
      isFocused ? styles['input:focus'] : null,
      hasError ? styles['input:error'] : null,
      disabled ? styles['input:disabled'] : null,
    ].filter(Boolean)
  }, [disabled, isFocused, hasError])

  const placeholderStyles = [
    styles.placeholder,
    isFocused ? styles['placeholder:focus'] : null,
    hasError ? styles['placeholder:error'] : null,
    disabled ? styles['placeholder:disabled'] : null,
  ].filter(Boolean)

  const handleBlur = React.useCallback(() => {
    if (TypeGuards.isNumber(max) && (value >= max)) {
      onChange(max)
      return
    } else if (TypeGuards.isNumber(min) && (value <= min) || !value) {
      onChange(min)
      return
    }

    validation?.onInputBlurred()
  }, [validation?.onInputBlurred, value])

  const handleFocus = React.useCallback(() => {
    validation?.onInputFocused()
    setIsFocused(true)
  }, [validation?.onInputFocused])

  onUpdate(() => {
    function handleKeyboardEvent(event: KeyboardEvent) {
      if (!isFocused) return

      if (event.keyCode === 39 || event.key === 'ArrowRight') {
        handleChange('increment')
      } else if (event.keyCode === 37 || event.key === 'ArrowLeft') {
        handleChange('decrement')
      }
    }

    document.addEventListener('keydown', handleKeyboardEvent)

    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent)
    }
  }, [handleChange, isFocused])

  onUpdate(() => {
    function handleClickOutside(event: MouseEvent) {
      if (innerWrapperRef.current && !innerWrapperRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [innerWrapperRef])

  const handleChangeInput: NFProps['onValueChange'] = (values) => {
    const { floatValue } = values

    onChange(Number(floatValue))
  }

  const InputFormat = TypeGuards.isString(format) || TypeGuards.isString(mask)
    ? PatternFormat
    : NumericFormat

  const Input = TypeGuards.isFunction(formatter)
    ? NumberFormatBase
    : InputFormat

  return (
    <InputBase
      {...inputBaseProps}
      error={hasError ? errorMessage : null}
      style={{
        ...styles,
        innerWrapper: {
          ...styles.innerWrapper,
          ...(editable ? styles['innerWrapper:cursor'] : {}),
        },
      }}
      rightIcon={{
        name: 'plus' as AppIcon,
        disabled: disabled || incrementDisabled,
        onPress: () => handleChange('increment'),
        component: 'button',
        ...inputBaseProps.rightIcon,
      }}
      leftIcon={{
        name: 'minus' as AppIcon,
        disabled: disabled || decrementDisabled,
        onPress: () => handleChange('decrement'),
        component: 'button',
        ...inputBaseProps.leftIcon,
      }}
      disabled={disabled}
      focused={isFocused}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps || {}),
        onClick: () => {
          setIsFocused(true)
          innerInputRef.current?.focus?.()
        },
      }}
      innerWrapperRef={innerWrapperRef}
    >
      {editable && !disabled ? (
        <Input
          displayType='input'
          css={[
            // @ts-expect-error
            ...inputTextStyle,
            // @ts-expect-error
            {
              '&::placeholder': placeholderStyles,
            },
            // @ts-expect-error
            {
              '&:focus': [
                {
                  outline: 'none',
                  borderWidth: 0,
                  borderColor: 'transparent',
                },
              ],
            },
          ]}
          inputMode='numeric'
          onValueChange={handleChangeInput}
          onBlur={handleBlur}
          onFocus={handleFocus}
          value={value}
          thousandSeparator={separator}
          thousandsGroupStyle={hasSeparator || TypeGuards.isString(separator) ? 'thousand' : 'none'}
          suffix={suffix}
          prefix={prefix}
          format={TypeGuards.isFunction(formatter) ? formatter as any : format}
          mask={mask}
          placeholder={placeholder}
          getInputRef={innerInputRef}
        />
      ) : <Text text={String(value)} style={inputTextStyle} />}
    </InputBase>
  )
}

NumberIncrement.styleRegistryName = 'NumberIncrement'
NumberIncrement.elements = [...InputBase.elements, 'input', 'placeholder']
NumberIncrement.rootElement = 'wrapper'

NumberIncrement.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return NumberIncrement as (props: StyledComponentProps<NumberIncrementProps, typeof styles>) => IJSX
}

NumberIncrement.defaultProps = {
  max: 1000000000,
  min: 0,
  step: 1,
  editable: true,
  hasSeparator: false,
  mask: undefined,
  separator: null,
  format: null,
  formatter: null,
} as Partial<NumberIncrementProps>

WebStyleRegistry.registerComponent(NumberIncrement)
