import {
  createDefaultVariantFactory,
  includePresets,
} from '@codeleap/common'


export type PagerComposition =
  | 'page'
  | 'wrapper'

const createPagerStyle = createDefaultVariantFactory<PagerComposition>()

export const PagerPresets = includePresets((style) => createPagerStyle(() => ({ wrapper: style })))

