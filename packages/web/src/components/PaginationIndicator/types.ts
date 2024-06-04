import React from 'react'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { TextProps } from '../Text'
import { ComponentCommonProps } from '../../types'
import { PaginationIndicatorComposition } from './styles'
import { StyledProp } from '@codeleap/styles'

export type PaginationIndicatorProps = {
    isFetching?: boolean
    noMoreItemsText: React.ReactChild
    hasMore?: boolean
    activityIndicator?: JSX.Element
    style: StyledProp<PaginationIndicatorComposition>
    indicatorProps?: Partial<ActivityIndicatorProps>
    textProps?: Partial<TextProps<'p'>>
  } & ComponentCommonProps
