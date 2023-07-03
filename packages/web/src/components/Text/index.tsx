import { ComponentVariants, TypeGuards, useDefaultComponentStyle, useI18N } from '@codeleap/common'
import React, { ComponentPropsWithoutRef, ElementType } from 'react'
import { StylesOf } from '../../types/utility'
import { TextComposition, TextPresets } from './styles'

export * from './styles'

export type TextProps<T extends ElementType> =
  ComponentPropsWithoutRef<T> &
  ComponentVariants<typeof TextPresets> & {
    component?: T
    text: string
    styles?: StylesOf<TextComposition>
    msg?: string
    debugName?: string
    debounce?: number
    pressDisabled?: boolean
    onPress?: (event: React.MouseEventHandler<T>) => void
  }

const defaultProps: Partial<TextProps<'p'>> = {
  debugName: 'Text component',
  component: 'p',
  debounce: null,
  pressDisabled: false,
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
    component: Component,
    debugName,
    msg = null,
    onPress,
    debounce,
    pressDisabled,
    onClick,
    ...props
  } = allProps

  const pressedRef = React.useRef(false)

  const { t } = useI18N()

  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextPresets>('u:Text', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'text',
  })

  const _text = TypeGuards.isString(msg) ? msg : text

  let content = t(String(_text))

  if (TypeGuards.isNil(content) || !TypeGuards.isString(content) || content === 'null') {
    content = text
  }

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

  const _styles = [
    variantStyles.text,
    disabled && variantStyles['text:disabled'],
    css,
    style,
  ]

  const pressProps = isPressable ? {
    onClick: disabled ? null : _onPress,
  } : {}

  return (
    <Component
      css={_styles}
      {...props}
      {...pressProps}
    >
      {content || children}
    </Component>
  )
}

Text.defaultProps = defaultProps
