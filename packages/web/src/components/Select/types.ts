import { ComponentVariants, FormTypes, StylesOf, yup } from "@codeleap/common"
import { CSSInterpolation } from '@emotion/css'
import { CSSObject } from "@emotion/react"
import { GroupBase, NoticeProps, OptionProps, Props } from "react-select"
import { AsyncProps } from "react-select/async"
import { ButtonProps } from '../Button'
import { InputBaseProps } from "../InputBase"
import { SelectPresets,SelectComposition, OptionState } from "./styles"

type SelectValue<T,Multi extends boolean> = Multi extends true ? T[] : T

type OmitWithValues<T> =  Omit<T, 'options' | 'value' | 'isMulti' | 'loadOptions'|'styles'>

type DynamicSelectProps<T, Multi extends boolean> = 
  ({
    loadOptions?: (search: string) => Promise<FormTypes.Options<T>> 
    defaultValues?: FormTypes.Options<T>
  } &  OmitWithValues<
    AsyncProps<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>>
  >) | 
  ({
    loadOptions?: never
  } & OmitWithValues<
    Props<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>>
  >)
 
export type ReactSelectProps<T, Multi extends boolean = false> = Omit<InputBaseProps , 'styles' | 'variants'> &{
  options: FormTypes.Options<T>
  value: SelectValue<T,Multi>
  onValueChange?: (value: SelectValue<T,Multi>) => void
  multiple?: Multi
  validate?: FormTypes.ValidatorWithoutForm<SelectValue<T,Multi>> | yup.SchemaOf<SelectValue<T,Multi>>
  styles?: StylesOf<SelectComposition>
} & DynamicSelectProps<T, Multi>

export type ComponentPartProps = {
  focused: boolean
  error: boolean
  disabled: boolean
  variantStyles: Record<SelectComposition, React.CSSProperties>
}

export type TCustomOption = OptionProps & ComponentPartProps & { 
  optionsStyles: (state: OptionState) => OptionState['baseStyles']
  selectedIcon?: string
  itemProps?: ButtonProps
}

export type PlaceholderProps = NoticeProps & ComponentPartProps & { 
  text: string | ((props: PlaceholderProps) => JSX.Element)
  defaultStyles: {
    wrapper: CSSInterpolation
    text: CSSInterpolation
    icon: CSSInterpolation
  }
  icon: string
}

export type LoadingIndicatorProps = NoticeProps & { 
  defaultStyles: { wrapper: CSSInterpolation }
  size?: number
}

export type SelectProps<T = any, Multi extends boolean = false> = React.PropsWithChildren<
  {
    debugName?: string
    clearable?: boolean
    closeOnSelect?: boolean
    css?: CSSObject
    focused?: boolean
    _error?: string
    renderItem?: (props: TCustomOption) => JSX.Element
    FooterComponent?: () => JSX.Element
    PlaceholderComponent?: (props: PlaceholderProps) => JSX.Element
    PlaceholderNoItemsComponent?: (props: PlaceholderProps) => JSX.Element
    LoadingIndicatorComponent?: (props: LoadingIndicatorProps) => JSX.Element
    noItemsText?: string | ((props: PlaceholderProps) => JSX.Element) | null
    noItemsIcon?: string | null
    placeholderText?: string | ((props: PlaceholderProps) => JSX.Element) | null
    placeholderIcon?: string | null
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
  } & Omit<
    ReactSelectProps<T, Multi>, 
    'isSearchable' | 'isClearable' | 'isDisabled' | 'loadingMessage' | 'filterOption' |
    'isLoading' | 'menuPortalTarget' | 'closeMenuOnSelect' | 'isMulti'> 
    & ComponentVariants<typeof SelectPresets>
>
