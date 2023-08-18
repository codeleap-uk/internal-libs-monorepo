import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ListComposition, ListParts } from '../List'

export type GridParts = ListParts

export type GridComposition = ListComposition | GridParts

const createGridStyle = createDefaultVariantFactory<GridComposition>()

export const GridPresets = includePresets(style => createGridStyle(() => ({ wrapper: style })))
