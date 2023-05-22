import { ButtonComposition, createDefaultVariantFactory, includePresets, TextInputComposition } from '@codeleap/common'
import { ListComposition } from '../List'
import { ModalComposition } from '../Modal'
type ItemStates = '' | ':selected'


type ItemParts = ButtonComposition

type ItemComposition = `${ItemParts}${ItemStates}` | ItemParts

export type SelectComposition =
  ModalComposition |
  `input${Capitalize<TextInputComposition>}` |
  `list${Capitalize<ListComposition>}` |
  `item${Capitalize<ItemComposition>}` |
  `searchInput${Capitalize<TextInputComposition>}`

const createSelectStyle = createDefaultVariantFactory<SelectComposition>()

export const SelectPresets = includePresets((style) => createSelectStyle(() => ({ body: style })))
