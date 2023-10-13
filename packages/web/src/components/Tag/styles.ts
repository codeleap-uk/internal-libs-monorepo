import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
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

const createTagStyle = createDefaultVariantFactory<TagComposition>()

export const TagPresets = includePresets((styles) => createTagStyle(() => ({
  wrapper: styles,
})),
)
