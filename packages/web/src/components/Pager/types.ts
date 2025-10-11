import { StylesOf } from '@codeleap/types'
import { PagerComposition } from './styles'
import React, { ReactNode, ReactElement } from 'react'
import { ViewProps } from '../View'
import { ComponentCommonProps } from '../../types'
import { StyledProp } from '@codeleap/styles'

export type PagerRef = {
  goTo: (page: number) => void
}

export type PagerProps =
  Omit<{
    dots: any
    infinite: any
  }, 'style'> &
  ComponentCommonProps &
  {
    style?: StyledProp<PagerComposition>
    page?: number
    children: ReactNode
    onChange?: (page: number) => void
    renderPageWrapper?: any
    footer?: ReactElement
    dotsProps?: DotsProps
    pageWrapperProps?: ViewProps
    dotsDisabled?: boolean
    disableSwipe?: boolean
  }

export type DotsProps =
  Pick<PagerProps, 'page' | 'dotsDisabled'> &
  {
    childArray: ReactNode[]
    onPress?: (index: number) => void
    styles: StylesOf<PagerComposition>
  }
