import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { BadgeComposition } from '../Badge'

export type TagComposition =
  | 'wrapper'
  | 'innerWrapper'
  | 'text'
  | 'leftIcon'
  | 'rightIcon'
  | `leftBadge${Capitalize<BadgeComposition>}`
  | `rightBadge${Capitalize<BadgeComposition>}`

const createTagStyle = createDefaultVariantFactory<TagComposition>()

export const TagPresets = includePresets((styles) => createTagStyle(() => ({
  wrapper: styles,
})),
)
