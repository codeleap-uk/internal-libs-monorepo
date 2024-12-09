import React, { ImgHTMLAttributes } from 'react'
import { ViewProps } from '../View'
import { ActivityIndicatorComposition, ActivityIndicatorProps } from '../ActivityIndicator'
import { EmptyPlaceholderComposition } from './styles'
import { StylesOf } from '@codeleap/types'
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
    icon?: AppIcon | ((props: EmptyPlaceholderProps) => JSX.Element)
    image?: string
    imageProps?: ImgHTMLAttributes<HTMLImageElement>
    loading?: boolean
    style?: StyledProp<EmptyPlaceholderComposition>
    renderEmpty?: (props: RenderEmptyProps) => JSX.Element
    wrapperProps?: ViewProps
    imageWrapperProps?: ViewProps
    indicatorProps?: Partial<ActivityIndicatorProps>
    ImageComponent?: React.ComponentType
  }
