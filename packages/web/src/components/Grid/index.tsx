import React from 'react'
import { useDefaultComponentStyle, useCallback, onUpdate, useCodeleapContext, TypeGuards } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { GridParts, GridPresets } from './styles'
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'
import { motion } from 'framer-motion'
import { ActivityIndicator } from '../ActivityIndicator'
import { GridProps } from './types'

export * from './styles'
export * from './types'

const generateColumns = (count: number) => {
  return new Array(count).fill(0).map((_, i) => {
    const key: string = i.toString()
    return {
      key,
    }
  })
}

const RenderSeparator = (props: { separatorStyles: ViewProps<'div'>['css'] }) => {
  return (
    <View css={[props.separatorStyles]}></View>
  )
}

const defaultProps: Partial<GridProps> = {
  ListFooterComponent: null,
  ListHeaderComponent: null,
  ListLoadingIndicatorComponent: null,
  ListRefreshControlComponent: null,
  ListEmptyComponent: EmptyPlaceholder,
  ListSeparatorComponent: RenderSeparator,
  refreshDebounce: 3000,
  refreshSize: 20,
  refreshThreshold: 1,
  refreshPosition: 2,
  refresh: true,
  numColumns: 2,
}

const GridCP = React.forwardRef<'div', GridProps>((flatGridProps, ref) => {
  const allProps = {
    ...defaultProps,
    ...flatGridProps,
  }

  const {
    variants = [],
    responsiveVariants = {},
    onRefresh,
    style,
    styles = {},
    placeholder = {},
    renderItem: RenderItem,
    data,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    ListFooterComponent,
    ListHeaderComponent,
    ListLoadingIndicatorComponent,
    ListRefreshControlComponent,
    ListSeparatorComponent,
    ListEmptyComponent,
    virtualizerOptions = {},
    refreshDebounce,
    refreshSize,
    refreshThreshold,
    refreshPosition,
    refresh,
    refreshControlProps = {},
    numColumns,
    ...props
  } = allProps

  const [refreshing, setRefreshing] = React.useState(false)

  const { Theme } = useCodeleapContext()

  const variantStyles = useDefaultComponentStyle<'u:Grid', typeof GridPresets>('u:Grid', {
    variants,
    responsiveVariants,
    styles,
  })

  const separator = props?.separators && <ListSeparatorComponent separatorStyles={variantStyles.separator} />

  const count = hasNextPage ? data?.length + 1 : data?.length

  const dataVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => null,
    overscan: 5,
    ...virtualizerOptions,
  })

  const columns = React.useMemo(() => {
    return generateColumns(numColumns)
  }, [numColumns])

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => null,
    overscan: 5,
    ...virtualizerOptions,
  })

  const columnItems = columnVirtualizer.getVirtualItems()

  const isRefresh = React.useMemo(() => {
    const _offset = dataVirtualizer?.scrollOffset
    const _refresh = _offset <= refreshThreshold && dataVirtualizer?.isScrolling

    return _refresh
  }, [dataVirtualizer?.scrollOffset, dataVirtualizer?.isScrolling])

  const renderItem = useCallback((_item: VirtualItem) => {
    if (!RenderItem) return null

    const showIndicator = (_item?.index === (data?.length / numColumns)) && !!ListLoadingIndicatorComponent

    const gridLength = data?.length || 0

    return <>
      {/* Necessary for correct list render */}
      <div
        css={[
          variantStyles.itemWrapper,
          { transform: `translateY(${_item.start - dataVirtualizer.options.scrollMargin}px)` }
        ]}
        key={_item?.key}
        data-index={_item?.index}
        ref={dataVirtualizer?.measureElement}
      >
        {separator}

        <View css={[variantStyles.column]}>
          {columnItems.map(column => {
            const rowIndex = _item?.index
            const columnIndex = column?.index
            const itemIndex = (rowIndex + rowIndex) + columnIndex

            const isFirst = itemIndex === 0
            const isLast = itemIndex === gridLength - 1
            const isOnly = isFirst && isLast
        
            const isLastInRow = columnIndex === numColumns
            const isFirstInRow = columnIndex === 0
            const isOnlyInRow = isFirstInRow && isLastInRow

            const _itemProps = {
              ..._item,
              key: itemIndex,
              index: itemIndex,
              isOnly,
              isLast,
              isFirst,
              column,
              isFirstInRow,
              isLastInRow,
              isOnlyInRow,
              rowIndex,
              item: data?.[itemIndex]
            }

            return <RenderItem {..._itemProps} />
          })}
        </View>

        {showIndicator && <ListLoadingIndicatorComponent />}
      </div>
    </>
  }, [RenderItem, data?.length, dataVirtualizer?.measureElement])

  const isEmpty = !data || !data?.length

  const parentRef = React.useRef()

  const items = dataVirtualizer.getVirtualItems()

  onUpdate(() => {
    if (isRefresh) {
      setRefreshing(true)
      onRefresh?.()

      setTimeout(() => {
        setRefreshing(false)
      }, refreshDebounce)
    }
  }, [!!isRefresh])

  onUpdate(() => {
    const [lastItem] = [...items].reverse()

    if (!lastItem) {
      return
    }

    const itemsLength = (data?.length / numColumns) - 1

    if (
      lastItem.index >= itemsLength &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage?.()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    data?.length,
    isFetchingNextPage,
    items,
  ])

  const getKeyStyle = React.useCallback((key: GridParts) => {
    return [
      variantStyles[key],
      isLoading && variantStyles[`${key}:loading`],
      isEmpty && variantStyles[`${key}:empty`],
    ]
  }, [isLoading, isEmpty])

  const _refreshPosition = React.useMemo(() => {
    return Theme.spacing.value(refreshPosition)
  }, [refreshPosition])

  return (
    <View css={[getKeyStyle('wrapper')]}>
      {!!ListHeaderComponent && <ListHeaderComponent />}

      {isEmpty ? <ListEmptyComponent {...placeholder} /> : (
        // @ts-ignore
        <View
          ref={parentRef}
          css={[
            getKeyStyle('innerWrapper'),
            style,
          ]}
        >
          <View
            //@ts-ignore
            ref={ref}
            css={[
              getKeyStyle('content'),
              { height: dataVirtualizer.getTotalSize() }
            ]}
          >
            {TypeGuards.isNil(ListRefreshControlComponent) && refresh ? (
              <motion.div
                css={[variantStyles?.refreshControl]}
                initial={false}
                animate={{
                  opacity: refreshing ? 1 : 0,
                  top: refreshing ? _refreshPosition : 0
                }}
                {...refreshControlProps}
              >
                <ActivityIndicator size={refreshSize} />
              </motion.div>
            ) : (<ListRefreshControlComponent /> ?? null)}

            {items?.map((item) => renderItem(item))}
          </View>
        </View>
      )}

      {!!ListFooterComponent && <ListFooterComponent />}
    </View>
  )
})

export type GridComponentType = <T extends any[] = any[]>(props: GridProps<T>) => React.ReactElement

export const Grid = GridCP as unknown as GridComponentType
