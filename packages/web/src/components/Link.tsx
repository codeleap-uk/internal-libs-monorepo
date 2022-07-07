/** @jsx jsx */
import { jsx } from '@emotion/react'
import { standardizeVariants, useCodeleapContext } from '@codeleap/common'
import { ElementType } from 'react'
import { TextProps } from './Text'
import { scrollToElem } from '../lib/utils/pollyfils/scroll'
import { stopPropagation } from '../lib/utils/stopPropagation'
import { Text } from './Text'

export type LinkProps<T extends ElementType> = TextProps<T> & {
  openNewTab?: boolean
  onScroll?: (to: string) => any
}

export const Link = <T extends ElementType = 'a'>(linkProps: LinkProps<T>) => {
  const { to, openNewTab, component = 'a', onScroll = null, ...props } = linkProps

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

  return (
    <Text
      component={Component}
      {...props}
      {...linkPropOverride}
      onClick={handleClick}
    />
  )
}
