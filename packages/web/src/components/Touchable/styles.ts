import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TouchableComposition = 'wrapper'

const createTouchableStyle = createDefaultVariantFactory<TouchableComposition>()

export const TouchablePresets = includePresets((styles) => createTouchableStyle(() => ({ wrapper: styles })))
