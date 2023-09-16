import { variantProvider } from '@/app'
import { includePresets } from '@codeleap/common'

import { AppTextStyles, assignTextStyle } from './Text'

type LinkStates = 'default' | 'hover' | 'active' | 'focus' | 'visited' | 'disabled'

type LinkTypes = 'external'

type LinkParts = 'anchor' | 'text'

export type LinkComposition = LinkParts | LinkStates | `${LinkParts}:${LinkTypes}`

const createLinkStyle = variantProvider.createVariantFactory<LinkComposition>()

const presets = includePresets((styles) => createLinkStyle(() => ({ anchor: styles })))

export const LinkStyles = {
  ...AppTextStyles,
  ...presets,
  default: createLinkStyle(theme => {
    return {
      anchor: {
        ...assignTextStyle('p1')(theme).text,
        textDecoration: 'underline',
        color: theme.colors['primary-4'],
        '&:hover': {
          color: theme.colors['primary-3'],

        },

      },
    }
  }),
  'noUnderline': createLinkStyle(theme => ({
    anchor: {
      textDecoration: 'none',
    },
  })),
  hx: assignTextStyle('hx'),
  h0: assignTextStyle('h0'),
  h1: assignTextStyle('h1'),
  h2: assignTextStyle('h2'),
  h3: assignTextStyle('h3'),
  h4: assignTextStyle('h4'),
  h5: assignTextStyle('h5'),
  p1: assignTextStyle('p1'),
  p2: assignTextStyle('p2'),
  p3: createLinkStyle(theme => ({
    anchor: {
      ...assignTextStyle('p3')(theme).text,
    },
  })),
  p4: createLinkStyle(theme => ({
    anchor: {
      ...assignTextStyle('p4')(theme).text,
    },
  })),
  p5: assignTextStyle('p5'),
  primary3: createLinkStyle(theme => ({
    anchor: {
      color: theme.colors.primary3
    },
  })),
  primary2: createLinkStyle(theme => ({
    anchor: {
      color: theme.colors.primary2
    },
  })),
}
