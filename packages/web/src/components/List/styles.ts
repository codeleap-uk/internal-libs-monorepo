import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ViewComposition } from '../View'

type ListStates = 'empty' | 'loading' 

export type ListParts = ViewComposition | 'innerWrapper' | 'content' | 'separator' | 'header' | 'refreshControl'

export type ListComposition = `${ListParts}:${ListStates}` | ListParts

const createListStyle = createDefaultVariantFactory<ListComposition>()

export const ListPresets = includePresets(style => createListStyle(() => ({ wrapper: style })))
