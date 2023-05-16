import * as React from 'react'
import { ComponentVariants, useDefaultComponentStyle, StylesOf, PropsOf, TypeGuards, onUpdate, useState, useRef } from '@codeleap/common'
import { View } from '../View'
import { NumberIncrementPresets, NumberIncrementComposition } from './styles'
import { InputBase, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import { 
  PatternFormat, 
  PatternFormatProps as PFProps,
  NumericFormat,
  NumericFormatProps as NFProps,
} from 'react-number-format'

export * from './styles'

export type NumberIncrementProps = Pick<
  InputBaseProps,
  'debugName' | 'disabled' | 'label'
> & {
  variants?: ComponentVariants<typeof NumberIncrementPresets>['variants']
  styles?: StylesOf<NumberIncrementComposition>
  value: number
  onValueChange: (value: number) => void
  onChangeText?: (value: number) => void
  style?: PropsOf<typeof View>['style']
  max?: number
  min?: number
  step?: number
  editable?: boolean
  prefix?: NFProps['prefix']
  suffix?: NFProps['suffix']
  separator?: NFProps['thousandSeparator']
  format?: PFProps['format']
  mask?: PFProps['mask']
  hasSeparator?: boolean
}

export const NumberIncrement = (props: NumberIncrementProps) => {
  const {
    inputBaseProps,
    others
  } = selectInputBaseProps(props)

  const {
    variants = [],
    style = {},
    styles = {},
    value,
    disabled,
    onValueChange,
    onChangeText,
    max = 1000000000,
    min = 0,
    step = 1,
    editable = true,
    hasSeparator = false,
    format = null,
    mask = null,
    suffix,
    separator = null,
    prefix,
  } = others

  const [isFocused, setIsFocused] = useState(false)
  const wrapperRef = useRef(null)

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
    }
  )

  const onChange = (newValue: number) => {
    if (onValueChange) onValueChange?.(newValue)
    if (onChangeText) onChangeText?.(newValue)
  }

  const handleChange = React.useCallback((action: 'increment' | 'decrement') => {
    setIsFocused(true)

    if (action === 'increment' && !incrementDisabled) {
      const newValue = Number(value) + step
      onChange(newValue)
      return
    } else if (action === 'decrement' && !decrementDisabled) {
      const newValue = Number(value) - step
      onChange(newValue)
      return
    }
  }, [value])

  const inputTextStyle = React.useMemo(() => {
    return [
      variantStyles.input,
      disabled && variantStyles['input:disabled'],
    ]
  }, [disabled])

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
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  const handleClickInside = () => {
    setIsFocused(true)
  }

  const handleChangeInput: NFProps['onValueChange'] = (values) => {
    if (!editable) return

    const { value } = values

    onChange(Number(value))
  }

  const onBlur: NFProps['onBlur'] = React.useCallback(() => {
    if (!editable) return

    if (TypeGuards.isNumber(max) && (value >= max)) {
      onChange(max)
      return
    } else if (TypeGuards.isNumber(min) && (value <= min)) {
      onChange(min)
      return
    }
  }, [value])

  const Input = TypeGuards.isString(format) || TypeGuards.isString(mask)
    ? PatternFormat
    : NumericFormat

  return (
    <InputBase
      {...inputBaseProps}
      styles={{
        ...variantStyles,
        innerWrapper: [
          variantStyles.innerWrapper,
        ],
      }}
      rightIcon={{
        name: 'plus',
        disabled: disabled || incrementDisabled,
        onPress: () => handleChange('increment'),
        component: 'button',
        ...inputBaseProps.rightIcon,
      }}
      leftIcon={{
        name: 'minus',
        disabled: disabled || decrementDisabled,
        onPress: () => handleChange('decrement'),
        component: 'button',
        ...inputBaseProps.leftIcon,
      }}
      style={style}
      disabled={disabled}
      focused={isFocused}
      wrapperProps={{
        ...(inputBaseProps.wrapperProps  || {}),
        onClick: handleClickInside,
      }}
      wrapperRef={wrapperRef}
    >
      {editable ? (
        <Input
          displayType='input'
          css={[
            ...inputTextStyle,
            {
              '&:focus':  [
                { outline: 'none', borderWidth: 0, borderColor: 'transparent' },
                isFocused && variantStyles['input:focus'],
              ],
            }
          ]}
          onValueChange={handleChangeInput}
          onBlur={onBlur}
          value={value}
          thousandSeparator={separator}
          thousandsGroupStyle={hasSeparator || TypeGuards.isString(separator) ? 'thousand' : 'none'}
          format={format}
          mask={mask}
          suffix={suffix}
          prefix={prefix}
        />
      ) : <Text text={String(value)} css={inputTextStyle} />}
    </InputBase>
  )
}
