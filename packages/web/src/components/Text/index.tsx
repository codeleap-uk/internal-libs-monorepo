import { ComponentVariants, TypeGuards, useDefaultComponentStyle, useI18N } from '@codeleap/common'
import { ComponentPropsWithoutRef, ElementType } from 'react'
import { StylesOf } from '../../types/utility'
import { TextComposition, TextPresets } from './styles'

export * from './styles'

export type TextProps<T extends ElementType> = {
  component?: T
  text?: string
  msg: string
  styles?: StylesOf<TextComposition>
} & ComponentPropsWithoutRef<T> &
  ComponentVariants<typeof TextPresets>

export const Text = <T extends ElementType>(textProps: TextProps<T>) => {
  const {
    variants = [],
    responsiveVariants = {},
    text,
    msg = null,
    children,
    component = 'p',
    styles,
    ...props
  } = textProps

  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextPresets>('u:Text', {
    rootElement: 'text',
    responsiveVariants,
    variants,
    styles,
  })

  const { t } = useI18N()

  const content = TypeGuards.isNil(msg) ? text : t(String(msg))

  const Component = component
  
  return (
    <Component
      css={[variantStyles.text, props.style]}
      {...props}
    >
      {content || children}
    </Component>
  )
}
