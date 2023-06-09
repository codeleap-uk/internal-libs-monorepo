import { ButtonComposition, createDefaultVariantFactory, includePresets, TextInputComposition } from '@codeleap/common'
import { ListComposition } from '../List'

type ItemStates = '' | ':selected'

type ItemParts = ButtonComposition

type ItemComposition = `${ItemParts}${ItemStates}` | ItemParts

export type AutocompleteComposition =
  'wrapper' |
  `list${Capitalize<ListComposition>}` |
  `item${Capitalize<ItemComposition>}` |
  `searchInput${Capitalize<TextInputComposition>}`

const createSelectStyle = createDefaultVariantFactory<AutocompleteComposition>()

export const AutocompletePresets = includePresets((style) => createSelectStyle(() => ({ wrapper: style })))
