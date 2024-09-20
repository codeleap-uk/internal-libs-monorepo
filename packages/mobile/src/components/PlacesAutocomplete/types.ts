import { AppIcon, ICSS, StyledProp } from '@codeleap/styles'
import { PlacesAutocompleteComposition } from './styles'
import { TextInputProps } from '../TextInput'
import { FlatListProps } from '../List'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ActivityIndicatorProps } from '../ActivityIndicator'

// TODO - put these types into common together with the usePlaces hook
export type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

export type LatLng = {
  lat: number
  lng: number
}

export type GeometryBounds = {
  northeast: LatLng
  southwest: LatLng
}

export type Geometry = {
  location: LatLng
  location_type: string
  viewport: GeometryBounds
}

export type PlusCode = {
  compound_code: string
  global_code: string
}

export type MatchedSubstring = {
  length: number
  offset: number
}

export type Term = {
  offset: number
  value: string
}

export type Photo = {
  height: number
  html_attributions: string[]
  photo_reference: string
  width: number
}

export type PlaceDetails = {
  address_components: AddressComponent[]
  adr_address: string
  formatted_address: string
  geometry: Geometry
  icon: string
  icon_background_color: string
  icon_mask_base_uri: string
  name: string
  place_id: string
  reference: string
  types: string[]
  url: string
  utc_offset: number
  vicinity: string

  // NOTE - some places return photos when details is true
  // e.g Toronto, Canada
  photos?: Photo[]
  website?: string
}

export type PlaceLatLngDetails = PlaceDetails & {
  plus_code: PlusCode
}

export type PlaceAddress = {
  description: string
  matched_substrings: MatchedSubstring[]
  place_id: string
  reference: string
  structured_formatting: {
    main_text: string
    main_text_matched_substrings: MatchedSubstring[]
    secondary_text: string
  }
  terms: Term[]
  types: string[]

  details?: PlaceDetails
}

// when searching using latlng with showDetails false
export type PlaceLatLng = {
  address_components: AddressComponent[]
  formatted_address: string
  geometry: Geometry
  place_id: string
  plus_code: PlusCode
  types: string[]

  detauls?: PlaceLatLngDetails
}

// component types
export type CustomData = {
  item?: Partial<PlaceAddress> & Partial<PlaceLatLng>
  content?: JSX.Element
}

export type PlaceRowProps = {
  item?: PlaceAddress & PlaceLatLng & { content?: JSX.Element }
  styles?: Record<PlacesAutocompleteComposition, ICSS>
  onPress?: PlacesAutocompleteProps['onPress']
}

export type PlacesAutocompleteProps = {
  style?: StyledProp<PlacesAutocompleteComposition>
  itemRow?: (props: any) => JSX.Element
  textInputProps?: TextInputProps
  emptyPlaceholderProps?: EmptyPlaceholderProps
  listProps?: FlatListProps
  data: PlaceAddress[] | PlaceLatLng[]
  customData?: CustomData[]
  onPress?: (address: string) => void
  onValueChange?: (address: string) => void
  showClearIcon?: boolean
  showEmptyPlaceholder?: boolean
  clearIcon?: AppIcon
  placeRowComponent?: React.ComponentType<PlaceRowProps>
  renderPlaceRow?: (props: PlaceRowProps) => React.ReactElement
  placeRow?: React.ReactElement
  debounce?: number
  activityIndicatorProps?: ActivityIndicatorProps
  persistResultsOnBlur?: boolean
  isLoading?: boolean
}
