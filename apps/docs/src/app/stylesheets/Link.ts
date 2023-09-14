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
}
