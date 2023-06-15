import React from 'react'
import { useDefaultComponentStyle, ComponentVariants, useCallback, onUpdate, useCodeleapContext, TypeGuards, PropsOf } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { GridComposition, GridParts, GridPresets } from './styles'
import { StylesOf } from '../../types'
import { useVirtualizer, useWindowVirtualizer, VirtualItem, VirtualizerOptions } from '@tanstack/react-virtual'
import { motion } from 'framer-motion'
import { ActivityIndicator } from '../ActivityIndicator'

type AugmentedRenderItemInfo<T> = VirtualItem & {
  item: T
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export * from './styles'

export type GridProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = ComponentVariants<typeof GridPresets> &
  Omit<ViewProps<'div'>, 'variants'> & {
    data: Data[]
    isFetching?: boolean
    hasNextPage?: boolean
    separators?: boolean
    onRefresh?: () => void
    placeholder?: EmptyPlaceholderProps
    styles?: StylesOf<GridComposition>
    keyExtractor?: (item: T, index: number) => string
    renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
    GridFooterComponent?: () => React.ReactElement
    ListLoadingIndicatorComponent?: () => React.ReactElement
    GridRefreshControlComponent?: () => React.ReactElement
    GridEmptyComponent?: React.FC | ((props: EmptyPlaceholderProps) => React.ReactElement)
    GridSeparatorComponent?: React.FC | ((props: { separatorStyles: ViewProps<'div'>['css'] }) => React.ReactElement)
    isLoading?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage?: () => void
    GridHeaderComponent?: () => React.ReactElement
    virtualizerOptions?: Partial<VirtualizerOptions<any, any>>
    refreshDebounce?: number
    refreshSize?: number
    refreshThreshold?: number
    refreshPosition?: number
    refresh?: boolean
    refreshControlProps?: PropsOf<typeof motion.div>
    //
    numColumns: number
  }

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
  GridFooterComponent: null,
  GridHeaderComponent: null,
  ListLoadingIndicatorComponent: null,
  GridRefreshControlComponent: null,
  GridEmptyComponent: EmptyPlaceholder,
  GridSeparatorComponent: RenderSeparator,
  refreshDebounce: 3000,
  refreshSize: 20,
  refreshThreshold: 1,
  refreshPosition: 2,
  refresh: true,
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
    GridFooterComponent,
    GridHeaderComponent,
    ListLoadingIndicatorComponent,
    GridRefreshControlComponent,
    GridSeparatorComponent,
    GridEmptyComponent,
    virtualizerOptions = {},
    refreshDebounce,
    refreshSize,
    refreshThreshold,
    refreshPosition,
    refresh,
    refreshControlProps = {},
    ...props
  } = allProps

  const [refreshing, setRefreshing] = React.useState(false)

  const { Theme } = useCodeleapContext()

  const variantStyles = useDefaultComponentStyle<'u:Grid', typeof GridPresets>('u:Grid', {
    variants,
    responsiveVariants,
    styles,
  })

  const separator = props?.separators && <GridSeparatorComponent separatorStyles={variantStyles.separator} />

  const count = hasNextPage ? data?.length + 1 : data?.length

  const dataVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => null,
    overscan: 5,
    ...virtualizerOptions,
  })

  //

  const columns = generateColumns(2)

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

    const showIndicator = (_item?.index > data?.length - 1) && !!ListLoadingIndicatorComponent

    const GridLength = data?.length || 0

    const isFirst = _item?.index === 0
    const isLast = _item?.index === GridLength - 1

    const isOnly = isFirst && isLast

    let acc = 1

    return (
      <div
        style={{
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translateY(${
            _item.start - dataVirtualizer.options.scrollMargin
          }px)`,
          display: 'flex',
        }}
        key={_item?.key}
        data-index={_item?.index}
        ref={dataVirtualizer?.measureElement}
      >
        {columnItems.map(column => {
          const _itemProps = {
            ..._item,
            isOnly,
            isLast,
            isFirst,
            item: data?.[(_item?.index !== 0 ? _item?.index + acc : _item?.index) + column.index]
          }

          acc = acc + 1

          return <>
            {/* {!isFirst && separator} */}
            <RenderItem {..._itemProps} />
          </>
        })}

        {showIndicator && <ListLoadingIndicatorComponent />} 
      </div>
    )
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

    if (
      lastItem.index >= data?.length - 1 &&
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
      {!!GridHeaderComponent && <GridHeaderComponent />}

      {isEmpty ? <GridEmptyComponent {...placeholder} /> : (
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
            {TypeGuards.isNil(GridRefreshControlComponent) && refresh ? (
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
            ) : (<GridRefreshControlComponent /> ?? null)}

            {/* Necessary for correct Grid render */}
            {/* <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${items[0].start}px)`,
              }}
            > */}
              {items?.map((item) => renderItem(item))}
            {/* </div> */}
          </View>
        </View>
      )}

      {!!GridFooterComponent && <GridFooterComponent />}
    </View>
  )
})

export type GridComponentType = <T extends any[] = any[]>(props: GridProps<T>) => React.ReactElement

export const Grid = GridCP as unknown as GridComponentType
