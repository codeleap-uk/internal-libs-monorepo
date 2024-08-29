import { StyledProp } from '@codeleap/styles'
import { PlacesAutocompleteComposition } from './styles'
import { GooglePlacesAutocompleteProps } from 'react-native-google-places-autocomplete'

export type PlacesAutocompleteProps = GooglePlacesAutocompleteProps & {
  style?: StyledProp<PlacesAutocompleteComposition>
}
