import React from 'react'
import { useDefaultComponentStyle } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { ListPresets } from './styles'
import { useInfiniteScroll } from './useInfiniteScroll'
import { ListProps } from './types'
import { ListLayout } from './ListLayout'
import { ItemMasonryProps, ListMasonry, useMasonryReload } from '../../lib'

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
  ListEmptyComponent: EmptyPlaceholder,
  ListSeparatorComponent: RenderSeparator,
  refreshDebounce: 1500,
  refreshSize: 40,
  refreshThreshold: 0.1,
  refreshPosition: 16,
  refresh: true,
  rowItemsSpacing: 8,
  overscan: 2,
  reloadTimeout: 350,
  showFooter: true,
}

export function List<T = any>(props: ListProps<T>) {
  const allProps = {
    ...List.defaultProps,
    ...props,
  } as ListProps

  const {
    variants = [],
    responsiveVariants = {},
    styles = {},
    renderItem: RenderItem,
    rowItemsSpacing,
    ListSeparatorComponent,
    data,
    overscan,
    separators,
    masonryProps = {},
    reloadTimeout,
    showFooter,
    layoutWrapperProps = {},
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:List', typeof ListPresets>('u:List', {
    variants,
    responsiveVariants,
    styles,
  })

  const { layoutProps, onLoadMore } = useInfiniteScroll(allProps)

  const { reloadingLayout, previousLength } = useMasonryReload({
    data,
    reloadTimeout,
  })

  const separator = React.useMemo(() => {
    return separators ? <ListSeparatorComponent separatorStyles={variantStyles.separator} /> : null
  }, [])

  const renderItem = React.useCallback((_item: ItemMasonryProps<any>) => {
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

    return <>
      {isFirst ? null : separator}
      <RenderItem {..._itemProps} />
    </>
  }, [RenderItem])

  return (
    <ListLayout
      {...allProps}
      {...layoutProps}
      wrapperProps={layoutWrapperProps}
      variantStyles={variantStyles}
      showFooter={reloadingLayout ? false : showFooter}
    >
      <ListMasonry
        items={data}
        render={renderItem}
        itemKey={(item, _index) => (item?.id ?? _index)}
        rowGutter={rowItemsSpacing}
        onRender={onLoadMore}
        overscanBy={overscan}
        columnCount={1}
        previousItemsLength={previousLength}
        reloadingLayout={reloadingLayout}
        {...masonryProps}
      />
    </ListLayout>
  )
}

List.defaultProps = defaultProps
