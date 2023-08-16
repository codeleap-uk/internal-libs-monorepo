import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ViewComposition } from '../View'

type ListStates = 'empty' | 'loading' 

export type ListParts = 
  ViewComposition | 
  'innerWrapper' | 
  'separator' | 
  'refreshControl' |
  'refreshControlIndicator'

export type ListComposition = `${ListParts}:${ListStates}` | ListParts

const createListStyle = createDefaultVariantFactory<ListComposition>()

export const ListPresets = includePresets(style => createListStyle(() => ({ wrapper: style })))
