import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActivityIndicatorComposition } from '../ActivityIndicator'

export type EmptyPlaceholderComposition =
  | 'wrapper:loading'
  | `loader${Capitalize<ActivityIndicatorComposition>}`
  | 'wrapper'
  | 'title'
  | 'description'
  | 'image'
  | 'imageWrapper'
  | 'icon'

const createEmptyPlaceholderStyle = createDefaultVariantFactory<EmptyPlaceholderComposition>()

export const EmptyPlaceholderPresets = includePresets((styles) => createEmptyPlaceholderStyle(() => ({ wrapper: styles })))
