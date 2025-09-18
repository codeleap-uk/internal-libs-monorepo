import { StyledProp, StyleRecord } from '@codeleap/styles'
import { BadgeComponentProps } from '../Badge'
import { IconProps } from '../Icon'
import { ImageProps } from '../Image'
import { ViewProps } from '../View'
import { AvatarComposition } from './styles'
import { TouchableProps } from '../Touchable'

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
    badgeIconTouchProps?: Partial<TouchableProps>
    style?: StyledProp<AvatarComposition>
    onPress?: () => void
    noFeedback?: boolean
    imageProps?: Partial<ImageProps>
  }

export type AvatarCtxValue = Omit<AvatarProps, 'style'> & {
    styles: StyleRecord<AvatarComposition>
  }
