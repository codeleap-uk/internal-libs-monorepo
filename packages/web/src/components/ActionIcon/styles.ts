import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { IconComposition } from '../Icon'
import { TouchableParts } from '../Touchable'

export type ActionIconParts = IconComposition | `touchable${Capitalize<TouchableParts>}`
export type ActionIconStates = 'disabled' | 'pressable'

export type ActionIconComposition = ActionIconParts | `${ActionIconParts}:${ActionIconStates}`

const createActionIconStyle = createDefaultVariantFactory<ActionIconComposition>()

export const ActionIconPresets = includePresets((style) => createActionIconStyle(() => ({ touchableWrapper: style })))
