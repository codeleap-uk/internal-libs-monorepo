import { Options, PropsOf } from '@codeleap/types'
import { ComponentType, useCallback } from 'react'
import { List } from '../../List'
import { MemoizedSelectDefaultItem } from './DefaultItem'
import { useSelect } from '../hooks/useSelect'

type SelectListProps<T, Multi extends boolean = false, C extends ComponentType<any> = typeof List> =
  Partial<PropsOf<C>> &
  {
    options: Options<T>
    value: Multi extends true ? T[] : T | null
    onValueChange: (newValue: Multi extends true ? T[] : T | null) => void
    Component?: C
    limit?: number
    multiple?: Multi
  }

export const SelectList = <T extends string | number, Multi extends boolean = false, C extends ComponentType<any> = typeof List>(
  props: SelectListProps<T, Multi, C>,
) => {
  const {
    options,
    value,
    onValueChange,
    Component = List,
    limit,
    multiple = false as Multi,
    ...listProps
  } = props

  const { onSelect } = useSelect(onValueChange, multiple, limit)

  const renderItem = useCallback(({ item }) => {
    const selected = multiple
      ? (value as T[])?.includes(item?.value)
      : value === item?.value

    return (
      <MemoizedSelectDefaultItem
        debugName='button'
        selected={selected}
        text={item?.label}
        onPress={() => onSelect(item)}
      />
    )
  }, [value, onSelect, multiple])

  return (
    <Component
      {...listProps}
      data={options}
      renderItem={renderItem}
      keyExtractor={(i: any) => i?.value}
    />
  )
}
