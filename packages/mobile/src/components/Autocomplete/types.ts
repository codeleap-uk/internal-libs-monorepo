import { FormTypes, PropsOf } from '@codeleap/common'
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
  item: FormTypes.Options<T>[number]
  touchableProps?: Partial<PropsOf<typeof Touchable>>
  textProps?: Partial<PropsOf<typeof Text>>
  iconProps?: Partial<PropsOf<typeof Icon>>
}

export type AutocompleteRenderFN<T> = (props: AutocompleteRenderFNProps<T>) => JSX.Element

export type AutocompleteValue<T, Multi extends boolean = false> = Multi extends true ? T[] : T

export type ValueBoundAutocompleteProps<T, Multi extends boolean = false> = {
  options?: FormTypes.Options<T>
  defaultOptions?: FormTypes.Options<T>
  loadOptions?: (search: string) => Promise<FormTypes.Options<T>>
  value: AutocompleteValue<T, Multi>
  renderItem?: AutocompleteRenderFN<AutocompleteValue<T, Multi>>
  onValueChange: (value: AutocompleteValue<T, Multi>) => void
  filterItems?: (search: string, items: FormTypes.Options<T>) => FormTypes.Options<T>
  onLoadOptionsError?: (error: any) => void
  multiple?: Multi
  getLabel?: (forOption: Multi extends true ? FormTypes.Options<T> : FormTypes.Options<T>[number]) => FormTypes.Label
  onItemPressed?: (item: FormTypes.Options<T>[number]) => any
}

export type ReplaceAutocompleteProps<Props, T, Multi extends boolean = false> = Omit<
  Props,
  keyof ValueBoundAutocompleteProps<T, Multi>
> & ValueBoundAutocompleteProps<T, Multi>

export type AutocompleteProps<T = any, Multi extends boolean = false> = {
    placeholder?: string
    label?: FormTypes.Label
    closeOnSelect?: boolean
    style?: StyledProp<AutocompleteComposition>
    keyboardAware?: GetKeyboardAwarePropsOptions
    multiple?: Multi
    itemProps?: Partial<Pick<AutocompleteRenderFNProps<any>, 'iconProps'|'textProps'|'touchableProps'>>
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
    listProps?: Partial<Omit<FlatListProps<T>, 'renderItem'|'style'>>
    loading: boolean | ((isLoading: boolean) => boolean)
  }
    & Omit<FlatListProps<T>, 'renderItem'|'style'>
    & ValueBoundAutocompleteProps<T, Multi>
