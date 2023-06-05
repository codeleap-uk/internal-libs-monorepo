import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
  PropsOf,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { GetKeyboardAwarePropsOptions } from '../../utils'
import { ActionIconProps } from '../ActionIcon'
import { Icon } from '../Icon'
import { FlatListProps } from '../List'
import { ModalProps } from '../Modal'
import { Text } from '../Text'
import { TextInputComposition, TextInputProps } from '../TextInput'
import { Touchable } from '../Touchable'
import { SearchHeaderProps } from './SearchHeader'
import { SelectComposition, SelectPresets } from './styles'

export type SelectRenderFNProps<T> = {
  styles: StylesOf<SelectComposition>
  onPress: () => void
  isSelected?: boolean
  item: FormTypes.Options<T>[number]
  touchableProps?: Partial<PropsOf<typeof Touchable>>
  textProps?: Partial<PropsOf<typeof Text>>
  iconProps?: Partial<PropsOf<typeof Icon>>
}

export type SelectRenderFN<T> = (props: SelectRenderFNProps<T>) => JSX.Element

type SelectModalProps = Omit<ModalProps, 'variants' | 'styles'>

export type SelectValue<T, Multi extends boolean = false> = Multi extends true ? T[] : T

type SelectHeaderProps = {
  searchComponent?: React.ReactNode
}

type OuterInputProps<T = any, Multi extends boolean = false> = Omit<SelectProps<T, Multi>, 'variants'| 'styles'> & {
  currentValueLabel: FormTypes.Label
  styles?: StylesOf<TextInputComposition>
  clearIcon?: Partial<ActionIconProps>
}

export type ValueBoundSelectProps<T, Multi extends boolean = false> = {
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
  outerInputComponent?: React.ComponentType<OuterInputProps<T, Multi>>
}

export type ReplaceSelectProps<Props, T, Multi extends boolean = false> = Omit<
  Props,
  keyof ValueBoundSelectProps<T, Multi>
> & ValueBoundSelectProps<T, Multi>

export type SelectProps<T = any, Multi extends boolean = false> = {
    placeholder?: FormTypes.Label
    label?: FormTypes.Label
    styles?: StylesOf<SelectComposition>
    style?: TextInputProps['style']
    hideInput?: boolean
    selectedIcon?: IconPlaceholder
    arrowIconName?: IconPlaceholder
    closeOnSelect?: boolean
    inputProps?: Partial<TextInputProps>
    listProps?: Partial<FlatListProps>
    clearable?: boolean
    clearIconName?: IconPlaceholder
    keyboardAware?: GetKeyboardAwarePropsOptions
    multiple?: Multi
    itemProps?: Partial<
      Pick<SelectRenderFNProps<any>, 'iconProps'|'textProps'|'touchableProps'
    >>
    searchable?: boolean
    limit?: number
    ListHeaderComponent?: React.ComponentType<SelectHeaderProps>
    searchInputProps?: Partial<SearchHeaderProps>
    loadOptionsOnMount?: boolean
    loadOptionsOnOpen?: boolean

  } & ComponentVariants<typeof SelectPresets> & SelectModalProps & ValueBoundSelectProps<T, Multi>

