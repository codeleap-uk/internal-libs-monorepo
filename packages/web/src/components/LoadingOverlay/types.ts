import React from 'react'
import { LoadingOverlayComposition } from './styles'
import { View } from '../View'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { ComponentCommonProps } from '../../types/utility'
import { StyledProp } from '@codeleap/styles'
import { PropsOf } from '@codeleap/common'

export type LoadingOverlayProps =
  PropsOf<typeof View, 'style'> &
  ComponentCommonProps &
  {
    visible?: boolean
    style?: StyledProp<LoadingOverlayComposition>
    indicatorProps?: ActivityIndicatorProps
    children?: React.ReactNode
  }
