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
    debugName?: string
    msg?: string
  }

const defaultProps: Partial<TextProps<'p'>> = {
  debugName: 'Text component',
  component: 'p',
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
    text = null,
    children,
    component: Component,
    debugName,
    msg = null,
    ...props
  } = allProps

  const { t } = useI18N()

  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextPresets>('u:Text', {
    variants,
    styles,
    responsiveVariants,
    rootElement: 'text',
  })

  let content = ''

  const _text = TypeGuards.isString(msg) ? msg : text

  try {
    content = t(String(_text))
  } catch (err) {
    content = text
  }

  return (
    <Component
      css={[variantStyles.text, props.style]}
      {...props}
    >
      {content || children}
    </Component>
  )
}

Text.defaultProps = defaultProps
