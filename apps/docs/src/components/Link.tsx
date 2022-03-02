import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby'
import { Link as CodeleapLink, LinkProps } from '@codeleap/web'
import { standardizeVariants } from '@codeleap/common'

type LinkVariants = Exclude<LinkProps<any>['variants'], string>

export const Link: React.FC<LinkProps<React.FC<GatsbyLinkProps<any>>>> = (
  props,
) => {
  return <CodeleapLink {...props} component={GatsbyLink as any} variants={[
    'link',
    ...(
        standardizeVariants(props.variants) as LinkVariants
    ),
  ]}/>
}
