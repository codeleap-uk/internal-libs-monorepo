import { IconComposition } from '../Icon'
import { TouchableComposition } from '../Touchable/styles'

export type ActionIconParts = IconComposition | `touchable${Capitalize<TouchableComposition>}`
export type ActionIconStates = 'disabled' | 'pressable'

export type ActionIconComposition = ActionIconParts | `${ActionIconParts}:${ActionIconStates}`

