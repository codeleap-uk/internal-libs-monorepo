import React from 'react'
import { useDefaultComponentStyle, useCallback } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { GridPresets } from './styles'
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'
import { GridProps } from './types'
import { ListLayout, useInfiniteScroll } from '../List'

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
    <View css={[props?.separatorStyles]}></View>
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
    styles = {},
    renderItem: RenderItem,
    data,
    ListLoadingIndicatorComponent,
    ListSeparatorComponent,
    virtualizerOptions = {},
    numColumns,
    separators
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:Grid', typeof GridPresets>('u:Grid', {
    variants,
    responsiveVariants,
    styles,
  })

  const separator = separators && <ListSeparatorComponent separatorStyles={variantStyles.separator} />

  const {
    dataVirtualizer,
    parentRef,
    items,
    layoutProps,
  } = useInfiniteScroll({
    ...allProps,
    overscan: 5,
  })

  const columns = React.useMemo(() => {
    return generateColumns(numColumns)
  }, [numColumns])

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => null,
    overscan: 5,
    ...virtualizerOptions,
  })

  const columnItems = columnVirtualizer.getVirtualItems()

  const renderItem = useCallback((_item: VirtualItem) => {
    if (!RenderItem) return null

    const showIndicator = (_item?.index === (data?.length / numColumns)) && !!ListLoadingIndicatorComponent

    const gridLength = data?.length || 0

    return <>
      {/* Necessary for correct list render */}
      <div
        css={[
          variantStyles.itemWrapper,
          { transform: `translateY(${_item?.start - dataVirtualizer?.options?.scrollMargin}px)` }
        ]}
        key={_item?.key}
        data-index={_item?.index}
        ref={dataVirtualizer?.measureElement}
      >
        {_item?.index !== 0 ? separator : null}

        <View css={[variantStyles.column]}>
          {columnItems.map(column => {
            const rowIndex = _item?.index
            const columnIndex = column?.index
            const itemIndex = (rowIndex * numColumns) + columnIndex
            
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

  return (
    <ListLayout
      {...allProps}
      {...layoutProps}
      variantStyles={variantStyles} // @ts-ignore
      ref={ref}
    >
      {items?.map((item) => renderItem(item))}
    </ListLayout>
  )
})

export type GridComponentType = <T extends any[] = any[]>(props: GridProps<T>) => React.ReactElement

export const Grid = GridCP as unknown as GridComponentType
