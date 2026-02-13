import { AnyFunction, Option, Options, PropsOf, StylesOf } from '@codeleap/types'
import { UseSelectSearchParams } from './hooks/useSelectSearch'
import { SelectableField } from '@codeleap/form'
import { ComponentType, ReactElement } from 'react'
import { List } from '../List'
import { ModalProps } from '../Modal'
import { TextInputProps } from '../TextInput'
import { SearchInputProps } from '../SearchInput'
import { SelectComposition, SelectItemComposition } from './styles'
import { AppIcon } from '@codeleap/styles'

export type SelectRenderItemInfo<T> = {
  onSelect: () => void
  selected: boolean
  item: Option<T>
  index: number
  style: StylesOf<SelectItemComposition>
}

export type SelectInputComponentProps<T extends string | number = any, Multi extends boolean = false> = {
  options: Options<T>
  value: Multi extends true ? T[] : T | null
  onValueChange: (newValue: Multi extends true ? T[] : T | null) => void
  toggle: AnyFunction
  getLabelFn?: (optionsOrOptions: Option<T> | Options<T>) => string
  disabled?: boolean
  placeholder?: string
  multiple?: Multi
  clearIcon?: AppIcon
  selectIcon?: AppIcon
  clearable?: boolean
  style?: any
}

export type SelectBaseProps<T extends string | number, Multi extends boolean = false, C extends ComponentType<any> = typeof List> =
  Pick<UseSelectSearchParams<T>, 'filterFn' | 'loadOptionsFn' | 'onLoadOptionsError'> &
  {
    options?: Options<T>
    value?: Multi extends true ? T[] : T | null
    onValueChange?: (newValue: Multi extends true ? T[] : T | null) => void
    onSelect?: (option: Option<T>) => void
    field?: SelectableField<T, any>
    searchable?: boolean
    getLabelFn?: (optionsOrOptions: Option<T> | Options<T>) => string
    multiple?: Multi
    limit?: number
    ListComponent?: C
    visible?: boolean
    toggle?: AnyFunction
    disabled?: boolean
    placeholder?: string
    label?: string
    modalProps?: Partial<Omit<ModalProps, 'visible' | 'toggle'>>
    inputProps?: Omit<TextInputProps, 'style' | 'value' | 'onValueChange'>
    searchInputProps?: Partial<Omit<SearchInputProps, 'style'>>
    listProps?: Omit<PropsOf<C>, 'style'>
    hideInput?: boolean
    closeOnSelect?: boolean
    clearIcon?: AppIcon
    selectIcon?: AppIcon
    clearable?: boolean
    renderItem?: (info: SelectRenderItemInfo<T>) => ReactElement
    SelectInputComponent?: ComponentType<SelectInputComponentProps<T, Multi>>
    style?: StylesOf<SelectComposition>
  }

export type SelectProps<T extends string | number, C extends ComponentType<any> = typeof List> = SelectBaseProps<T, false, C> | SelectBaseProps<T, true, C>
