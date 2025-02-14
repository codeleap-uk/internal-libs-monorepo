import { FormTypes, yup } from '@codeleap/deprecated'
import { MutableRefObject } from 'react'
import { GroupBase, NoticeProps, OptionProps, Props } from 'react-select'
import { AsyncProps } from 'react-select/async'
import { ComponentCommonProps } from '../../types'
import { ButtonProps } from '../Button'
import { InputBaseProps } from '../InputBase'
import { SelectComposition, OptionState } from './styles'
import { ICSS, StyledProp } from '@codeleap/styles'

type SelectValue<T, Multi extends boolean> = Multi extends true ? T[] : T

type OmitWithValues<T> = Omit<T, 'options' | 'value' | 'isMulti' | 'loadOptions'|'styles'>

type DynamicSelectProps<T, Multi extends boolean> =
  ({
    loadOptions?: (search: string) => Promise<FormTypes.Options<T>>
    defaultValues?: FormTypes.Options<T>
  } & OmitWithValues<
    AsyncProps<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>>
  >) |
  ({
    loadOptions?: never
  } & OmitWithValues<
    Props<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>>
  >)

export type ReactSelectProps<T, Multi extends boolean = false> = Omit<InputBaseProps, 'style'> & {
  options: FormTypes.Options<T> & { itemProps?: ButtonProps }
  value: SelectValue<T, Multi>
  onValueChange?: (value: SelectValue<T, Multi>) => void
  multiple?: Multi
  validate?: FormTypes.ValidatorWithoutForm<SelectValue<T, Multi>> | yup.Schema<SelectValue<T, Multi>>
} & DynamicSelectProps<T, Multi>

export type ComponentPartProps = {
  focused: boolean
  error: boolean
  disabled: boolean
  styles: Record<SelectComposition, React.CSSProperties>
}

export type TCustomOption = OptionProps & ComponentPartProps & ComponentCommonProps & {
  optionsStyles: (state: OptionState) => OptionState['baseStyles']
  selectedIcon?: string
  data: OptionProps['data'] & { itemProps?: ButtonProps}
  itemProps?: ButtonProps
  styles?: OptionState['baseStyles']
}

type SelectPlaceholderElement = string | ((props: PlaceholderProps) => JSX.Element) | JSX.Element

export type PlaceholderProps = NoticeProps & ComponentPartProps & {
  text: SelectPlaceholderElement
  defaultStyles: {
    wrapper: ICSS
    text: ICSS
    icon: ICSS
  }
  icon: SelectPlaceholderElement
  image: HTMLImageElement['src']
} & ComponentCommonProps

export type LoadingIndicatorProps = NoticeProps & {
  defaultStyles: { wrapper: ICSS }
  size?: number
} & ComponentCommonProps

export type SelectProps<T = any, Multi extends boolean = false> = React.PropsWithChildren<
  {
    debugName: string
    clearable?: boolean
    closeOnSelect?: boolean
    focused?: boolean
    _error?: string
    renderItem?: (props: TCustomOption) => JSX.Element
    FooterComponent?: () => JSX.Element
    PlaceholderComponent?: (props: PlaceholderProps) => JSX.Element
    PlaceholderNoItemsComponent?: (props: PlaceholderProps) => JSX.Element
    LoadingIndicatorComponent?: (props: LoadingIndicatorProps) => JSX.Element
    noItemsText?: SelectPlaceholderElement
    noItemsIcon?: SelectPlaceholderElement
    noItemsImage?: PlaceholderProps['image']
    placeholderText?: SelectPlaceholderElement
    placeholderIcon?: SelectPlaceholderElement
    placeholderImage?: PlaceholderProps['image']
    showDropdownIcon?: boolean
    formatPlaceholderNoItems?: (props: PlaceholderProps & { text: string }) => string
    selectedIcon?: string
    onLoadOptionsError?: (error: any) => void
    loadOptionsOnMount?: boolean
    searchable?: boolean
    separatorMultiValue?: string
    filterItems?: Props['filterOption']
    itemProps?: ButtonProps
    loadingIndicatorSize?: number
    limit?: number
    loadInitialValue?: boolean
    loadingMessage?: string
    selectedOption?: { label: FormTypes.Label; value: T } | SelectValue<T, Multi>
    selectRef?: MutableRefObject<any>
    setSelectedOption?: (value: { label: FormTypes.Label; value: T } | SelectValue<T, Multi>) => void
    style?: StyledProp<SelectComposition>
  } & Omit<
    ReactSelectProps<T, Multi>,
    'isSearchable' | 'isClearable' | 'isDisabled' | 'loadingMessage' | 'filterOption' |
    'isLoading' | 'menuPortalTarget' | 'closeMenuOnSelect' | 'isMulti'>
>

export type UseSelectStylesProps = SelectProps & {
  styleRegistryName: string
}
