import { PropsOf } from '@codeleap/types'
import { ComponentType, useCallback } from 'react'
import { List } from '../../List'
import { MemoizedSelectDefaultItem } from './DefaultItem'
import { useSelect } from '../hooks/useSelect'
import { SelectProps } from '../types'

type SelectListProps<T extends string | number, C extends ComponentType<any> = typeof List> =
  PropsOf<C> &
  Pick<
    SelectProps<T, C>,
    'options' | 'onSelect' | 'onValueChange' | 'value' | 'limit' | 'multiple'
  > &
  {
    Component?: C
  }

export const SelectList = <T extends string | number, C extends ComponentType<any> = typeof List>(
  props: SelectListProps<T, C>,
) => {
  const {
    options,
    value,
    onValueChange,
    Component = List,
    limit,
    multiple = false,
    onSelect: providedOnSelect,
    ...listProps
  } = props

  const { onSelect } = useSelect(
    value,
    onValueChange,
    multiple,
    limit,
    providedOnSelect,
  )

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
