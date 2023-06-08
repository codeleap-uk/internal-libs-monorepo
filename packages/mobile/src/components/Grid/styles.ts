import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ListComposition } from '../List'

export type GridComposition = ListComposition | 'itemWrapper'

const createGridStyle = createDefaultVariantFactory<GridComposition>()

export const GridPresets = includePresets(style => createGridStyle(() => ({ content: style })))
