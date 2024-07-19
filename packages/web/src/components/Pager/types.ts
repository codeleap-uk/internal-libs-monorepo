import { StylesOf } from '@codeleap/common'
import { Settings } from 'react-slick'
import { PagerComposition } from './styles'
import React, { ReactNode, ReactElement } from 'react'
import { ViewProps } from '../View'
import { ComponentCommonProps } from '../../types'
import { StyledProp } from '@codeleap/styles'

export type PagerRef = {
  goTo: (page: number) => void
}

export type PagerProps =
  Omit<Settings, 'style'> &
  ComponentCommonProps &
  {
    style?: StyledProp<PagerComposition>
    page?: number
    children: ReactNode
    onChange?: (page: number) => void
    renderPageWrapper?: React.FC
    footer?: ReactElement
    dotsProps?: DotsProps
    pageWrapperProps?: ViewProps<'div'>
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
