import { PropsOf } from '@codeleap/common'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { BadgeComposition } from './styles'
import { ComponentCommonProps } from '../../types'
import { StyledProp } from '@codeleap/styles'

export type BadgeProps = Omit<ViewProps<'div'>, 'style'> & ComponentCommonProps & {
    style?: StyledProp<BadgeComposition>
    maxCount?: number
    minCount?: number
    debugName?: string
    innerWrapperProps?: Partial<PropsOf<typeof View>>
    textProps?: Partial<PropsOf<typeof Text>>
    getBadgeContent?: (props: BadgeContent) => string
    renderBadgeContent?: (props: BadgeContent & { content: string }) => JSX.Element
    disabled?: boolean
    badge?: number | boolean
  }

export type BadgeContent = BadgeProps & { count: number }

export type BadgeComponentProps = {
  badge?: BadgeProps['badge']
  badgeProps?: Partial<BadgeProps>
}
