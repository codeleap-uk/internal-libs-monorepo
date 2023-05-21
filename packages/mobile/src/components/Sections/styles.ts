import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type SectionsComposition = 'wrapper' |'content' | 'separator'

const createSectionsStyle = createDefaultVariantFactory<SectionsComposition>()

export const SectionsPresets = includePresets(style => createSectionsStyle(() => ({ content: style })))
