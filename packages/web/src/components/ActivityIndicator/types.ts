import React from 'react'
import { ActivityIndicatorComposition } from '@codeleap/common'
import { StyledProp } from '@codeleap/styles'
import { ComponentCommonProps } from '../../types'

export type ActivityIndicatorProps =
  ComponentCommonProps &
  {
    style?: StyledProp<ActivityIndicatorComposition>
    component?: React.ComponentType<Omit<ActivityIndicatorProps & { ref?: React.Ref<HTMLDivElement> }, 'component'>>
    size?: number
  }
