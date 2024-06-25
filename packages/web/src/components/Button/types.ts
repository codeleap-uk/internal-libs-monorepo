import React from 'react'
import { AnyFunction, PropsOf } from '@codeleap/common'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { Touchable } from '../Touchable'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { ButtonComposition } from './styles'
import { ComponentCommonProps } from '../../types'

export type ButtonProps =
  PropsOf<typeof Touchable, 'style'> &
  ComponentCommonProps &
  {
    text?: string
    rightIcon?: AppIcon
    icon?: AppIcon
    onPress?: AnyFunction
    style?: StyledProp<ButtonComposition>
    loading?: boolean
    loadingShowText?: boolean
    debugName: string
    debounce?: number
    selected?: boolean
    children?: React.ReactNode
    loaderProps?: Partial<ActivityIndicatorProps>
  }
