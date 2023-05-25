import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ScrollComposition } from '../Scroll/styles'


type ListStates = 'empty' | 'loading' 

type ListParts = ScrollComposition | 'separator' | 'header' | 'refreshControl'

export type ListComposition = `${ListParts}:${ListStates}` | ListParts

const createListStyle = createDefaultVariantFactory<ListComposition>()

export const ListPresets = includePresets(style => createListStyle(() => ({ content: style })))
