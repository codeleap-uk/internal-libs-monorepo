import { AppIcon, StyledProp, StyleRecord } from '@codeleap/styles'
import { BadgeProps } from '../Badge'
import { AvatarComposition } from './styles'
import { ReactNode } from 'react'
import { TouchableProps } from '../Touchable'
import { AnyFunction } from '@codeleap/types'
import { ImageRequireSource } from 'react-native/types'

export type AvatarProps = Omit<TouchableProps, 'debugName' | 'style'> &
  {
    text?: string
    image?: ImageRequireSource | string
    icon?: AppIcon
    badge?: BadgeProps['badge']
    name?: string | string[]
    firstNameOnly?: boolean
    overlayIcon?: AppIcon
    onPressOverlayIcon?: AnyFunction
    debugName?: string
    style?: StyledProp<AvatarComposition>
    children?: ReactNode
  }

export type AvatarTextProps = Pick<AvatarProps, 'text' | 'firstNameOnly' | 'name'>

export type AvatarIllustrationProps = Pick<AvatarProps, 'image' | 'icon'>

export type AvatarBadgeProps = Pick<AvatarProps, 'badge'> & Omit<BadgeProps, 'badge' | 'style'>

export type AvatarOverlayIconProps = Pick<AvatarProps, 'overlayIcon'> & Omit<TouchableProps, 'onPress' | 'style' | 'debugName'>

export type AvatarCtxValue = Omit<AvatarProps, 'style' | 'children'> & {
  styles: StyleRecord<AvatarComposition>
}
