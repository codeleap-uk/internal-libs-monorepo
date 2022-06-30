import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby'
import { Link as CodeleapLink, LinkProps, scrollToElem } from '@codeleap/web'
import { standardizeVariants } from '@codeleap/common'
import { Theme } from '@/app'

type LinkVariants = Exclude<LinkProps<any>['variants'], string>

export const Link: React.FC<LinkProps<React.FC<GatsbyLinkProps<any>>>> = (
  props,
) => {
  return <CodeleapLink {...props} onScroll={(to) => {
    scrollToElem(to, [-Theme.values.headerHeight, 0])
  }} component={GatsbyLink as any} variants={[
    'link',
    ...(
        standardizeVariants(props.variants) as LinkVariants
    ),
  ]}/>
}
