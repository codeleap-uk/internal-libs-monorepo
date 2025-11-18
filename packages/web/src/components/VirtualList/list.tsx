import { useVirtualListContext } from './context'
import React, { useCallback, useEffect, useMemo } from 'react'
import { VirtualItem } from '@tanstack/react-virtual'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { VirtualListItemsProps, VirtualListContainerProps } from './types'

export function VirtualListItems<T>(props: VirtualListItemsProps<T>) {
  const { renderItem: Item, ListFooterComponent = () => null } = props

  const virtualizer = useVirtualListContext(v => v.virtualizer)
  const listItems = useVirtualListContext(v => v.list.data)
  const paginationIndicatorIndex = useVirtualListContext(v => v.paginationIndicatorIndex)
  const getNextPage = useVirtualListContext(v => v.loadNextPage)

  const items = virtualizer.getVirtualItems()

  useEffect(() => {
    getNextPage()
  }, [getNextPage])

  const ItemWrapper = useCallback((props: React.PropsWithChildren<{ item: VirtualItem }>) => {
    const { item, children } = props
    
    return <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translateY(${item.start}px)`,
      }}
      ref={virtualizer.measureElement}
      data-index={item.index}
    >
      {children}
    </div>
  }, [virtualizer.measureElement])

  const renderItem = useCallback((item: VirtualItem) => {
    const data = listItems[item.index]

    const isPaginationIndicator = item.index === paginationIndicatorIndex

    if (isPaginationIndicator) {
      return <ItemWrapper key={item.key} item={item}>
        <ListFooterComponent />
      </ItemWrapper>
    }

    return <ItemWrapper key={item.key} item={item}>
      <Item index={item.index} item={data} />
    </ItemWrapper>

  }, [Item, ItemWrapper, listItems, ListFooterComponent, paginationIndicatorIndex])

  const containerStyle = useMemo(() => ({
    height: `${virtualizer.getTotalSize()}px`,
    width: '100%',
    position: 'relative' as const,
  }), [virtualizer.getTotalSize()])

  return <div style={containerStyle}>
    {items.map(renderItem)}
  </div>
}

export const VirtualListContainer = (props: VirtualListContainerProps) => {
  const { children, placeholder, ...rest } = props

  const scrollRef = useVirtualListContext(ctx => ctx.scrollRef)

  const totalItemCount = useVirtualListContext(ctx => ctx.list?.data?.length)

  if (!totalItemCount || totalItemCount <= 0) {
    if (React.isValidElement(placeholder)) {
      return <>{placeholder}</>
    }

    return <EmptyPlaceholder {...placeholder} />
  }

  return <div ref={scrollRef} {...rest}>
    {children}
  </div>
}
