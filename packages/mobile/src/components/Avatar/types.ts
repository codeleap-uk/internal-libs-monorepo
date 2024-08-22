import { StyledProp } from '@codeleap/styles'
import { BadgeComponentProps } from '../Badge'
import { IconProps } from '../Icon'
import { ImageProps } from '../Image'
import { ViewProps } from '../View'
import { AvatarComposition } from './styles'

export type AvatarProps =
  Omit<ViewProps, 'style'> &
  BadgeComponentProps &
  {
    image?: ImageProps['source']
    name?: string | string[]
    debugName: string
    firstNameOnly?: boolean
    text?: string
    description?: string
    icon?: IconProps['name']
    badgeIcon?: IconProps['name']
    style?: StyledProp<AvatarComposition>
    onPress?: () => void
    noFeedback?: boolean
  }
