import { TextProps } from '../Text'
import { ViewProps } from '../View'
import { BadgeComposition } from './styles'
import { ComponentCommonProps } from '../../types'
import { StyledProp } from '@codeleap/styles'

export type BadgeProps =
  Omit<ViewProps, 'style'> &
  ComponentCommonProps &
  {
    style?: StyledProp<BadgeComposition>
    maxCount?: number
    minCount?: number
    debugName?: string
    innerWrapperProps?: Partial<ViewProps>
    textProps?: Partial<TextProps>
    getBadgeContent?: (props: BadgeContent) => string
    renderBadgeContent?: (props: BadgeContent & { content: string }) => React.ReactElement
    disabled?: boolean
    badge?: number | boolean
  }

export type BadgeContent = BadgeProps & { count: number }

export type BadgeComponentProps = {
  badge?: BadgeProps['badge']
  badgeProps?: Partial<BadgeProps>
}
