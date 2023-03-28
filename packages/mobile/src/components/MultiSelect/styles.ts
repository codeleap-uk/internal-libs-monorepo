import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { SelectComposition } from '../Select'
type ItemStates = '' | ':selected'
export type MultiSelectComposition =
  SelectComposition | `itemIcon${ItemStates}`

const createMultiSelectStyle = createDefaultVariantFactory<MultiSelectComposition>()

export const MultiSelectPresets = includePresets(style => createMultiSelectStyle(() => ({ wrapper: style })))
