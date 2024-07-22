import { TypeGuards } from '@codeleap/common'
import { motion } from 'framer-motion'
import React, { ElementType } from 'react'
import { TextProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const Text = <T extends ElementType>(textProps: TextProps<T>) => {
  const {
    style,
    text,
    children,
    component,
    debugName,
    onPress,
    debounce,
    pressDisabled,
    onClick,
    animated,
    animatedProps,
    ...props
  } = {
    ...Text.defaultProps,
    ...textProps,
  }

  const styles = useStylesFor(Text.styleRegistryName, style)

  const Component = animated ? (motion?.[component] || motion.p) : (component || 'p')

  const pressedRef = React.useRef(false)

  const isPressable = (TypeGuards.isFunction(onPress) || TypeGuards.isFunction(onClick)) && !pressDisabled

  const disabled = isPressable === false

  const _onPress = (e) => {
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

  const pressProps = isPressable ? {
    onClick: disabled ? null : _onPress,
  } : {}

  const componentProps: any = {
    ...props,
    ...pressProps,
    ...animatedProps,
  }

  return (
    <Component {...componentProps} css={[styles.text, disabled && styles['text:disabled']]}>
      {text || children}
    </Component>
  )
}

Text.styleRegistryName = 'Text'
Text.elements = ['text']
Text.rootElement = 'text'

Text.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Text as <T extends ElementType>(props: StyledComponentProps<TextProps<T>, typeof styles>) => IJSX
}

Text.defaultProps = {
  debugName: 'Text component',
  component: 'p',
  text: null,
  debounce: null,
  pressDisabled: false,
  animated: false,
  animatedProps: {},
} as Partial<TextProps<'p'>>

WebStyleRegistry.registerComponent(Text)
