import { createDefaultVariantFactory, includePresets, TextInputComposition } from '@codeleap/common'
import { ListComposition } from '../List'
import { ModalComposition } from '../Modal'
type ItemStates = '' | ':selected'
export type SelectComposition =
  ModalComposition |
  `input${TextInputComposition}` |
  `list${Capitalize<ListComposition>}` |
  'listContent' |
  `itemWrapper${ItemStates}` |
  `itemText${ItemStates}` |
  `itemIcon${ItemStates}`

const createSelectStyle = createDefaultVariantFactory<SelectComposition>()

export const SelectPresets = includePresets((style) => createSelectStyle(() => ({ body: style })))
