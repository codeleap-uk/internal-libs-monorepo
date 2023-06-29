import { ComponentVariants, TypeGuards, useDefaultComponentStyle, useI18N } from '@codeleap/common'
import { ComponentPropsWithoutRef, ElementType } from 'react'
import { StylesOf } from '../../types/utility'
import { TextComposition, TextPresets } from './styles'

export * from './styles'

export type TextProps<T extends ElementType> = {
  component?: T
  text: string
  styles?: StylesOf<TextComposition>
  debugName?: string
} & ComponentPropsWithoutRef<T> &
  ComponentVariants<typeof TextPresets>

const getTextContent = (text: TextProps<any>['text']) => {
  const { t } = useI18N()

  let content = ''

  if (TypeGuards.isArray(text)) {
    text.forEach((message, i) => {
      const space = (i !== 0 ? ' ' : '')

      try {
        const translatedMessage = t(String(message))
        content = content + space + translatedMessage
      } catch {
        content = content + space + message
      }
    })
  } else {
    try {
      content = t(String(text))
    } catch (err) {
      content = text
    }
  }

  return content
}

export const Text = <T extends ElementType>(textProps: TextProps<T>) => {
  const {
    variants = [],
    responsiveVariants = {},
    text = null,
    children,
    component = 'p',
    styles,
    debugName = 'Text component',
    ...props
  } = textProps

  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextPresets>('u:Text', {
    variants,
    styles,
    responsiveVariants,
    rootElement: 'text',
  })

  let content = getTextContent(text)

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
