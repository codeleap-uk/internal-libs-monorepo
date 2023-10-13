import { StylesOf, ComponentVariants, IconPlaceholder } from '@codeleap/common'
import { ReactElement } from 'react'
import { TagComposition, TagPresets } from './styles'
import { BadgeProps } from '../Badge'
import { TextProps } from '../Text'
import { IconProps } from '../Icon'
import { ComponentCommonProps } from '../../types'
import { TouchableProps } from '../Touchable'
import { ViewProps } from '../View'

export type TagProps = 
  Omit<ViewProps<'div'>, 'styles' | 'variants' | 'responsiveVariants'> &
  Omit<TouchableProps, 'styles' | 'variants' | 'responsiveVariants'> &
  ComponentVariants<typeof TagPresets> &
  ComponentCommonProps & {
    styles?: StylesOf<TagComposition>
    text?: TextProps<'p'>['text'] | ReactElement
    textProps?: Partial<TextProps<'p'>>
    leftIcon?: IconPlaceholder
    leftIconProps?: Partial<IconProps>
    rightIcon?: IconPlaceholder
    rightIconProps?: Partial<IconProps>
    leftComponent?: ReactElement
    rightComponent?: ReactElement
    leftBadge?: BadgeProps['badge']
    rightBadge?: BadgeProps['badge']
    leftBadgeProps?: Partial<BadgeProps>
    rightBadgeProps?: Partial<BadgeProps>
  }
