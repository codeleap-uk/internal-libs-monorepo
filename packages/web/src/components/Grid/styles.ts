import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ListComposition, ListParts } from '../List'

export type GridParts = ListParts | 'column'

export type GridComposition = ListComposition | GridParts

const createGridStyle = createDefaultVariantFactory<GridComposition>()

export const GridPresets = includePresets(style => createGridStyle(() => ({ content: style })))
