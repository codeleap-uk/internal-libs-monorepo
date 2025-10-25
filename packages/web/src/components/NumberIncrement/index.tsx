import React from 'react'
import { TypeGuards } from '@codeleap/types'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import { PatternFormat, NumericFormat, NumberFormatBase } from 'react-number-format'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { NumberIncrementProps } from './types'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { useInputBasePartialStyles } from '../InputBase/useInputBasePartialStyles'
import { useNumberIncrement } from './useNumberIncrement'

export * from './types'
export * from './styles'

export const NumberIncrement = (props: NumberIncrementProps) => {
  const allProps = {
    ...NumberIncrement.defaultProps,
    ...props
  }

  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(allProps)

  const {
    style,
    disabled,
    editable,
    hasSeparator,
    format,
    mask,
    suffix,
    separator,
    prefix,
    formatter,
    placeholder,
  } = others

  const styles = useStylesFor(NumberIncrement.styleRegistryName, style)

  const {
    isFocused,
    hasError,
    hasValue,
    errorMessage,
    incrementDisabled,
    decrementDisabled,
    innerInputRef,
    innerWrapperRef,
    wrapperRef,
    handleBlur,
    handleFocus,
    handleChange,
    handleChangeInput,
    onPressInnerWrapper,
    inputValue,
  } = useNumberIncrement(allProps)

  const partialStyles = useInputBasePartialStyles(styles, ['input', 'placeholder'], {
    disabled,
    error: hasError,
    focus: isFocused,
    typed: hasValue,
  })

  const InputFormat = TypeGuards.isString(format) || TypeGuards.isString(mask)
    ? PatternFormat
    : NumericFormat

  const Input: any = TypeGuards.isFunction(formatter)
    ? NumberFormatBase
    : InputFormat

  return (
    <InputBase
      {...inputBaseProps}
      ref={wrapperRef}
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
        onClick: onPressInnerWrapper,
      }}
      innerWrapperRef={innerWrapperRef}
    >
      {editable && !disabled ? (
        <Input
          displayType='input'
          css={[
            partialStyles?.input,
            {
              '&::placeholder': partialStyles?.placeholder,
            },
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
          value={inputValue}
          thousandSeparator={separator}
          thousandsGroupStyle={hasSeparator || TypeGuards.isString(separator) ? 'thousand' : 'none'}
          suffix={suffix}
          prefix={prefix}
          format={TypeGuards.isFunction(formatter) ? formatter as any : format}
          mask={mask}
          placeholder={placeholder}
          getInputRef={innerInputRef}
        />
      ) : <Text text={String(inputValue)} style={partialStyles?.input} />}
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
