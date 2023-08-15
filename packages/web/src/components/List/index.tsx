import React from 'react'
import { useDefaultComponentStyle, useCallback } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { ListPresets } from './styles'
// import { VirtualItem } from '@tanstack/react-virtual'
import { useInfiniteScroll } from './useInfiniteScroll'
import { ListProps } from './types'
import { ListLayout } from './ListLayout'
import { Masonry, RenderComponentProps as MasonryItemProps, List as ListMasonry, ListProps as ListMasonryProps } from 'masonic'

export * from './styles'
export * from './PaginationIndicator'
export * from './useInfiniteScroll'
export * from './types'
export * from './ListLayout'

export type ListComponentType = <T extends any[] = any[]>(props: ListProps<T>) => React.ReactElement

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
  refreshThreshold: 0.5,
  refreshPosition: 2,
  refresh: true,
}

export const List = (props: ListProps) => {
  const allProps = {
    ...List.defaultProps,
    ...props,
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

  const { layoutProps, onLoadMore } = useInfiniteScroll(allProps)

  const separator = separators && <ListSeparatorComponent separatorStyles={variantStyles.separator} />

  const renderItem = useCallback((_item: MasonryItemProps<any>) => {
    if (!RenderItem) return null

    const listLength = data?.length || 0

    const isFirst = _item?.index === 0
    const isLast = _item?.index === listLength - 1

    const isOnly = isFirst && isLast

    const _itemProps = {
      ..._item,
      isOnly,
      isLast,
      isFirst,
      item: _item?.data,
    }

    return <RenderItem {..._itemProps} />
  }, [])

  return (
    <ListLayout
      {...allProps}
      {...layoutProps}
      variantStyles={variantStyles} // @ts-ignore
    >
      <ListMasonry
        items={data}
        rowGutter={8} // The amount of vertical space in pixels to add between list item cards.
        overscanBy={3}
        render={renderItem}
        onRender={onLoadMore}
        itemKey={item => item?.id}
      />
    </ListLayout>
  )
}

List.defaultProps = defaultProps
