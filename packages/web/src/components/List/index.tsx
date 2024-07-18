import React from 'react'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { ListProps } from './types'
import { ItemMasonryProps, ListMasonry, useInfiniteScroll, useMasonryReload } from '../../lib'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { ListLayout } from './ListLayout'

export * from './styles'
export * from './types'
export * from './ListLayout'

const RenderSeparator = (props: { separatorStyles: ViewProps<'div'>['style'] }) => {
  return <View style={props?.separatorStyles} />
}

export function List(props: ListProps) {

  const allProps = {
    ...List.defaultProps,
    ...props,
  } as ListProps

  const {
    renderItem: RenderItem,
    rowItemsSpacing,
    ListSeparatorComponent,
    data,
    overscan,
    separators,
    masonryProps,
    reloadTimeout,
    showFooter,
    style,
  } = allProps

  const styles = useStylesFor(List.styleRegistryName, style)

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
      styles={styles}
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

List.styleRegistryName = 'List'
List.elements = ['wrapper', 'innerWrapper', 'separator', 'refreshControl', 'refreshControlIndicator']
List.rootElement = 'wrapper'

List.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return List as (props: StyledComponentProps<ListProps, typeof styles>) => IJSX
}

List.defaultProps = {
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
} as Partial<ListProps>

WebStyleRegistry.registerComponent(List)
