import React from 'react'
import { AnyFunction, onUpdate, TypeGuards, useEffect } from '@codeleap/common'
import { ListProps } from '.'
import { GridProps } from '../Grid'
import { useInfiniteLoader, LoadMoreItemsCallback, UseInfiniteLoaderOptions, useContainerPosition, useScroller } from 'masonic'

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
}

type UseRefreshOptions = {
  threshold: number
  debounce: number
  enabled: boolean
}

const scrollDebounce = (func, delay) => {
  const timerRef = React.useRef(null)

  const scrollDebounce = (...args) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      func(...args)
    }, delay)
  }

  return scrollDebounce
}

export const useRefresh = (onRefresh = () => null, options: UseRefreshOptions) => {
  const {
    threshold,
    debounce,
    enabled,
  } = options

  if (!enabled) return {
    refresh: false,
    scrollableRef: null,
  }

  const [refresh, setRefresh] = React.useState(false)
  const pushTopTopRef = React.useRef(0)

  const containerRef = React.useRef(null)

  const refresher = React.useCallback(async () => {
    setRefresh(true)
    await onRefresh?.()

    setTimeout(() => {
      setRefresh(false)
      pushTopTopRef.current = 0
    }, 2000)
  }, [])

  const onScroll = scrollDebounce(() => {
    if (containerRef.current) {
      const rect = containerRef.current?.getBoundingClientRect()
      const scrollTop = window?.pageYOffset || document?.documentElement?.scrollTop
      
      const containerTop = rect.top + scrollTop
      const containerHeight = rect.height

      const distanceFromTop = Math.max(0, scrollTop - containerTop)
      const distanceFromBottom = Math.max(0, containerTop + containerHeight - scrollTop)

      const totalDistance = containerHeight + distanceFromTop + distanceFromBottom
      const percentage = (distanceFromTop / totalDistance) * 100

      if (percentage < threshold) {
        pushTopTopRef.current = pushTopTopRef.current + 1

        if (pushTopTopRef.current === 3) {
          refresher()
        }
      }
    }
  }, debounce)

  useEffect(() => {
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

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
    refresh: refreshEnabled,
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
      debounce: refreshDebounce,
      enabled: refreshEnabled,
    }
  )

  const isEmpty = React.useMemo(() => (!data || !data?.length), [data?.length])

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
