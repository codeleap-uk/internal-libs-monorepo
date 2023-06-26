import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

type BadgeParts = 'wrapper' | 'innerWrapper' | 'count'

type BadgeStates = 'disabled'

export type BadgeComposition =
  `${BadgeParts}:${BadgeStates}`
  | BadgeParts

const createBadgeStyle =
  createDefaultVariantFactory<BadgeComposition>()

export const BadgePresets = includePresets((styles) => createBadgeStyle(() => ({ wrapper: styles })))
