import { Option, Options, PropsOf } from '@codeleap/types'
import { UseSelectSearchParams } from './hooks/useSelectSearch'
import { SelectableField } from '@codeleap/form'
import { ComponentType } from 'react'
import { List } from '../List'

export type SelectBaseProps<T extends string | number, Multi extends boolean = false, C extends ComponentType<any> = typeof List> =
  Pick<UseSelectSearchParams<T>, 'filterFn' | 'loadOptionsFn' | 'onLoadOptionsError'> &
  Partial<PropsOf<C>> &
  {
    options: Options<T>
    value: Multi extends true ? T[] : T | null
    onValueChange: (newValue: Multi extends true ? T[] : T | null) => void
    onSelect?: (value: T) => void
    field?: SelectableField<T, any>
    searchable?: boolean
    getLabelFn?: (optionsOrOptions: Option<T> | Options<T>) => string
    multiple?: Multi
    limit?: number
    ListComponent?: C
  }

export type SelectProps<T extends string | number, C extends ComponentType<any> = typeof List> = SelectBaseProps<T, false, C> | SelectBaseProps<T, true, C>
