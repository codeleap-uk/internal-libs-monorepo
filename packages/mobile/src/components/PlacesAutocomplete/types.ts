import { StyledProp } from '@codeleap/styles'
import { PlacesAutocompleteComposition } from './styles'
import { TextInputProps } from '../TextInput'
import { FlatListProps } from '../List'

export type MatchedSubstrings = {
  length: number
  offset: number
}

export type StructureFormatting = {
  main_text: string
  main_text_matched_substrings: MatchedSubstrings[]
  secondary_text: string
}

export type Term = {
  offset: number
  value: string
}

export type Predictions = {
  description: string
  matched_substrings: MatchedSubstrings[]
  place_id: string
  reference: string
  structured_formatting: StructureFormatting
  terms: Term[]
  types: string[]
}

export type PlacesAutocompleteProps = {
  style?: StyledProp<PlacesAutocompleteComposition>
  itemRow?: (props: any) => JSX.Element
  textInputProps?: TextInputProps
  listProps?: FlatListProps
  data?: Predictions[]
  onPress?: (address: string) => void
  onValueChange?: (address: string) => void
  showClearIcon?: boolean
}
