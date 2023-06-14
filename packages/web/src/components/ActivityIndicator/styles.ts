import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ActivityIndicatorComposition =
  | 'wrapper'
  | 'backCircle'
  | 'frontCircle'
  | 'circle'

const createActivityIndicatorStyle = createDefaultVariantFactory<ActivityIndicatorComposition>()

export const ActivityIndicatorPresets = includePresets((styles) => createActivityIndicatorStyle(() => ({ wrapper: styles })))
