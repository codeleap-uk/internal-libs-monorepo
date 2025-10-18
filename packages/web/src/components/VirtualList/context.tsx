import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useCallback, use, createContext } from 'react'
import { VirtualListProps, VirtualListContextValue } from './types'

const VirtualListContext = createContext<VirtualListContextValue<any> | null>(null)

export function VirtualListProvider<T>(listProps: React.PropsWithChildren<VirtualListProps<T>>) {
  const {
    children,
    estimateSize,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    ...virtualizerOptions
  } = listProps

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const listLength = data?.length ?? 0

  const virtualizerItemCount = hasNextPage ? listLength + 1 : listLength

  const paginationIndicatorIndex = hasNextPage ? virtualizerItemCount - 1 : null

  const lastItemIndex = hasNextPage ? virtualizerItemCount - 2 : virtualizerItemCount - 1

  const virtualizer = useVirtualizer({
    gap: 16,
    overscan: 5,
    ...virtualizerOptions,
    count: virtualizerItemCount,
    getScrollElement: () => scrollRef.current,
    estimateSize(index) {
      if (index === paginationIndicatorIndex) {
        return 100
      }

      const item = data?.[index]

      return item && estimateSize ? estimateSize(item) : 100
    },
  })

  const loadNextPage = useCallback(() => {
    const items = virtualizer.getVirtualItems()

    const [_, lastItem] = [...items].reverse()

    if (!lastItem) {
      return
    }

    if (
      lastItem.index >= data.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage?.()
    }
  }, [
    virtualizer.getVirtualItems(),
    data?.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ])

  const contextValue = {
    virtualizer,
    loadNextPage,
    scrollRef,
    virtualizerItemCount,
    paginationIndicatorIndex,
    lastItemIndex,
    list: {
      data,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    },
  }

  return <VirtualListContext value={contextValue}>
    {children}
  </VirtualListContext>
}

export function useVirtualListContext<T extends (val: VirtualListContextValue<any>) => any>(selector: T): ReturnType<T> {
  const context = use(VirtualListContext)

  return selector(context)
}
