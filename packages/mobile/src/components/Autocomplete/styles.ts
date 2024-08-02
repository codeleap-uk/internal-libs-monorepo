import { ButtonComposition } from '../Button'
import { ListComposition } from '../List'
import { TextInputComposition } from '../TextInput'

type ItemStates = '' | ':selected'

type ItemParts = ButtonComposition

type ItemComposition = `${ItemParts}${ItemStates}` | ItemParts

export type AutocompleteComposition =
  'wrapper' |
  `list${Capitalize<ListComposition>}` |
  `item${Capitalize<ItemComposition>}` |
  `searchInput${Capitalize<TextInputComposition>}`
