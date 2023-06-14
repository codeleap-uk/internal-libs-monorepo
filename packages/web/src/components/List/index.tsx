import React from 'react'
import { useDefaultComponentStyle, ComponentVariants, useCallback, onUpdate } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ListComposition, ListParts, ListPresets } from './styles'
import { StylesOf } from '../../types'
import { useVirtualizer } from '@tanstack/react-virtual'

export type AugmentedRenderItemInfo<T> = {
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export * from './styles'
// export * from './PaginationIndicator'

export type ListProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = ComponentVariants<typeof ListPresets> &
  Omit<ViewProps<'div'>, 'variants'> & {
    data: Data[]
    isFetching?: boolean
    noMoreItemsText?: React.ReactChild
    hasNextPage?: boolean
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    styles?: StylesOf<ListComposition>
    keyExtractor?: (item: T, index: number) => string
    renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
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
    ListHeaderComponentStyle?: React.ReactChild
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
    ...props
  } = flatListProps

  const variantStyles = useDefaultComponentStyle<'u:List', typeof ListPresets>('u:List', {
    variants,
    styles,
  })

  const separator = props?.separators && <RenderSeparator separatorStyles={variantStyles.separator} />

  const renderItem = useCallback((data: any) => {
    if (!RenderItem) return null

    const listLength = data?.length || 0

    const isFirst = data?.index === 0
    const isLast = data?.index === listLength - 1

    const isOnly = isFirst && isLast

    const _itemProps = {
      ...data,
      isOnly,
      isLast,
      isFirst,
    }

    return <View
      css={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${data.size}px`,
          transform: `translateY(${data.start}px)`,
        }
      ]}
    >
      {isFirst && separator}
      <RenderItem {..._itemProps} />
    </View>
  }, [RenderItem, data?.length])

  const isEmpty = !data || !data?.length

  const parentRef = React.useRef()

  const dataVirtualizer = useVirtualizer({
    count: hasNextPage ? data?.length + 1 : data?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  })

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

  if (isEmpty) {
    return <EmptyPlaceholder {...placeholder} />
  }

  return (
    // @ts-ignore
    <View 
      ref={parentRef} 
      css={[
        getKeyStyle('wrapper'), 
        style, 
        { height: dataVirtualizer.getTotalSize() }
      ]}
    >
      {isLoading && <p>Loading...</p>}
      {isError && <span>Error: {error}</span>}
      <View
        //@ts-ignore
        ref={ref}
        css={[getKeyStyle('content'), style]}
      >
        {items?.map((item) => renderItem(item))}
      </View>
      {isLoading ? hasNextPage ? 'Loading more...' : 'Nothing more to load' : null}
    </View>
  )
},
)

export type ListComponentType = <T extends any[] = any[]>(props: ListProps<T>) => React.ReactElement

export const List = ListCP as unknown as ListComponentType
