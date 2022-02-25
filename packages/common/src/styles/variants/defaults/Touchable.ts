import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TouchableComposition = 'wrapper'

const createTouchableStyle =
  createDefaultVariantFactory<TouchableComposition>()

const presets = includePresets((styles) => createTouchableStyle(() => ({ wrapper: styles })),
)

export const TouchableStyles = {
  ...presets,
  default: createTouchableStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })),
}
