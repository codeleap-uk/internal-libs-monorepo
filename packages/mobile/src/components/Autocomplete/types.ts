import { Option, Options, PropsOf } from '@codeleap/types'
import { StylesOf } from '../../types/utility'
import { GetKeyboardAwarePropsOptions } from '../../utils'
import { Icon } from '../Icon'
import { FlatListProps } from '../List'
import { Text } from '../Text'
import { SearchInputProps } from '../SearchInput'
import { Touchable } from '../Touchable'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { AutocompleteComposition } from './styles'

export type AutocompleteRenderFNProps<T> = {
  style?: StylesOf<AutocompleteComposition>
  onPress: () => void
  isSelected?: boolean
  item: Option<T>
  touchableProps?: Partial<PropsOf<typeof Touchable>>
  textProps?: Partial<PropsOf<typeof Text>>
  iconProps?: Partial<PropsOf<typeof Icon>>
}

export type AutocompleteRenderFN<T> = (props: AutocompleteRenderFNProps<T>) => JSX.Element

export type AutocompleteValue<T, Multi extends boolean = false> = Multi extends true ? T[] : T

export type ValueBoundAutocompleteProps<T, Multi extends boolean = false> = {
  options?: Options<T>
  defaultOptions?: Options<T>
  loadOptions?: (search: string) => Promise<Options<T>>
  value: AutocompleteValue<T, Multi>
  renderItem?: AutocompleteRenderFN<AutocompleteValue<T, Multi>>
  onValueChange: (value: AutocompleteValue<T, Multi>) => void
  filterItems?: (search: string, items: Options<T>) => Options<T>
  onLoadOptionsError?: (error: any) => void
  multiple?: Multi
  getLabel?: (forOption: Multi extends true ? Options<T> : Options<T>[number]) => string
  onItemPressed?: (item: Options<T>[number]) => any
}

export type ReplaceAutocompleteProps<Props, T, Multi extends boolean = false> = Omit<
  Props,
  keyof ValueBoundAutocompleteProps<T, Multi>
> & ValueBoundAutocompleteProps<T, Multi>

export type AutocompleteProps<T = any, Multi extends boolean = false> =
  Omit<FlatListProps<T>, 'renderItem' | 'style'> &
  ValueBoundAutocompleteProps<T, Multi> &
  {
    placeholder?: string
    label?: string
    closeOnSelect?: boolean
    style?: StyledProp<AutocompleteComposition>
    keyboardAware?: GetKeyboardAwarePropsOptions
    multiple?: Multi
    itemProps?: Partial<Pick<AutocompleteRenderFNProps<any>, 'iconProps' | 'textProps' | 'touchableProps'>>
    searchable?: boolean
    limit?: number
    selectedIcon?: AppIcon
    loadOptionsOnMount?: boolean
    loadOptionsOnOpen?: boolean
    selectable?: boolean
    searchInputProps?: Partial<SearchInputProps>
    debugName: string
    searchComponent?: React.ComponentType<SearchInputProps>
    listPlaceholder?: Partial<EmptyPlaceholderProps>
    listProps?: Partial<Omit<FlatListProps<T>, 'renderItem' | 'style'>>
    loading: boolean | ((isLoading: boolean) => boolean)
  }
