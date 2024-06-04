import React from 'react'
import { View } from '../View'
import { ActivityIndicatorComposition, ActivityIndicatorProps } from '../ActivityIndicator'
import { EmptyPlaceholderComposition } from './styles'
import { IconPlaceholder, StylesOf } from '@codeleap/common'
import { ComponentCommonProps } from '../../types'
import { StyledProp } from '@codeleap/styles'

type RenderEmptyProps = {
    emptyText: string | React.ReactElement
    emptyIconName?: IconPlaceholder
    styles: StylesOf<EmptyPlaceholderComposition> & {
      activityIndicatorStyles: StylesOf<ActivityIndicatorComposition>
    }
}

export type EmptyPlaceholderProps = {
    itemName?: string
    title?: React.ReactElement | string
    description?: React.ReactElement | string
    icon?: IconPlaceholder | ((props: EmptyPlaceholderProps) => JSX.Element) | null
    loading?: boolean
    style?: StyledProp<EmptyPlaceholderComposition>
    renderEmpty?: (props: RenderEmptyProps) => JSX.Element
    wrapperProps?: Partial<typeof View>
    imageWrapperProps?: Partial<typeof View>
    indicatorProps?: Partial<ActivityIndicatorProps>
  } & ComponentCommonProps
