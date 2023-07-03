import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { IconComposition } from '../Icon'
import { TouchableComposition } from '../Touchable/styles'

export type ActionIconParts = IconComposition | `touchable${Capitalize<TouchableComposition>}`
export type ActionIconStates = 'disabled' | 'pressable'

export type ActionIconComposition = ActionIconParts | `${ActionIconParts}:${ActionIconStates}`

const createActionIconStyle = createDefaultVariantFactory<ActionIconComposition>()

export const ActionIconPresets = includePresets((style) => createActionIconStyle(() => ({ touchableWrapper: style })))
