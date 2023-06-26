import {
  ComponentVariants,
  useDefaultComponentStyle,
  useNestedStylesByKey,
} from '@codeleap/common'
import React from 'react'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types'
import { AvatarGroupComposition, AvatarGroupPresets } from './styles'
import { View, ViewProps } from '../View'
import { Avatar, AvatarProps } from '../Avatar'

export type AvatarGroupProps = ComponentVariants<typeof AvatarGroupPresets> & {
  styles?: StylesOf<AvatarGroupComposition>
  style?: ViewProps['style']
  avatars: AvatarProps[]
  displacement?: number
  avatarVariants?: AvatarProps['variants']
}

const defaultProps:Partial<AvatarGroupProps> = {
  displacement: 20.5,
}

export const AvatarGroup: React.FC<AvatarGroupProps> = (props) => {
  const {
    variants = [],
    avatars = [],
    avatarVariants,
    styles,
    style,
    displacement,
    ...viewProps
  } = {
    ...defaultProps,
    ...props,
  }

  const variantStyles = useDefaultComponentStyle('u:AvatarGroup', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  const avatarStyles = useNestedStylesByKey('avatar', variantStyles)

  return (
    <View
      style={[variantStyles.wrapper, style]}
      variants={['row']}
      {...viewProps}
    >
      {avatars.map((avatar, index) => (
        <Avatar
          firstNameOnly
          key={avatar.debugName || index}
          {...avatar}
          variants={avatar.variants || avatarVariants}
          style={getAvatarStyle(index, displacement)}
          styles={avatarStyles}
        />
      ))}
    </View>
  )
}

AvatarGroup.defaultProps = defaultProps

const getAvatarStyle = (index: number, displacementPixels: number) => {
  const displacement = index * 20.5
  return { right: `${displacement}%` }
}

export * from './styles'
