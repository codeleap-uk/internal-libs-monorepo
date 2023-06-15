import { onUpdate } from '@codeleap/common'
import { useVirtualizer, VirtualItem, Virtualizer, VirtualizerOptions } from '@tanstack/react-virtual'
import React from 'react'
import { ListProps } from '.'
import { GridProps } from '../Grid'

export type UseInfiniteScrollProps = 
  ListProps & 
  GridProps & 
  Pick<VirtualizerOptions<any, any>, 'overscan'>

export type UseInfiniteScrollReturn = {
  dataVirtualizer: Virtualizer<any, any>
  count: number
  items: VirtualItem[]
  isRefresh: boolean
  layoutProps: {
    isEmpty: boolean
    refreshing: boolean
    parentRef: React.MutableRefObject<undefined>
    dataVirtualizer: Virtualizer<any, any>
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

  return {
    items,
    dataVirtualizer,
    isRefresh,
    count,
    layoutProps: {
      parentRef,
      refreshing,
      isEmpty,
      dataVirtualizer
    }
  }
}
