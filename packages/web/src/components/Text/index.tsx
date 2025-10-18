import { TypeGuards } from '@codeleap/types'
import { motion } from 'motion/react'
import React, { ElementType, forwardRef } from 'react'
import { TextProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const Text = (textProps: TextProps) => {
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
    ref,
    ...props
  } = {
    ...Text.defaultProps,
    ...textProps,
  }

  const styles = useStylesFor(Text.styleRegistryName, style)

  const Component: ElementType = animated ? (motion?.[component as string] || motion.p) : (component || 'p')

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

  const componentProps: AnyRecord = {
    ...props,
    ...pressProps,
    ...animatedProps,
  }

  return (
    <Component {...componentProps} ref={ref} css={[styles.text, disabled && styles['text:disabled']]}>
      {text || children}
    </Component>
  )
}

Text.styleRegistryName = 'Text'
Text.elements = ['text']
Text.rootElement = 'text'

Text.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Text as <T extends ElementType = 'p'>(props: StyledComponentProps<TextProps<T>, typeof styles>) => IJSX
}

Text.defaultProps = {
  debugName: 'Text component',
  component: 'p',
  text: null,
  debounce: null,
  pressDisabled: false,
  animated: false,
  animatedProps: {},
} as Partial<TextProps>

WebStyleRegistry.registerComponent(Text)
