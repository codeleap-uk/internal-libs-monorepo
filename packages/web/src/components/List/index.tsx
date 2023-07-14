import React from 'react'
import { useDefaultComponentStyle, useCallback } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { ListPresets } from './styles'
import { VirtualItem } from '@tanstack/react-virtual'
import { useInfiniteScroll } from './useInfiniteScroll'
import { ListProps } from './types'
import { ListLayout } from './ListLayout'

export * from './styles'
export * from './PaginationIndicator'
export * from './useInfiniteScroll'
export * from './types'
export * from './ListLayout'

const RenderSeparator = (props: { separatorStyles: ViewProps<'div'>['css'] }) => {
  return (
    <View css={[props?.separatorStyles]}></View>
  )
}

const defaultProps: Partial<ListProps> = {
  ListFooterComponent: null,
  ListHeaderComponent: null,
  ListLoadingIndicatorComponent: null,
  ListRefreshControlComponent: null,
  ListEmptyComponent: EmptyPlaceholder,
  ListSeparatorComponent: RenderSeparator,
  refreshDebounce: 3000,
  refreshSize: 40,
  refreshThreshold: 1,
  refreshPosition: 2,
  refresh: true,
}

const ListCP = React.forwardRef<'div', ListProps>((flatListProps, ref) => {
  const allProps = {
    ...defaultProps,
    ...flatListProps,
  }

  const {
    variants = [],
    responsiveVariants = {},
    styles = {},
    ListLoadingIndicatorComponent,
    renderItem: RenderItem,
    ListSeparatorComponent,
    data,
    separators,
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:List', typeof ListPresets>('u:List', {
    variants,
    responsiveVariants,
    styles,
  })

  const {
    items,
    dataVirtualizer,
    layoutProps,
  } = useInfiniteScroll(allProps)

  const separator = separators && <ListSeparatorComponent separatorStyles={variantStyles.separator} />

  const renderItem = useCallback((_item: VirtualItem) => {
    if (!RenderItem) return null

    const showIndicator = (_item?.index > data?.length - 1) && !!ListLoadingIndicatorComponent

    const listLength = data?.length || 0

    const isFirst = _item?.index === 0
    const isLast = _item?.index === listLength - 1

    const isOnly = isFirst && isLast

    const _itemProps = {
      ..._item,
      isOnly,
      isLast,
      isFirst,
      item: data?.[_item?.index]
    }

    return (
      <div
        css={[variantStyles.itemWrapper]}
        key={_item?.key}
        data-index={_item?.index}
        ref={dataVirtualizer?.measureElement}
      >
        {!isFirst && separator}
        {showIndicator && <ListLoadingIndicatorComponent />}
        {!!_itemProps?.item && <RenderItem {..._itemProps} />}
      </div>
    )
  }, [RenderItem, data?.length, dataVirtualizer?.measureElement])

  return (
    <ListLayout
      {...allProps}
      {...layoutProps}
      variantStyles={variantStyles} // @ts-ignore
      ref={ref}
    >
      {/* Necessary for correct list render */}
      <div css={[variantStyles.list, { transform: `translateY(${items?.[0]?.start}px)` }]}>
        {items?.map((item) => renderItem(item))}
      </div>
    </ListLayout>
  )
})

export type ListComponentType = <T extends any[] = any[]>(props: ListProps<T>) => React.ReactElement

export const List = ListCP as unknown as ListComponentType
