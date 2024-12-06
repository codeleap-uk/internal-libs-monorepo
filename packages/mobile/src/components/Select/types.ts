import { PropsOf } from '@codeleap/types'
import { FormTypes } from '@codeleap/form'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { StylesOf } from '../../types/utility'
import { GetKeyboardAwarePropsOptions } from '../../utils'
import { ActionIconProps } from '../ActionIcon'
import { Icon } from '../Icon'
import { FlatListProps } from '../List'
import { ModalProps } from '../Modal'
import { Text } from '../Text'
import { TextInputComposition } from '../TextInput'
import { SearchInputProps } from '../SearchInput'
import { Touchable } from '../Touchable'
import { SelectComposition } from './styles'

export type SelectRenderFNProps<T> = {
  style: StylesOf<SelectComposition>
  onPress: () => void
  selected?: boolean
  item: FormTypes.Options<T>[number]
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

export type SelectOuterInputProps<T = any, Multi extends boolean = false> = SelectProps<T, Multi> & {
  currentValueLabel: FormTypes.Label
  styles?: StylesOf<TextInputComposition>
  clearIcon?: Partial<ActionIconProps>
}

type OuterInputComponent<T, Multi extends boolean> = (props: SelectOuterInputProps<T, Multi>) => JSX.Element

export type ValueBoundSelectProps<
  T,
  Multi extends boolean = false
> = {
  options?: FormTypes.Options<T>
  defaultOptions?: FormTypes.Options<T>
  loadOptions?: (search: string) => Promise<FormTypes.Options<T>>
  value: SelectValue<T, Multi>
  renderItem?: SelectRenderFN<SelectValue<T, Multi>>
  onValueChange: (value: SelectValue<T, Multi>) => void
  filterItems?: (search: string, items: FormTypes.Options<T>) => FormTypes.Options<T>
  onLoadOptionsError?: (error: any) => void
  multiple?: Multi
  getLabel?: (forOption: Multi extends true ? FormTypes.Options<T> : FormTypes.Options<T>[number]) => FormTypes.Label
  outerInputComponent?: OuterInputComponent<T, Multi>
  inputProps?: Partial<SelectOuterInputProps<T, Multi>>
  disabled?: boolean
}

export type ReplaceSelectProps<Props, T, Multi extends boolean = false> = Omit<
  Props,
  keyof ValueBoundSelectProps<T, Multi>
> & ValueBoundSelectProps<T, Multi>

export type SelectProps<T = any, Multi extends boolean = false> =
  SelectModalProps &
  ValueBoundSelectProps<T, Multi> &
  {
    placeholder?: FormTypes.Label
    label?: FormTypes.Label
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
  }
