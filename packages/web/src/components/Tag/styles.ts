import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TagComposition =
  | 'wrapper'
  | 'innerWrapper'
  | 'text'
  | 'leftIcon'
  | 'rightIcon'
  | 'leftWrapper'
  | 'rightWrapper'
  | 'leftBadge'
  | 'rightBadge'

const createTagStyle = createDefaultVariantFactory<TagComposition>()

export const TagPresets = includePresets((styles) => createTagStyle(() => ({
  wrapper: styles,
})),
)
