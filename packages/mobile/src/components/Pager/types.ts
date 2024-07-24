import { StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps } from 'react-native'
import { PagerComposition } from './styles'

export type PageProps = {
  isLast: boolean
  isFirst: boolean
  isActive: boolean
  isNext: boolean
  page: number
  index: number
  isPrevious: boolean
}

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

export type PagerProps =
  Omit<ScrollViewProps, 'style'> &
  {
    children?: (((pageData: PageProps) => ReactNode) | ReactNode)[]
    page?: number
    setPage?: (page: number) => void
    returnEarly?: boolean
    renderPageWrapper?: React.FC<PageProps>
    pageWrapperProps?: any
    width?: number
    onScroll?: (event: ScrollEvent, args: { isLeft?: boolean; isRight?: boolean; x?: number }) => void
    /** If TRUE render page, nextPage and prevPage only */
    windowing?: boolean
    scrollRightEnabled?: boolean
    scrollLeftEnabled?: boolean
    scrollDirectionThrottle?: number
    onSwipeLastPage?: (event: ScrollEvent) => void
    waitEventDispatchTimeout?: number
    style?: StyledProp<PagerComposition>
  }
