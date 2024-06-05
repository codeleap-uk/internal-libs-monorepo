import { IconPlaceholder } from '@codeleap/common'
import { StyledProp } from '@codeleap/styles'
import { ReactElement } from 'react'
import { TagComposition } from './styles'
import { BadgeProps } from '../Badge'
import { TextProps } from '../Text'
import { IconProps } from '../Icon'
import { ComponentCommonProps } from '../../types'
import { TouchableProps } from '../Touchable'
import { ViewProps } from '../View'

export type TagProps = ViewProps<'div'> & TouchableProps & ComponentCommonProps & {
    style?: StyledProp<TagComposition>
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
