import React from 'react'
import { LoadingOverlayComposition } from './styles'
import { ViewProps } from '../View'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { ComponentCommonProps } from '../../types/utility'
import { StyledProp } from '@codeleap/styles'

export type LoadingOverlayProps =
  Omit<ViewProps, 'style'> &
  ComponentCommonProps &
  {
    visible?: boolean
    style?: StyledProp<LoadingOverlayComposition>
    indicatorProps?: ActivityIndicatorProps
    children?: React.ReactNode
  }
