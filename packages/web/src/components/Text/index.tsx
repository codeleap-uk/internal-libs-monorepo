import { TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { motion } from 'framer-motion'
import React, { ElementType } from 'react'
import { TextPresets } from './styles'
import { TextProps } from './types'

export * from './styles'
export * from './types'

const defaultProps: Partial<TextProps<'p'>> = {
  debugName: 'Text component',
  component: 'p',
  debounce: null,
  pressDisabled: false,
  animated: false,
}

export const Text = <T extends ElementType>(textProps: TextProps<T>) => {
  const allProps = {
    ...Text.defaultProps,
    ...textProps,
  }

  const {
    variants = [],
    responsiveVariants = {},
    styles = {},
    style = {},
    css,
    text = null,
    children,
    component,
    debugName,
    msg = null,
    onPress,
    debounce,
    pressDisabled,
    onClick,
    animated,
    animatedProps = {},
    ...props
  } = allProps

  const Component = animated ? (motion?.[component] || motion.p) : (component || 'p')

  const pressedRef = React.useRef(false)

  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextPresets>('u:Text', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'text',
  })

  const isPressable = (TypeGuards.isFunction(onPress) || TypeGuards.isFunction(onClick)) && !pressDisabled

  const disabled = isPressable === false

  const _onPress = (e: React.MouseEventHandler<T>) => {
    if (disabled) return

    const handlePress = () => {
      onClick?.(e)
      onPress?.(e)
    }

    if (TypeGuards.isNumber(debounce)) {
      if (pressedRef.current) {
        return
      }

      pressedRef.current = true
      handlePress()
      setTimeout(() => {
        pressedRef.current = false
      }, debounce)
    } else {
      handlePress()
    }
  }

  const _styles = React.useMemo(() => ([
    variantStyles.text,
    disabled && variantStyles['text:disabled'],
    css,
    style,
  ]), [css, style, disabled])

  const pressProps = isPressable ? {
    onClick: disabled ? null : _onPress,
  } : {}

  return (
    <Component
      css={_styles}
      {...props}
      {...pressProps}
      {...animatedProps}
    >
      {text || children}
    </Component>
  )
}

Text.defaultProps = defaultProps
