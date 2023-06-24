import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TouchableState = 'disabled'
export type TouchableParts = 'wrapper'
export type TouchableComposition = TouchableParts | `${TouchableParts}:${TouchableState}`

const createTouchableStyle = createDefaultVariantFactory<TouchableComposition>()

export const TouchablePresets = includePresets((styles) => createTouchableStyle(() => ({ wrapper: styles })))
