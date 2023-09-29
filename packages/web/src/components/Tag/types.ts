import { StylesOf, ComponentVariants, IconPlaceholder } from '@codeleap/common'
import { ReactElement } from 'react'
import { TagComposition, TagPresets } from './styles'
import { BadgeProps } from '../Badge'
import { TextProps } from '../Text'
import { IconProps } from '../Icon'
import { ViewProps } from '../View'
import { ComponentCommonProps } from '../../types'

export type TagProps = ComponentVariants<typeof TagPresets> &
  ViewProps<'div'> &
  ComponentCommonProps & {
    styles?: StylesOf<TagComposition>
    text: string
    textProps?: TextProps<'p'>
    leftIcon?: IconPlaceholder
    leftIconProps?: IconProps
    rightIcon?: IconPlaceholder
    rightIconProps?: IconProps

    leftComponent?: ReactElement
    rightComponent?: ReactElement

    leftBadge?: boolean
    rightBadge?: boolean
    leftBadgeProps?: BadgeProps
    rightBadgeProps?: BadgeProps
    onPress?: (event: React.MouseEventHandler) => void
  }
