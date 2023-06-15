import React from 'react'
import { useDefaultComponentStyle, ComponentVariants, useCallback, onUpdate } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ListComposition, ListParts, ListPresets } from './styles'
import { StylesOf } from '../../types'
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual'

export type AugmentedRenderItemInfo<T> = {
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export * from './styles'
export * from './PaginationIndicator'

export type ListProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = ComponentVariants<typeof ListPresets> &
  Omit<ViewProps<'div'>, 'variants'> & {
    data: Data[]
    isFetching?: boolean
    hasNextPage?: boolean
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    styles?: StylesOf<ListComposition>
    keyExtractor?: (item: T, index: number) => string
    renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
    ListFooterComponent?: () => React.ReactElement
    ListLoadingIndicatorComponent?: () => React.ReactElement
    onRefresh?: () => void
    refreshing?: boolean
    getItemLayout?: ((
      data: Data,
      index: number,
    ) => { length: number; offset: number; index: number })
    isError?: boolean
    error?: string
    isLoading?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage?: any
    ListHeaderComponent?: () => React.ReactElement
  }

const RenderSeparator = (props: { separatorStyles: ViewProps<'div'>['css'] }) => {
  return (
    <View css={[props.separatorStyles]}></View>
  )
}

const ListCP = React.forwardRef<typeof View, ListProps>((flatListProps, ref) => {
  const {
    variants = [],
    style,
    styles = {},
    onRefresh,
    component,
    refreshing,
    placeholder = {},
    renderItem: RenderItem,
    data,
    hasNextPage,
    isError,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    ListFooterComponent = null,
    ListHeaderComponent = null,
    ListLoadingIndicatorComponent = null,
    ...props
  } = flatListProps

  const variantStyles = useDefaultComponentStyle<'u:List', typeof ListPresets>('u:List', {
    variants,
    styles,
  })

  const separator = props?.separators && <RenderSeparator separatorStyles={variantStyles.separator} />

  const count = hasNextPage ? data?.length + 1 : data?.length

  const dataVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () =>  null,
    overscan: 10,
  })

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

  const isEmpty = !data || !data?.length

  const parentRef = React.useRef()

  const items = dataVirtualizer.getVirtualItems()

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
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    data?.length,
    isFetchingNextPage,
    items,
  ])

  const getKeyStyle = React.useCallback((key: ListParts) => {
    return [
      variantStyles[key],
      isLoading && variantStyles[`${key}:loading`],
      isEmpty && variantStyles[`${key}:empty`],
    ]
  }, [isLoading, isEmpty])

  return (
    <View css={[getKeyStyle('wrapper')]}>
      {!!ListHeaderComponent && <ListHeaderComponent />}

      {isEmpty ? <EmptyPlaceholder {...placeholder} /> : (
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
