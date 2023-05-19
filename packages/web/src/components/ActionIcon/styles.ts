import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { TouchableComposition } from '../Touchable'

export type ActionIconParts = 'icon' | TouchableComposition
export type ActionIconStates = ':disabled' | ':cursor' | ''
export type ActionIconComposition = `${ActionIconParts}${ActionIconStates}`
const createActionIconStyle = createDefaultVariantFactory<ActionIconComposition>()

export const ActionIconPresets = includePresets((style) => createActionIconStyle(() => ({ wrapper: style })))
