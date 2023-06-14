/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ComponentVariants,
  useCodeleapContext,
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
  debug?: boolean
  debugName?: string
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
    debug = false,
    debugName,
    ...props
  } = textProps

  const variantStyles = useDefaultComponentStyle('Text', {
    rootElement: 'text',
    responsiveVariants,
    variants,
    styles,
  })

  const { logger } = useCodeleapContext()

  const { t } = useI18N()

  const content = !!text ? text : t(String(message))

  const Component = component

  if (debug) {
    logger.log(`Text ${debugName}`, { variantStyles, content })
  }

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
