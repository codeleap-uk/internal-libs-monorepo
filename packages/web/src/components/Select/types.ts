import { ComponentVariants, FormTypes, StylesOf, yup } from "@codeleap/common"
import { CSSInterpolation } from '@emotion/css'
import { CSSObject } from "@emotion/react"
import { GroupBase, OptionProps, Props } from "react-select"
import { AsyncProps } from "react-select/async"
import { InputBaseProps } from "../InputBase"
import { SelectPresets,SelectComposition } from "./styles"

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
  multiple: Multi
  validate: FormTypes.ValidatorWithoutForm<SelectValue<T,Multi>> | yup.SchemaOf<SelectValue<T,Multi>>
  styles?: StylesOf<SelectComposition>
} & DynamicSelectProps<T, Multi>

export type TCustomOption = OptionProps & { 
  optionsStyles: (state: { isSelected: boolean }) => { 
    item: CSSInterpolation
    icon: CSSInterpolation
    text: CSSInterpolation
  }
  focused: boolean
  error: boolean
  disabled: boolean
}

export type SelectProps<T = any, Multi extends boolean = false> = React.PropsWithChildren<
  {
    debugName?: string
    css?: CSSObject
    focused?: boolean
    _error?: string
    Option: (props: TCustomOption) => JSX.Element
    Footer: () => JSX.Element
  } & ReactSelectProps<T, Multi> & ComponentVariants<typeof SelectPresets>
>
