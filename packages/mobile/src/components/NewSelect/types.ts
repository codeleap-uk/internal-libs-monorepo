import { AnyFunction, Option, Options, PropsOf, StylesOf } from '@codeleap/types'
import { UseSelectSearchParams } from './hooks/useSelectSearch'
import { SelectableField } from '@codeleap/form'
import { ComponentType } from 'react'
import { List } from '../List'
import { ModalProps } from '../Modal'
import { TextInputProps } from '../TextInput'
import { SearchInputProps } from '../SearchInput'
import { SelectComposition } from './styles'
import { AppIcon } from '@codeleap/styles'

export type SelectBaseProps<T extends string | number, Multi extends boolean = false, C extends ComponentType<any> = typeof List> =
  Pick<UseSelectSearchParams<T>, 'filterFn' | 'loadOptionsFn' | 'onLoadOptionsError'> &
  {
    options: Options<T>
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
    modalProps?: Omit<ModalProps, 'visible' | 'toggle'>
    inputProps?: Partial<TextInputProps>
    searchInputProps?: Partial<SearchInputProps>
    listProps?: Partial<PropsOf<C>>
    hideInput?: boolean
    closeOnSelect?: boolean

    style?: StylesOf<SelectComposition>
    selectedIcon?: AppIcon
    clearIcon?: AppIcon
    selectIcon?: AppIcon
    clearable?: boolean
  }

export type SelectProps<T extends string | number, C extends ComponentType<any> = typeof List> = SelectBaseProps<T, false, C> | SelectBaseProps<T, true, C>
