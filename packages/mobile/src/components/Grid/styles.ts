import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ListComposition } from '../List'

export type GridComposition = ListComposition | 'itemWrapper' | 'footer'

const createGridStyle = createDefaultVariantFactory<GridComposition>()

export const GridPresets = includePresets(style => createGridStyle(() => ({ content: style })))
