import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ContentViewComposition = 'placeholder' | 'wrapper' | 'loader'

const createContentViewStyle =
  createDefaultVariantFactory<ContentViewComposition>()

export const ContentViewPresets = includePresets((styles) => createContentViewStyle(() => ({ wrapper: styles })))
