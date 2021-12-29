import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TouchableComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';


const createTouchableStyle = createDefaultVariantFactory<TouchableComposition>()

const presets = includePresets((styles) => createTouchableStyle(() => ({ wrapper: styles })))

export const TouchableStyles = {
  ...presets,
  default: createTouchableStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),
    },
  })),
  circle: createTouchableStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(2),
    },
    text: {
      color: 'yellow',
    },
  })),
  pill: createTouchableStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius,
    },
  })),

}
