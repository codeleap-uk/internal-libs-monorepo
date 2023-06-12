import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ScrollComposition = 'wrapper' |'content'

const createScrollStyle = createDefaultVariantFactory<ScrollComposition>()

export const ScrollPresets = includePresets(style => createScrollStyle(() => ({ content: style })))
