import React from 'react'
import { useDefaultComponentStyle } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { GridPresets } from './styles'
import { GridProps } from './types'
import { ListLayout, useInfiniteScroll } from '../List'
import { ItemMasonryProps, ListMasonry } from '../../lib'

export * from './styles'
export * from './types'

const RenderSeparator = (props: { separatorStyles: ViewProps<'div'>['css'] }) => {
  return (
    <View css={[props?.separatorStyles]}></View>
  )
}

const defaultProps: Partial<GridProps> = {
  ListFooterComponent: null,
  ListHeaderComponent: null,
  ListLoadingIndicatorComponent: null,
  ListEmptyComponent: EmptyPlaceholder,
  ListSeparatorComponent: RenderSeparator,
  refreshDebounce: 1500,
  refreshSize: 40,
  refreshThreshold: 0.1,
  refreshPosition: 16,
  refresh: true,
  columnItemsSpacing: 8,
  rowItemsSpacing: 8,
  overscan: 2,
}

export function Grid<T = any>(props: GridProps<T>) {
  const allProps = {
    ...Grid.defaultProps,
    ...props,
  } as GridProps

  const {
    variants = [],
    responsiveVariants = {},
    styles = {},
    renderItem: RenderItem,
    columnItemsSpacing,
    rowItemsSpacing,
    ListSeparatorComponent,
    data,
    overscan,
    separators,
    masonryProps = {},
    numColumns,
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:Grid', typeof GridPresets>('u:Grid', {
    variants,
    responsiveVariants,
    styles,
  })

  const { layoutProps, onLoadMore, onRefreshItems } = useInfiniteScroll(allProps)

  const separator = React.useMemo(() => {
    return separators ? <ListSeparatorComponent separatorStyles={variantStyles.separator} /> : null
  }, [])

  const renderItem = React.useCallback((_item: ItemMasonryProps<any>) => {
    if (!RenderItem) return null

    const gridLength = data?.length || 0

    const isFirst = _item?.index === 0
    const isLast = _item?.index === gridLength - 1
    const isOnly = isFirst && isLast

    const _itemProps = {
      ..._item,
      isOnly,
      isLast,
      isFirst,
      item: _item?.data
    }

    if (!_itemProps?.item) return null

    return <>
      {_item?.index <= numColumns ? null : separator}
      <RenderItem {..._itemProps} />
    </>
  }, [RenderItem])

  return (
    <ListLayout
      {...allProps}
      {...layoutProps}
      variantStyles={variantStyles}
    >
      <ListMasonry
        items={data}
        render={renderItem}
        itemKey={item => item?.id}
        columnGutter={columnItemsSpacing}
        rowGutter={rowItemsSpacing}
        columnCount={numColumns}
        maxColumnCount={numColumns}
        onRender={onLoadMore}
        overscanBy={overscan}
        onRefreshItems={onRefreshItems}
        {...masonryProps}
      />
    </ListLayout>
  )
}

Grid.defaultProps = defaultProps
