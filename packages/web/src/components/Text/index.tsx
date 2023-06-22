/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { NativeHTMLElement } from '../../types/utility'
import { TextPresets } from './styles'
import { View, ViewProps } from '../View'

export * from './styles'

export type TextProps<T extends NativeHTMLElement> =
  Omit<ViewProps<T>, 'variants'|'responsiveVariants'> &
  ComponentVariants<typeof TextPresets> &
  {
    text?: string
  }

export const Text = <T extends NativeHTMLElement>(textProps: TextProps<T>) => {
  const {
    variants = [],
    responsiveVariants = {},
    text = null,
    children,
    // style,
    ...props
  } = textProps

  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextPresets>('u:Text', {
    rootElement: 'text',
    responsiveVariants,
    variants,

  })

  return (
    // @ts-ignore
    <View
      css={variantStyles.text}
      {...props}
    >
      {text || children}
    </View>
  )
}
