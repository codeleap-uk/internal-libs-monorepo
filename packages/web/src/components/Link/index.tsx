/** @jsx jsx */
import { jsx } from '@emotion/react'
import { ComponentVariants, useCodeleapContext, useDefaultComponentStyle } from '@codeleap/common'
import { ElementType } from 'react'
import { scrollToElem } from '../../lib/utils/pollyfils/scroll'
import { stopPropagation } from '../../lib/utils/stopPropagation'
import { Text, TextProps } from '../Text'
import { LinkComposition, LinkPresets } from './styles'
import { StylesOf } from '../..'

export type LinkProps<T extends ElementType> = TextProps<T> & {
  openNewTab?: boolean
  onScroll?: (to: string) => any
  styles?: StylesOf<LinkComposition>
} & ComponentVariants<typeof LinkPresets>

export const Link = <T extends ElementType = 'a'>(linkProps: LinkProps<T>) => {
  const { to, openNewTab, component = 'a', onScroll = null, responsiveVariants, variants, styles, style, css = [], ...props } = linkProps

  const isExternal = ['http', 'tel', 'mailto'].some((start) => to.startsWith(start),
  )

  const Component = isExternal ? 'a' : component
  const { logger } = useCodeleapContext()

  function handleClick(event: React.MouseEvent) {
    logger.log('Link pressed', { to, text: linkProps.text }, 'Component')
    if (to) {
      if (to.startsWith('#')) {
        event.preventDefault()
        stopPropagation(event)
        if (onScroll) {
          onScroll(to)
          return
        }
        scrollToElem(to)
      }
      if (openNewTab) {
        event.preventDefault()
        window?.open?.(to, '_blank')
        return false
      }
    }
  }

  const linkPropOverride = {
    [isExternal ? 'href' : 'to']: to,
  }

  const variantStyles = useDefaultComponentStyle<'u:Link', typeof LinkPresets>('u:Link', {
    responsiveVariants,
    variants,
    rootElement: 'text',
    styles,
  })

  const linkStyles = [
    variantStyles.text,
    style,
    css
  ]

  return (
    <Text
      component={Component}
      {...props}
      {...linkPropOverride}
      css={[variantStyles.text, style, ...(css)]}
      onClick={handleClick}
    />
  )
}

export * from './styles'