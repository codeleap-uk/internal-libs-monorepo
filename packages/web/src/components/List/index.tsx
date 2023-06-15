import React from 'react'
import { useDefaultComponentStyle, ComponentVariants, useCallback, useCodeleapContext, TypeGuards, PropsOf } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ListComposition, ListParts, ListPresets } from './styles'
import { StylesOf } from '../../types'
import { VirtualItem, VirtualizerOptions } from '@tanstack/react-virtual'
import { motion } from 'framer-motion'
import { ActivityIndicator } from '../ActivityIndicator'
import { useInfiniteScroll } from './useInfiniteScroll'

export type AugmentedRenderItemInfo<T> = VirtualItem & {
  item: T
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export * from './styles'
export * from './PaginationIndicator'
export * from './useInfiniteScroll'

export type ListProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = ComponentVariants<typeof ListPresets> &
  Omit<ViewProps<'div'>, 'variants'> & {
    data: Data[]
    isFetching?: boolean
    hasNextPage?: boolean
    separators?: boolean
    onRefresh?: () => void
    placeholder?: EmptyPlaceholderProps
    styles?: StylesOf<ListComposition>
    keyExtractor?: (item: T, index: number) => string
    renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
    ListFooterComponent?: () => React.ReactElement
    ListLoadingIndicatorComponent?: () => React.ReactElement
    ListRefreshControlComponent?: () => React.ReactElement
    ListEmptyComponent?: React.FC | ((props: EmptyPlaceholderProps) => React.ReactElement)
    ListSeparatorComponent?: React.FC | ((props: { separatorStyles: ViewProps<'div'>['css'] }) => React.ReactElement)
    isLoading?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage?: () => void
    ListHeaderComponent?: () => React.ReactElement
    virtualizerOptions?: Partial<VirtualizerOptions<any, any>>
    refreshDebounce?: number
    refreshSize?: number
    refreshThreshold?: number
    refreshPosition?: number
    refresh?: boolean
    refreshControlProps?: PropsOf<typeof motion.div>
  }

const RenderSeparator = (props: { separatorStyles: ViewProps<'div'>['css'] }) => {
  return (
    <View css={[props.separatorStyles]}></View>
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
  refreshSize: 20,
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
    ...props
  } = allProps

  const { Theme } = useCodeleapContext()

  const variantStyles = useDefaultComponentStyle<'u:List', typeof ListPresets>('u:List', {
    variants,
    responsiveVariants,
    styles,
  })

  const {
    items,
    isEmpty,
    dataVirtualizer,
    parentRef,
    refreshing,
  } = useInfiniteScroll(allProps)

  const separator = props?.separators && <ListSeparatorComponent separatorStyles={variantStyles.separator} />

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
        <RenderItem {..._itemProps} />
      </div>
    )
  }, [RenderItem, data?.length, dataVirtualizer?.measureElement])

  const getKeyStyle = React.useCallback((key: ListParts) => {
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

            {/* Necessary for correct list render */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${items[0].start}px)`,
              }}
            >
              {items?.map((item) => renderItem(item))}
            </div>
          </View>
        </View>
      )}

      {!!ListFooterComponent && <ListFooterComponent />}
    </View>
  )
})

export type ListComponentType = <T extends any[] = any[]>(props: ListProps<T>) => React.ReactElement

export const List = ListCP as unknown as ListComponentType
