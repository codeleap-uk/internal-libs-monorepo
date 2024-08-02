import { ButtonComposition } from '../Button'
import { ListComposition } from '../List'
import { ModalComposition } from '../Modal'
import { TextInputComposition } from '../TextInput'

type ItemStates = '' | ':selected'

type ItemParts = ButtonComposition

type ItemComposition = `${ItemParts}${ItemStates}` | ItemParts

export type SelectComposition =
  ModalComposition |
  `input${Capitalize<TextInputComposition>}` |
  `list${Capitalize<ListComposition>}` |
  `item${Capitalize<ItemComposition>}` |
  `searchInput${Capitalize<TextInputComposition>}`
