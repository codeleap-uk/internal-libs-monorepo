import React, { ReactNode } from 'react'
import { StyledProp } from '@codeleap/styles'
import { PagerComposition } from './styles'
import { TCarouselProps } from 'react-native-reanimated-carousel'
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types'

export type PageProps<T = any> = CarouselRenderItemInfo<T> & {
  isLast: boolean
  isFirst: boolean
  isActive: boolean
  isOnly: boolean
  isNext: boolean
  index: number
  isPrevious: boolean
}

export type PagerProps<T = any> = Omit<TCarouselProps<T>, 'data' | 'renderItem'> & {
  pages: TCarouselProps<T>['data']
  renderItem?: (props: PageProps<T>) => ReactNode
  page?: number
  setPage?: (page: number) => void
  initialPage?: number
  style?: StyledProp<PagerComposition>
  showDots?: boolean
  footer?: ReactNode
}
