import React from 'react'
import { View } from '../View'
import { ActivityIndicatorComposition, ActivityIndicatorProps } from '../ActivityIndicator'
import { EmptyPlaceholderComposition } from './styles'
import { PropsOf, StylesOf } from '@codeleap/common'
import { ComponentCommonProps } from '../../types'
import { AppIcon, StyledProp } from '@codeleap/styles'

type RenderEmptyProps = {
  emptyText: string | React.ReactElement
  emptyIconName?: AppIcon
  styles: StylesOf<EmptyPlaceholderComposition> & {
    activityIndicatorStyles: StylesOf<ActivityIndicatorComposition>
  }
}

export type EmptyPlaceholderProps =
  ComponentCommonProps &
  {
    itemName?: string
    title?: React.ReactElement | string
    description?: React.ReactElement | string
    icon?: AppIcon | ((props: EmptyPlaceholderProps) => JSX.Element) | null
    image?: string
    imageProps?: PropsOf<typeof HTMLImageElement>
    loading?: boolean
    style?: StyledProp<EmptyPlaceholderComposition>
    renderEmpty?: (props: RenderEmptyProps) => JSX.Element
    wrapperProps?: Partial<typeof View>
    imageWrapperProps?: Partial<typeof View>
    indicatorProps?: Partial<ActivityIndicatorProps>
  }
