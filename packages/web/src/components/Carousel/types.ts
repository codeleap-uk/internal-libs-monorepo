import { StylesOf } from '@codeleap/types'
import { CarouselComposition } from './styles'
import React, { ReactNode, ReactElement } from 'react'
import { ViewProps } from '../View'
import { ComponentCommonProps } from '../../types'
import { StyledProp } from '@codeleap/styles'

export type CarouselRef = {
  goTo: (index: number) => void
  next: () => void
  prev: () => void
}

export type CarouselProps =
  ComponentCommonProps &
  {
    style?: StyledProp<CarouselComposition>
    page?: number
    children: ReactNode
    onChange?: (index: number) => void
    renderSlideWrapper?: any
    footer?: ReactElement
    dotsProps?: DotsProps
    slideWrapperProps?: ViewProps
    dotsDisabled?: boolean
    disableSwipe?: boolean
    dots?: boolean
    infinite?: boolean
    autoplay?: boolean
    autoplayDelay?: number
    spaceBetween?: number
    slidesPerView?: number | 'auto'
  }

export type DotsProps =
  Pick<CarouselProps, 'page' | 'dotsDisabled'> &
  {
    childArray: ReactNode[]
    onPress?: (index: number) => void
    styles: StylesOf<CarouselComposition>
  }
