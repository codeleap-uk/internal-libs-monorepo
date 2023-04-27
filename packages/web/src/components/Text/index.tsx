/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  useI18N,
} from '@codeleap/common'
import { ComponentPropsWithoutRef, ElementType } from 'react'
import { StylesOf } from '../../types/utility'
import { TextComposition, TextPresets } from './styles'

export * from './styles'

export type TextProps<T extends ElementType> = {
  component?: T
  text?: string
  message?: string // is required
  styles?: StylesOf<TextComposition>
} & ComponentPropsWithoutRef<T> &
  ComponentVariants<typeof TextPresets>

export const Text = <T extends ElementType>(textProps: TextProps<T>) => {
  const {
    variants = [],
    responsiveVariants = {},
    text = null,
    children,
    component = 'p',
    styles,
    message = null,
    ...props
  } = textProps

  const variantStyles = useDefaultComponentStyle('Text', {
    rootElement: 'text',
    responsiveVariants,
    variants,
    styles,
  })

  const { t } = useI18N()

  const content = !!text ? text : t(String(message))

  const Component = component

  return (
    //@ts-ignore
    <Component
      css={[variantStyles.text, props.style]}
      {...props}
    >
      {content || children}
    </Component>
  )
}
