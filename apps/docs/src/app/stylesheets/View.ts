import { ViewComposition } from '@codeleap/web'
import { createStyles } from '@codeleap/styles'
import { StyleRegistry } from '../styles'

const createViewVariant = createStyles<ViewComposition>

export const ViewStyles = {
  default: createViewVariant((t) => ({
    wrapper: {
      display: 'flex',
    },
  })),
  separator: createViewVariant((theme) => ({
    wrapper: {
      width: '100%',
      height: 2,
      backgroundColor: theme.colors.neutral5,
      [theme.media.down('tabletSmall')]: {
        height: 4,
      },
    },
  })),
  'fullViewport': createViewVariant((theme) => ({
    wrapper: {
      width: '100vw',
      height: '100svh',
    },
  })),
  'pointerEvents:none': createViewVariant((theme) => ({
    wrapper: {
      pointerEvents: 'none',
    },
  })),
}

StyleRegistry.registerVariants('View', ViewStyles)
