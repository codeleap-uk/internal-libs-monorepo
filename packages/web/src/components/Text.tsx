/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ComponentVariants,
  TextComposition,
  TextStyles,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { ComponentPropsWithoutRef, ElementType } from 'react'
import { StylesOf } from '../types/utility'

export type TextProps<T extends ElementType> = {
  component?: T
  text?: string
  styles?: StylesOf<TextComposition>
} & ComponentPropsWithoutRef<T> &
  ComponentVariants<typeof TextStyles>

export const Text = <T extends ElementType>(textProps: TextProps<T>) => {
  const {
    variants = [],
    responsiveVariants = {},
    text,
    children,
    component = 'p',
    styles,
    ...props
  } = textProps
  const variantStyles = useDefaultComponentStyle('Text', {
    rootElement: 'text',
    responsiveVariants,
    variants,
    styles,
  })

  const Component = component

  const css = { ...variantStyles.text, ...props.style }
  return (

    //@ts-ignore
    <Component
      css={css}
      {...props}
    >
      {text || children}
    </Component>
  )
}
