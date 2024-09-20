import { AppIcon, ICSS, StyledProp } from '@codeleap/styles'
import { PlacesAutocompleteComposition } from './styles'
import { TextInputProps } from '../TextInput'
import { FlatListProps } from '../List'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { PlaceAddress, PlaceLatLng } from '@codeleap/common'

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
