import { TouchableComposition } from '@codeleap/web'
import { StyleRegistry } from '../styles'
import { createStyles } from '@codeleap/styles'

const createTouchableVariant = createStyles<TouchableComposition>

export const TouchableStyles = {
  default: createTouchableVariant((theme) => ({
    wrapper: {
      display: 'flex',
      ...theme.presets.center,
      cursor: 'pointer',
      userSelect: 'none',
    },
    'wrapper:disabled': {
      cursor: 'default',
    },
  })),
}

StyleRegistry.registerVariants('Touchable', TouchableStyles)
