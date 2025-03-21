import { Option, Options, PropsOf } from '@codeleap/types'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { GetKeyboardAwarePropsOptions, StylesOf } from '../../types/utility'
import { ActionIconProps } from '../ActionIcon'
import { Icon } from '../Icon'
import { FlatListProps } from '../List'
import { ModalProps } from '../Modal'
import { Text } from '../Text'
import { TextInputComposition } from '../TextInput'
import { SearchInputProps } from '../SearchInput'
import { Touchable } from '../Touchable'
import { SelectComposition } from './styles'
import { SelectableField } from '@codeleap/form'

export type SelectRenderFNProps<T> = {
  style: StylesOf<SelectComposition>
  onPress: () => void
  selected?: boolean
  item: Option<T>
  touchableProps?: Partial<PropsOf<typeof Touchable>>
  textProps?: Partial<PropsOf<typeof Text>>
  iconProps?: Partial<PropsOf<typeof Icon>>
  index: number
  debugName: string
  text?: string
}

export type SelectRenderFN<T> = (props: SelectRenderFNProps<T>) => JSX.Element

type SelectModalProps = Omit<ModalProps, 'style'>

export type SelectValue<T, Multi extends boolean = false> = Multi extends true ? T[] : T

type SelectHeaderProps = {
  searchComponent?: React.ReactNode
}

export type SelectOuterInputProps<T extends string | number = any, Multi extends boolean = false> = SelectProps<T, Multi> & {
  currentValueLabel: string
  styles?: StylesOf<TextInputComposition>
  clearIcon?: Partial<ActionIconProps>
}

type OuterInputComponent<T extends string | number, Multi extends boolean> = (props: SelectOuterInputProps<T, Multi>) => JSX.Element

export type ValueBoundSelectProps<
  T extends string | number,
  Multi extends boolean = false
> = {
  options?: Options<T>
  defaultOptions?: Options<T>
  loadOptions?: (search: string) => Promise<Options<T>>
  renderItem?: SelectRenderFN<SelectValue<T, Multi>>
  filterItems?: (search: string, items: Options<T>) => Options<T>
  onLoadOptionsError?: (error: any) => void
  multiple?: Multi
  getLabel?: (forOption: Multi extends true ? Options<T> : Option<T>) => string
  outerInputComponent?: OuterInputComponent<T, Multi>
  inputProps?: Partial<SelectOuterInputProps<T, Multi>>
  disabled?: boolean
}

export type ReplaceSelectProps<Props, T extends string | number, Multi extends boolean = false> = Omit<
  Props,
  keyof ValueBoundSelectProps<T, Multi>
> & ValueBoundSelectProps<T, Multi>

export type SelectProps<T extends string | number = any, Multi extends boolean = false> =
  SelectModalProps &
  ValueBoundSelectProps<T, Multi> &
  {
    placeholder?: string
    label?: string
    hideInput?: boolean
    selectedIcon?: AppIcon
    arrowIconName?: AppIcon
    closeOnSelect?: boolean
    listProps?: Partial<FlatListProps>
    clearable?: boolean
    clearIconName?: AppIcon
    keyboardAware?: GetKeyboardAwarePropsOptions
    multiple?: Multi
    itemProps?: Partial<Pick<SelectRenderFNProps<any>, 'iconProps' | 'textProps' | 'touchableProps'>>
    searchable?: boolean
    limit?: number
    ListHeaderComponent?: React.ComponentType<SelectHeaderProps>
    ListComponent?: React.ComponentType<any>
    searchInputProps?: Partial<SearchInputProps>
    loadOptionsOnMount?: boolean
    loadOptionsOnOpen?: boolean
    style?: StyledProp<SelectComposition>
    field?: SelectableField<T, any>
    value?: T
    onValueChange?: (value: T) => void
    onSelect?: (value: T) => void
  }
