import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ListComposition, ListParts } from '../List'

export type GridComposition = ListComposition

export type GridParts = ListParts

const createGridStyle = createDefaultVariantFactory<GridComposition>()

export const GridPresets = includePresets(style => createGridStyle(() => ({ content: style })))
