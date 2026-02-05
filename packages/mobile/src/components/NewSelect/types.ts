import { Option, Options } from '@codeleap/types'
import { UseSelectSearchParams } from './hooks/useSelectSearch'
import { SelectableField } from '@codeleap/form'

export type SelectBaseProps<T extends string | number, Multi extends boolean = false> =
  Pick<UseSelectSearchParams<T>, 'filterFn' | 'loadOptionsFn' | 'onLoadOptionsError'> &
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
  }

export type SelectProps<T extends string | number> = SelectBaseProps<T, false> | SelectBaseProps<T, true>
