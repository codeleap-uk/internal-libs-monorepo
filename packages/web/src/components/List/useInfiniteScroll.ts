import React from 'react'
import { onUpdate, TypeGuards } from '@codeleap/common'
import { ListProps } from '.'
import { GridProps } from '../Grid'
import { useInfiniteLoader, LoadMoreItemsCallback, UseInfiniteLoaderOptions, useContainerPosition, useScroller } from 'masonic'

export type UseInfiniteScrollArgs<Item extends Element = any> = {
  threshold?: number
  onLoadMore?: LoadMoreItemsCallback<Item>
  loadMoreOptions?: Partial<UseInfiniteLoaderOptions<Item>>
}

export type UseInfiniteScrollProps<Item extends Element = any> =
  Partial<ListProps> &
  Partial<GridProps> & 
  UseInfiniteScrollArgs<Item>

export type UseInfiniteScrollReturn<Item extends Element = any> = {
  onLoadMore: LoadMoreItemsCallback<Item>
  isRefresh: boolean
  layoutProps: {
    isEmpty: boolean
    refreshing: boolean
    scrollableRef: React.MutableRefObject<undefined>
  }
}

type UseRefreshOptions = {
  threshold: number
  debounce: number
}

export const useRefresh = (onRefresh = () => null, options: UseRefreshOptions) => {
  const {
    threshold,
    debounce,
  } = options

  const [refresh, setRefresh] = React.useState(false)

  const containerRef = React.useRef(null)

  const { offset } = useContainerPosition(containerRef)
  const { scrollTop, isScrolling } = useScroller(offset, 2)

  const handleRefresh = React.useCallback(() => {
    if (!refresh && isScrolling) {
      setRefresh(true)
      onRefresh?.()

      setTimeout(() => {
        setRefresh(false)
      }, debounce)
    }
  }, [refresh, isScrolling])

  onUpdate(() => {
    if (scrollTop <= threshold) {
      handleRefresh()
    }
  }, [scrollTop])

  return {
    refresh,
    scrollableRef: containerRef,
  }
}

export function useInfiniteScroll<Item extends Element = any>(props: UseInfiniteScrollProps<Item>): UseInfiniteScrollReturn<Item> {
  const {
    onRefresh,
    data,
    hasNextPage,
    fetchNextPage,
    refreshThreshold,
    refreshDebounce,
    loadMoreOptions = {},
    onLoadMore,
    threshold = 3,
  } = props

  const infiniteLoader = useInfiniteLoader(
    async (args) => {
      if (hasNextPage) await fetchNextPage?.()
      if (TypeGuards.isFunction(onLoadMore)) await onLoadMore?.(args)
    },
    {
      isItemLoaded: (index, items) => !!items?.[index],
      minimumBatchSize: 32,
      threshold: threshold,
      ...loadMoreOptions,
    },
  )

  const { refresh, scrollableRef } = useRefresh(
    onRefresh, 
    { 
      threshold: refreshThreshold, 
      debounce: refreshDebounce 
    }
  )

  const isEmpty = !data || !data?.length

  return {
    onLoadMore: infiniteLoader,
    isRefresh: refresh,
    layoutProps: {
      scrollableRef,
      refreshing: refresh,
      isEmpty,
    }
  }
}
