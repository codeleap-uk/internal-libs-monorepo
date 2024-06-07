import React from 'react'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { GridProps } from './types'
import { ListLayout } from '../List'
import { ItemMasonryProps, ListMasonry, useInfiniteScroll, useMasonryReload } from '../../lib'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'

const RenderSeparator = (props: { separatorStyles: ViewProps<'div'>['css'] }) => {
  return (
    <View style={[props?.separatorStyles]}></View>
  )
}

export const Grid = (props: GridProps) => {

  const allProps = {
    ...Grid.defaultProps,
    ...props,
  }

  const {
    style,
    renderItem: RenderItem,
    columnItemsSpacing,
    rowItemsSpacing,
    ListSeparatorComponent,
    data,
    overscan,
    separators,
    masonryProps,
    numColumns,
    reloadTimeout,
    showFooter,
  } = allProps

  const styles = useStylesFor(Grid.styleRegistryName, style)

  const { layoutProps, onLoadMore } = useInfiniteScroll(allProps)

  const { reloadingLayout, previousLength } = useMasonryReload({
    data,
    reloadTimeout,
  })

  const separator = React.useMemo(() => {
    return separators ? <ListSeparatorComponent separatorStyles={styles.separator} /> : null
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
      item: _item?.data,
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
      variantStyles={styles}
      showFooter={reloadingLayout ? false : showFooter}
    >
      <ListMasonry
        items={data}
        render={renderItem}
        itemKey={(item, _index) => (item?.id ?? _index)}
        columnGutter={columnItemsSpacing}
        rowGutter={rowItemsSpacing}
        columnCount={numColumns}
        maxColumnCount={numColumns}
        onRender={onLoadMore}
        overscanBy={overscan}
        previousItemsLength={previousLength}
        reloadingLayout={reloadingLayout}
        {...masonryProps}
      />
    </ListLayout>
  )
}

Grid.styleRegistryName = 'Grid'

Grid.elements = [
  'wrapper',
  'innerWrapper',
  'separator',
  'refreshControl',
  'refreshControlIndicator',
]

Grid.rootElement = 'wrapper'

Grid.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Grid as (props: StyledComponentProps<GridProps, typeof styles>) => IJSX
}

Grid.defaultProps = {
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
  reloadTimeout: 350,
  showFooter: true,
} as Partial<GridProps>

WebStyleRegistry.registerComponent(Grid)

export * from './styles'
export * from './types'
