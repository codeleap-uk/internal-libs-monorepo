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
    noMoreItemsText: React.ReactElement | string | number
    hasMore?: boolean
    activityIndicator?: React.ReactElement
    style?: StyledProp<PaginationIndicatorComposition>
    indicatorProps?: Partial<ActivityIndicatorProps>
    textProps?: Partial<TextProps<'p'>>
  }
