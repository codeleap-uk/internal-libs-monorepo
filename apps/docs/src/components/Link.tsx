import { StyleRegistry, StyleSheets } from '@/app'
import { PropsOf } from '@codeleap/common'
import { AnyRecord, PropsWithVariants } from '@codeleap/styles'
import { scrollToElem, stopPropagation, useStylesFor } from '@codeleap/web'
import { Link as GatsbyLink } from 'gatsby'
import { Link as GatsbyI18nLink } from 'gatsby-plugin-react-i18next'

type GatsbyLinkProps = PropsOf<typeof GatsbyLink>

export type LinkProps = GatsbyLinkProps & {
  openNewTab?: boolean
  onScroll?: (to: string) => any
  to?: string
  text?: string
  type?: 'default' | 'i18n'
  style?: PropsWithVariants<AnyRecord, typeof StyleSheets.LinkStyles>['style']
}

export const Link = (linkProps: LinkProps) => {
  const { to, text, openNewTab, onScroll = null, children, style, type = 'default', ...props } = linkProps

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

  const styles = useStylesFor(Link.styleRegistryName, style)

  const content = children || text

  if (isExternal) {
    return <a
      href={to}
      onClick={handleClick}
      css={[styles.text, styles.anchor]}
      {...props}
    >
      {content}
    </a>
  }

  const _Link = type === 'default' ? GatsbyLink : GatsbyI18nLink

  return (
    <_Link
      // @ts-ignore
      ref={linkProps.ref}
      to={to}
      css={[styles.text, styles.anchor]}
      onClick={handleClick}
      {...props}
    >
      {content}
    </_Link>
  )
}

Link.styleRegistryName = 'Link'
Link.rootElement = 'anchor'
Link.elements = ['anchor', 'text']

StyleRegistry.registerComponent(Link)
