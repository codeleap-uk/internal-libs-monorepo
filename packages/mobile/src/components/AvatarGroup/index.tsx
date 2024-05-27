import React from 'react'
import { View } from '../View'
import { Avatar } from '../Avatar'
import { AvatarGroupProps } from './types'
import { AnyRecord, useNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

const defaultProps: Partial<AvatarGroupProps> = {
  displacement: 20.5,
}

export const AvatarGroup = (props: AvatarGroupProps) => {
  const {
    avatars = [],
    style,
    displacement,
    ...viewProps
  } = {
    ...AvatarGroup.defaultProps,
    ...props,
  }

  const styles = useStylesFor(AvatarGroup.styleRegistryName, style)

  const avatarStyles = useNestedStylesByKey('avatar', styles)

  return (
    <View style={styles.wrapper} {...viewProps}>
      {avatars?.map?.((avatar, index) => (
        <Avatar
          firstNameOnly
          key={avatar.debugName || index}
          {...avatar}
          style={[avatarStyles, avatar?.style, getAvatarStyle(index, displacement)]}
        />
      ))}
    </View>
  )
}

AvatarGroup.styleRegistryName = 'AvatarGroup'
AvatarGroup.elements = ['wrapper', 'avatar']
AvatarGroup.rootElement = 'wrapper'

AvatarGroup.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return AvatarGroup as (props: StyledComponentProps<AvatarGroupProps, typeof styles>) => IJSX
}

AvatarGroup.defaultProps = defaultProps

MobileStyleRegistry.registerComponent(AvatarGroup)

const getAvatarStyle = (index: number, displacement: number = 20.5) => {
  const right = index * displacement
  return { right: `${right}%` }
}
