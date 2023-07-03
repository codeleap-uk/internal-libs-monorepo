import { onUpdate } from '@codeleap/common'
import { useVirtualizer, VirtualItem, Virtualizer, VirtualizerOptions } from '@tanstack/react-virtual'
import React from 'react'
import { ListProps } from '.'
import { GridProps } from '../Grid'

export type UseInfiniteScrollProps<TS extends Element = any, T extends Element = any> = 
  ListProps & 
  GridProps & 
  Pick<VirtualizerOptions<TS, T>, 'overscan'>

export type UseInfiniteScrollReturn<TS extends Element = any, T extends Element = any> = {
  dataVirtualizer: Virtualizer<TS, T>
  count: number
  items: VirtualItem[]
  isRefresh: boolean
  parentRef: React.MutableRefObject<undefined>
  layoutProps: {
    isEmpty: boolean
    refreshing: boolean
    parentRef: React.MutableRefObject<undefined>
    dataVirtualizer: Virtualizer<TS, T>
  }
}

export const useInfiniteScroll = (props: UseInfiniteScrollProps): UseInfiniteScrollReturn => {
  const {
    onRefresh,
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    virtualizerOptions = {},
    refreshDebounce,
    refreshThreshold,
    overscan = 10,
    numColumns = 1,
  } = props

  const parentRef = React.useRef()

  const [refreshing, setRefreshing] = React.useState(false)

  const count = hasNextPage ? data?.length + 1 : data?.length

  const dataVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => null,
    overscan,
    ...virtualizerOptions,
  })

  const isRefresh = React.useMemo(() => {
    const _offset = dataVirtualizer?.scrollOffset
    const _refresh = _offset <= refreshThreshold && dataVirtualizer?.isScrolling

    return _refresh
  }, [dataVirtualizer?.scrollOffset, dataVirtualizer?.isScrolling])

  const isEmpty = !data || !data?.length

  const items = dataVirtualizer?.getVirtualItems()

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
    const [lastItem] = [...(items ?? [])]?.reverse()

    if (!lastItem) {
      return
    }

    const itemsLength = (data?.length / numColumns) - 1

    if (
      lastItem?.index >= itemsLength &&
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

  return {
    items,
    dataVirtualizer,
    isRefresh,
    count,
    parentRef,
    layoutProps: {
      parentRef,
      refreshing,
      isEmpty,
      dataVirtualizer
    }
  }
}
