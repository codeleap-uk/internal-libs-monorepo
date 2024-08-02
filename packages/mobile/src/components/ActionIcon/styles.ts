import { BadgeComposition } from '../Badge'
import { TouchableComposition } from '../Touchable'

export type ActionIconParts = 'icon' | `touchable${Capitalize<TouchableComposition>}` | `badge${Capitalize<BadgeComposition>}`

export type ActionIconStates = ':disabled' | ''

export type ActionIconComposition = `${ActionIconParts}${ActionIconStates}`
