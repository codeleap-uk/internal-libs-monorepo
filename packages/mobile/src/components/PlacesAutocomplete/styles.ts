import { ActivityIndicatorComposition } from '../ActivityIndicator'
import { ListComposition } from '../List'
import { TextInputComposition } from '../TextInput'

export type PlacesAutocompleteComposition =
  `input${Capitalize<TextInputComposition>}` |
  `list${Capitalize<ListComposition>}` |
  `loader${Capitalize<ActivityIndicatorComposition>}` |
  'placeRowWrapper' |
  'placeRowText' |
  'wrapper' |
  'loadingWrapper'
