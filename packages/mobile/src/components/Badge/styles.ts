import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

type BadgeParts =  'wrapper'  | 'innerWrapper' | 'counter'

type BadgeStates =  'disabled'

export type BadgeComposition =  
  `${BadgeParts}:${BadgeStates}` 
  | BadgeParts
  | '__props'

const createBadgeStyle =
  createDefaultVariantFactory<BadgeComposition>()

export const BadgePresets = includePresets((styles) => createBadgeStyle(() => ({ wrapper: styles })))
