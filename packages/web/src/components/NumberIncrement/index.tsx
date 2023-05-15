import * as React from 'react'
import { ComponentVariants, useDefaultComponentStyle, StylesOf, PropsOf, TypeGuards, onUpdate, useState, useRef } from '@codeleap/common'
import { View } from '../View'
import { NumberIncrementPresets, NumberIncrementComposition } from './styles'
import { Text } from '../Text'
import { InputBase, InputBaseProps, selectInputBaseProps } from '../InputBase'

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
    max = null,
    min = 0,
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

  const handleChange = React.useCallback((action: 'increment' | 'decrement') => {
    setIsFocused(true)

    if (action === 'increment' && !incrementDisabled) {
      const newValue = Number(value) + 1
      
      if (onValueChange) onValueChange?.(newValue)
      if (onChangeText) onChangeText?.(newValue)
      return
    } else if (action === 'decrement' && !decrementDisabled) {
      const newValue = Number(value) - 1

      if (onValueChange) onValueChange?.(newValue)
      if (onChangeText) onChangeText?.(newValue)
      return
    }
  }, [value])

  const textStyle = React.useMemo(() => {
    return [
      variantStyles.text,
      disabled && variantStyles['text:disabled'],
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
        ...inputBaseProps.rightIcon,
      }}
      leftIcon={{
        name: 'minus',
        disabled: disabled || decrementDisabled,
        onPress: () => handleChange('decrement'),
        ...inputBaseProps.leftIcon,
      }}
      style={style}
      disabled={disabled}
      wrapperProps={{
        ...(inputBaseProps.wrapperProps  || {}),
        onClick: handleClickInside,
      }}
      wrapperRef={wrapperRef}
    >
      <Text css={textStyle} text={String(value)}  />
    </InputBase>
  )
}
