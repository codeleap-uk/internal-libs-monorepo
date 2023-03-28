import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ScrollComposition } from '../Scroll/styles'

export type ListComposition = ScrollComposition | 'separator'

const createListStyle = createDefaultVariantFactory<ListComposition>()

export const ListPresets = includePresets(style => createListStyle(() => ({ content: style })))
