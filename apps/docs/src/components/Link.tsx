import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby'
import { Link as CodeleapLink, LinkProps } from '@codeleap/web'

export const Link: React.FC<LinkProps<React.FC<GatsbyLinkProps<any>>>> = (
  props,
) => {
  return <CodeleapLink {...props} component={GatsbyLink as any} />
}
