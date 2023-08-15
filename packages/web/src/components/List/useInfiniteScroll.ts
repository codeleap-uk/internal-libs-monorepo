import React from 'react'
import { onUpdate, TypeGuards } from '@codeleap/common'
import { ListProps } from '.'
import { GridProps } from '../Grid'
import { useInfiniteLoader, LoadMoreItemsCallback, UseInfiniteLoaderOptions } from 'masonic'

export type UseInfiniteScrollProps<Item extends Element = any> = 
  Partial<ListProps> & 
  Partial<GridProps> & {
    threshold?: number
    onLoadMore?: LoadMoreItemsCallback<Item>
    loadMoreOptions?: Partial<UseInfiniteLoaderOptions<Item>>
  }

export type UseInfiniteScrollReturn<Item extends Element = any> = {
  onLoadMore: LoadMoreItemsCallback<Item>
  isRefresh: boolean
  layoutProps: {
    isEmpty: boolean
    refreshing: boolean
    parentRef: React.MutableRefObject<undefined>
  }
}

export function useInfiniteScroll<Item extends Element = any>(props: UseInfiniteScrollProps<Item>): UseInfiniteScrollReturn<Item> {
  const {
    onRefresh,
    data,
    hasNextPage,
    fetchNextPage,
    refreshDebounce,
    refreshThreshold,
    loadMoreOptions = {},
    onLoadMore,
    threshold = 3,
  } = props

  const parentRef = React.useRef()

  const [refreshing, setRefreshing] = React.useState(false)

  const infiniteLoader = useInfiniteLoader(
    async (args) => {
      if (hasNextPage) await fetchNextPage?.()
      if (TypeGuards.isFunction(onLoadMore)) await onLoadMore?.(args)
      console.log('HERE', args)
    },
    {
      isItemLoaded: (index, items) => !!items?.[index],
      minimumBatchSize: 32,
      threshold: threshold,
      ...loadMoreOptions,
    },
  )

  const isRefresh = React.useMemo(() => {
    // const _offset = dataVirtualizer?.scrollOffset
    // const _refresh = _offset <= refreshThreshold && dataVirtualizer?.isScrolling

    // return _refresh

    return false
  }, [])

  const isEmpty = !data || !data?.length

  onUpdate(() => {
    if (isRefresh) {
      setRefreshing(true)
      onRefresh?.()

      setTimeout(() => {
        setRefreshing(false)
      }, refreshDebounce)
    }
  }, [!!isRefresh])

  return {
    onLoadMore: infiniteLoader,
    isRefresh,
    layoutProps: {
      parentRef,
      refreshing,
      isEmpty,
    }
  }
}
