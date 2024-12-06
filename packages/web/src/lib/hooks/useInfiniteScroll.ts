import React from 'react'
import { AnyFunction, TypeGuards } from '@codeleap/types'
import { LoadMoreItemsCallback, UseInfiniteLoaderOptions, useInfiniteLoader } from 'masonic'
import { ListProps } from '../../components/List'
import { GridProps } from '../../components/Grid'
import { useRefresh } from './useRefresh'

export type UseInfiniteScrollArgs<Item extends Element = any> = {
    threshold?: number
    onLoadMore?: AnyFunction
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
    onRefreshItems: AnyFunction
  }

export function useInfiniteScroll<Item extends Element = any>(props: UseInfiniteScrollProps<Item>): UseInfiniteScrollReturn<Item> {
  const {
    onRefresh,
    data,
    hasNextPage,
    refresh: refreshEnabled,
    fetchNextPage,
    refreshThreshold,
    refreshDebounce,
    loadMoreOptions = {},
    onLoadMore,
    threshold = 16,
  } = props

  const infiniteLoader = useInfiniteLoader(
    async (args) => {
      if (hasNextPage) await fetchNextPage?.()
      if (TypeGuards.isFunction(onLoadMore)) await onLoadMore?.(args)
    },
    {
      isItemLoaded: (index, items) => !!items?.[index],
      threshold: threshold,
      ...loadMoreOptions,
    },
  )

  const refreshHookReturn = useRefresh(
    onRefresh,
    {
      threshold: refreshThreshold,
      debounce: refreshDebounce,
      enabled: refreshEnabled,
    },
  )

  const isEmpty = React.useMemo(() => (!data || !data?.length), [data?.length])

  return {
    onLoadMore: infiniteLoader,
    isRefresh: refreshHookReturn.refresh,
    layoutProps: {
      scrollableRef: refreshHookReturn.scrollableRef,
      refreshing: refreshHookReturn.refresh,
      isEmpty,
    },
    onRefreshItems: refreshHookReturn.refresher,
  }
}
