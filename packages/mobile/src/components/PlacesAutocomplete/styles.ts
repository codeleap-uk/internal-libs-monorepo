import { ListComposition } from '../List'
import { TextInputComposition } from '../TextInput'

export type PlacesAutocompleteComposition = `input${Capitalize<TextInputComposition>}` | `list${Capitalize<ListComposition>}`
