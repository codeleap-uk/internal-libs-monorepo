import { BadgeComposition } from '../Badge'

export type TagStates = 'pressable' | 'disabled'

type TagBadgeParts =
  | `leftBadge${Capitalize<BadgeComposition>}`
  | `rightBadge${Capitalize<BadgeComposition>}`

export type TagParts =
  | `wrapper`
  | 'text'
  | 'leftIcon'
  | 'rightIcon'

export type TagComposition = TagParts | TagBadgeParts | `${TagParts}:${TagStates}`
