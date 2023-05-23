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
  avatares: AvatarProps[]
  avatarVariants?: AvatarProps['variants']
}

export const AvatarGroup: React.FC<AvatarGroupProps> = (props) => {
  const {
    variants = [],
    avatares = [],
    avatarVariants,
    styles,
    style,
    ...viewProps
  } = props

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
      {avatares.map((avatar, index) => (
        <Avatar
          firstNameOnly
          {...avatar}
          variants={avatar.variants || avatarVariants}
          key={avatar.debugName}
          style={getAvatarStyle(index)}
          styles={avatarStyles}
        />
      ))}
    </View>
  )
}

const getAvatarStyle = (index: number) => {
  const displacement = index * 20.5
  return { right: `${displacement}%` }
}

export * from './styles'
