import { PropsOf, StylesOf, TypeGuards } from '@codeleap/types'
import { ComponentType, useCallback } from 'react'
import { List } from '../../List'
import { useSelect } from '../hooks/useSelect'
import { SelectProps } from '../types'
import { MemoizedSelectDefaultItem } from './DefaultItem'
import { SelectItemComposition } from '../styles'

type SelectListProps<T extends string | number, C extends ComponentType<any> = typeof List> =
  Omit<PropsOf<C>, 'renderItem' | 'data'> &
  Pick<
    SelectProps<T, C>,
    'options' | 'onSelect' | 'onValueChange' | 'value' | 'limit' | 'multiple' | 'renderItem'
  > &
  {
    Component?: C
    itemStyle?: StylesOf<SelectItemComposition>
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
    renderItem: providedRenderItem,
    itemStyle,
    ...listProps
  } = props

  const { onSelect } = useSelect(
    value,
    onValueChange,
    multiple,
    limit,
    providedOnSelect,
  )

  const renderItem = useCallback(({ item, index }) => {
    const selected = multiple
      ? (value as T[])?.includes(item?.value)
      : value === item?.value

    if (TypeGuards.isFunction(providedRenderItem)) {
      return providedRenderItem({
        selected,
        item,
        index,
        onSelect: () => onSelect(item),
        style: itemStyle,
      })
    }

    return (
      <MemoizedSelectDefaultItem
        selected={selected}
        item={item}
        index={index}
        onSelect={() => onSelect(item)}
        style={itemStyle}
      />
    )
  }, [value, onSelect, multiple])

  return (
    <Component
      separators
      {...listProps}
      data={options}
      renderItem={renderItem}
      keyExtractor={(i: any) => i?.value}
    />
  )
}
