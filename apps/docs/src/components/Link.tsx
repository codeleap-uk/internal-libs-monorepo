import { LinkStyles } from '@/app/stylesheets/Link'
import { ComponentVariants, PropsOf, useDefaultComponentStyle } from '@codeleap/common'

import { scrollToElem, stopPropagation } from '@codeleap/web'
import { Link as GatsbyLink } from 'gatsby'

type GatsbyLinkProps = PropsOf<typeof GatsbyLink>

export type LinkProps = GatsbyLinkProps & {
  openNewTab?: boolean
  onScroll?: (to: string) => any
  to?: string
  text?: string
  type?: 'default' | 'i18n'
} & ComponentVariants<typeof LinkStyles>

export const Link = (linkProps: LinkProps) => {
  const { to, text, openNewTab, onScroll = null, responsiveVariants, children, variants, type = 'default', ...props } = linkProps

  const isExternal = ['http', 'tel', 'mailto'].some((start) => to.startsWith(start))

  function handleClick(event: React.MouseEvent) {

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

  const variantStyles = useDefaultComponentStyle<'u:Link', typeof LinkStyles>('u:Link', {
    responsiveVariants,
    variants,
    rootElement: 'anchor',
  })

  const content = children || text

  if (isExternal) {
    return <a
      href={to}
      onClick={handleClick}
      css={[variantStyles.text, variantStyles.anchor]}
      {...props}
    >
      {content}
    </a>
  }

  return (
    <GatsbyLink
      // @ts-ignore
      ref={linkProps.ref}
      to={to}
      css={[variantStyles.text, variantStyles.anchor]}
      onClick={handleClick}
      {...props}
    >
      {content}
    </GatsbyLink>
  )
}
