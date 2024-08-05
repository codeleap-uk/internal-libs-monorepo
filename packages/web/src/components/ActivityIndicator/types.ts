import React from 'react'
import { StyledProp } from '@codeleap/styles'
import { ComponentCommonProps } from '../../types'
import { ActivityIndicatorComposition } from './styles'

export type ActivityIndicatorProps =
  ComponentCommonProps &
  {
    style?: StyledProp<ActivityIndicatorComposition>
    component?: React.ComponentType<Omit<ActivityIndicatorProps & { ref?: React.Ref<HTMLDivElement> }, 'component'>>
    size?: number
  }
