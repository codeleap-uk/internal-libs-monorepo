import { ButtonComposition, createDefaultVariantFactory, includePresets, TextInputComposition } from '@codeleap/common'
import { ListComposition } from '../List'
import { ModalComposition } from '../Modal'
type ItemStates = '' | ':selected'

type ItemParts = ButtonComposition

type ItemComposition = `${ItemParts}${ItemStates}` | ItemParts

export type AutocompleteComposition =
  ModalComposition |
  `input${Capitalize<TextInputComposition>}` |
  `list${Capitalize<ListComposition>}` |
  `item${Capitalize<ItemComposition>}` |
  `searchInput${Capitalize<TextInputComposition>}`

const createSelectStyle = createDefaultVariantFactory<AutocompleteComposition>()

export const AutocompletePresets = includePresets((style) => createSelectStyle(() => ({ body: style })))
