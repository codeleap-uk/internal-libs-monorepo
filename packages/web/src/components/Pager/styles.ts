import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type PagerComposition =
  | 'wrapper'
  | 'dot'
  | 'dot:selected'
  | 'dots'
  | 'pageWrapper'
  | 'footerWrapper'

const createPagerStyle = createDefaultVariantFactory<PagerComposition>()

export const PagerPresets = includePresets((styles) => createPagerStyle(() => ({ wrapper: styles })),
)
