import React from 'react'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { TextProps } from '../Text'
import { ComponentCommonProps } from '../../types'
import { PaginationIndicatorComposition } from './styles'
import { StyledProp } from '@codeleap/styles'

export type PaginationIndicatorProps =
  ComponentCommonProps & 
  {
    isFetching?: boolean
    noMoreItemsText: JSX.Element | string | number
    hasMore?: boolean
    activityIndicator?: JSX.Element
    style?: StyledProp<PaginationIndicatorComposition>
    indicatorProps?: Partial<ActivityIndicatorProps>
    textProps?: Partial<TextProps<'p'>>
  }
