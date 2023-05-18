import { ComponentVariants, TypeGuards, useCodeleapContext, useDefaultComponentStyle, useI18N } from '@codeleap/common'
import { ComponentPropsWithoutRef, ElementType } from 'react'
import { StylesOf } from '../../types/utility'
import { TextComposition, TextPresets } from './styles'

export * from './styles'

export type TextProps<T extends ElementType> = {
  component?: T
  text?: string
  msg: string
  styles?: StylesOf<TextComposition>
  debugName?: string
} & ComponentPropsWithoutRef<T> &
  ComponentVariants<typeof TextPresets>

const getTextContent = (msg: TextProps<any>['msg'], text: TextProps<any>['text'], logger: any) => {
  const { t: translate } = useI18N()

  let content = ''

  const hasMsg = !TypeGuards.isNil(msg)

  if (TypeGuards.isArray(msg)) {
    msg.forEach((message, i) => {
      const space = (i !== 0 ? ' ' : '')

      try {
        const translatedMessage = translate(String(message))
        content = content + space + translatedMessage
      } catch {
        content = content + space + message
      }
    })
  } else {
    try {
      content = !hasMsg ? text : translate(String(msg))
    } catch (err) {
      content = !hasMsg ? text : translate(String(msg))
      logger.error(err)
    }
  }

  return content
}

export const Text = <T extends ElementType>(textProps: TextProps<T>) => {
  const {
    variants = [],
    responsiveVariants = {},
    text,
    msg = null,
    children,
    component = 'p',
    styles,
    debugName = 'Text component',
    ...props
  } = textProps

  const variantStyles = useDefaultComponentStyle<'u:Text', typeof TextPresets>('u:Text', {
    rootElement: 'text',
    responsiveVariants,
    variants,
    styles,
  })

  const { logger } = useCodeleapContext()

  let content = getTextContent(msg, text, logger)

  const Component = component

  if (TypeGuards.isString(text) && TypeGuards.isNil(msg)) {
    logger.warn(
      `<${Component}>`,
      'The "text" prop is deprecated. Use the "msg" prop instead and I18N.',
      debugName
    )
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
