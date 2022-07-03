import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TouchableComposition = 'wrapper' | 'ripple'

const createTouchableStyle = createDefaultVariantFactory<TouchableComposition>()

const presets = includePresets((styles) => createTouchableStyle(() => ({ wrapper: styles })),
)

export const TouchableStyles = {
  ...presets,
  default: createTouchableStyle((t) => ({

  })),

}
