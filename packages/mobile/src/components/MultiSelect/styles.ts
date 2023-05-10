import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { SelectComposition } from '../Select'

export type MultiSelectComposition =
  SelectComposition 

const createMultiSelectStyle = createDefaultVariantFactory<MultiSelectComposition>()

export const MultiSelectPresets = includePresets(style => createMultiSelectStyle(() => ({ wrapper: style })))
