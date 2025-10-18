import { PartialKeys, Virtualizer, VirtualizerOptions } from '@tanstack/react-virtual'
import { ReactElement } from 'react'
import { AnyFunction, PropsOf } from '@codeleap/types'
import { EmptyPlaceholder } from '../EmptyPlaceholder'

type VirtualListItem<T> = {
  item: T
  index: number
}

type VirtualOptions = PartialKeys<VirtualizerOptions<HTMLDivElement, Element>, "observeElementRect" | "observeElementOffset" | "scrollToFn">

export type VirtualListProps<T> = Partial<Omit<VirtualOptions, 'estimateSize' | 'data'>> & {
  data: T[]
  fetchNextPage?: AnyFunction
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  estimateSize?: (item: T) => number
}

export type VirtualListContextValue<T> = {
  virtualizer: Virtualizer<HTMLDivElement, Element>
  scrollRef: React.RefObject<HTMLDivElement>
  loadNextPage: () => void
  list: Pick<VirtualListProps<T>, 'data' | 'fetchNextPage' | 'isFetchingNextPage' | 'hasNextPage'>
  virtualizerItemCount: number
  paginationIndicatorIndex: number | null
  lastItemIndex: number
}

export type VirtualListItemsProps<T> = {
  renderItem: (data: VirtualListItem<T>) => ReactElement
  FooterComponent?: () => ReactElement
}

export type VirtualListContainerProps = React.PropsWithChildren<React.ComponentPropsWithoutRef<'div'>> & {
  placeholder?: ReactElement | Partial<PropsOf<typeof EmptyPlaceholder>>
}
