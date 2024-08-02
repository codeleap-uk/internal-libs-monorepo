import { customTextStyles } from './Text'
import { createStyles } from '@codeleap/styles'
import { StyleRegistry } from '../styles'

export type LinkComposition = 'anchor' | 'text'

const createLinkVariant = createStyles<LinkComposition>

export const LinkStyles = {
  default: createLinkVariant(theme => ({
    anchor: {
      ...customTextStyles('p1'),
      textDecoration: 'underline',
    },
  })),
  'noUnderline': createLinkVariant(theme => ({
    anchor: {
      textDecoration: 'none',
    },
  })),
}

StyleRegistry.registerVariants('Link', LinkStyles)
