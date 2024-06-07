import React from 'react'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { ListLayoutProps, ListProps, ListRefreshControlComponent } from './types'
import { ItemMasonryProps, ListMasonry, useInfiniteScroll, useMasonryReload } from '../../lib'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { ActivityIndicator } from '../ActivityIndicator'
import { ListParts } from './styles'
import { TypeGuards } from '@codeleap/common'
import { motion } from 'framer-motion'

const DefaultRefreshIndicator = (props: ListRefreshControlComponent) => {

  const {
    refreshing,
    styles,
    refreshPosition,
    refreshControlProps,
    debugName,
    refreshSize,
    refreshControlIndicatorProps,
  } = props

  return (
    <motion.div
      css={[styles?.refreshControl]}
      initial={false}
      animate={{
        opacity: refreshing ? 1 : 0,
        top: refreshing ? refreshPosition : 0,
      }}
      {...refreshControlProps}
    >
      <ActivityIndicator
        debugName={debugName + 'refresh-indicator'}
        size={refreshSize}
        style={styles.refreshControlIndicator}
        {...refreshControlIndicatorProps}
      />
    </motion.div>
  )
}

export const ListLayout = (props: ListLayoutProps) => {

  const {
    ListEmptyComponent,
    ListFooterComponent,
    ListHeaderComponent,
    refresh,
    ListRefreshControlComponent = DefaultRefreshIndicator,
    styles,
    isEmpty,
    isLoading,
    placeholder = {},
    style,
    children,
    debugName,
    isFetching,
    isFetchingNextPage,
    ListLoadingIndicatorComponent,
    scrollableRef,
    showFooter = true,
  } = props

  const getKeyStyle = React.useCallback((key: ListParts) => ([
    styles[key],
    isLoading && styles[`${key}:loading`],
    isEmpty && styles[`${key}:empty`],
  ]), [isLoading, isEmpty])

  return (
    // @ts-ignore
    <View style={[getKeyStyle('wrapper'), style]} ref={scrollableRef}>
      {!!ListHeaderComponent ? <ListHeaderComponent /> : null}

      {isEmpty ? <ListEmptyComponent debugName={debugName} {...placeholder} /> : null}

      <View style={[getKeyStyle('innerWrapper'), isEmpty && { display: 'none' }]}>
        {(!ListRefreshControlComponent || !refresh) ? null : (
          <ListRefreshControlComponent
            {...props}
            styles={styles}
          />
        )}

        {children}
      </View>

      {((isFetching || isFetchingNextPage) && !TypeGuards.isNil(ListLoadingIndicatorComponent))
        ? <ListLoadingIndicatorComponent />
        : null}

      {(!!ListFooterComponent && showFooter) ? <ListFooterComponent {...props} /> : null}
    </View>
  )
}

const RenderSeparator = (props: { separatorStyles: ViewProps<'div'>['style'] }) => {
  return (
    <View style={[props?.separatorStyles]}></View>
  )
}
export function List<T = any>(props: ListProps<T>) {

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
} as Partial<ListProps>

WebStyleRegistry.registerComponent(List)

export * from './styles'
export * from './types'

