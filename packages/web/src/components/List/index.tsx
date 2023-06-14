import React from 'react'
import { useDefaultComponentStyle, ComponentVariants, useCallback } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ListComposition, ListPresets } from './styles'
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
    isFetching?: boolean
    noMoreItemsText?: React.ReactChild
    hasNextPage?: boolean
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    styles?: StylesOf<ListComposition>
    fakeEmpty?: boolean
    data: Data[]
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
      placeholder,
      fakeEmpty,
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

    const separator = props?.separators && <RenderSeparator separatorStyles={variantStyles.separator}/>

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

      return <RenderItem {..._itemProps} />
    }, [RenderItem, data?.length])

    const isEmpty = !data || !data?.length

    const parentRef = React.useRef()

    const rowVirtualizer = useVirtualizer({
      count: hasNextPage ? data?.length + 1 : data?.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 100,
      overscan: 5,
    })

    React.useEffect(() => {
      const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

      console.log({
        isFetchingNextPage,
        last: lastItem.index >= data?.length - 1,
        hasNextPage,
      })
  
      if (!lastItem) {
        return
      }
  
      if (
        lastItem.index >= data?.length - 1 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        console.log(fetchNextPage)
        fetchNextPage()
      }
    }, [
      hasNextPage,
      fetchNextPage,
      data?.length,
      isFetchingNextPage,
      rowVirtualizer.getVirtualItems(),
    ])

    return <>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <span>Error: {error}</span>
      ) : (
        <div
          ref={parentRef}
          style={{
            height: `500px`,
            width: `100%`,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: `100vh`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow?.index > data?.length - 1
              const post = data?.[virtualRow?.index]

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow
                    ? hasNextPage
                      ? 'Loading more...'
                      : 'Nothing more to load'
                    : post?.title}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  },
)

export type ListComponentType = <T extends any[] = any[]>(props: ListProps<T>) => React.ReactElement

export const List = ListCP as unknown as ListComponentType
