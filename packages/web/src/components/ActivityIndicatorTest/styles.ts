import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ActivityIndicatorTestComposition =
  | 'wrapper'
  | 'backCircle'
  | 'frontCircle'
  | 'circle'

const createActivityIndicatorStyle = createDefaultVariantFactory<ActivityIndicatorTestComposition>()

export const ActivityIndicatorTestPresets = includePresets((styles) => createActivityIndicatorStyle(() => ({ wrapper: styles })))
