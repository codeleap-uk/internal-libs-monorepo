import React from 'react'
import { View } from '../View'
import { Avatar } from '../Avatar'
import { AvatarGroupProps } from './types'
import { AnyRecord, useNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

const getAvatarStyle = (index: number, displacement: number = 20.5) => {
  const right = index * displacement
  return { right: `${right}%` }
}

export const AvatarGroup = (props: AvatarGroupProps) => {
  const {
    avatars = [],
    style,
    displacement,
    debugName,
    ...viewProps
  } = {
    ...AvatarGroup.defaultProps,
    ...props,
  }

  const styles = useStylesFor(AvatarGroup.styleRegistryName, style)

  const avatarStyles = useNestedStylesByKey('avatar', styles)

  return (
    <View {...viewProps} style={styles.wrapper}>
      {avatars?.map?.((avatar, index) => (
        <Avatar
          firstNameOnly
          key={debugName + index}
          debugName={`${debugName}: ${avatar?.debugName ?? index}`}
          {...avatar}
          style={[avatarStyles, (avatar?.style ?? {}), getAvatarStyle(index, displacement)]}
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

AvatarGroup.defaultProps = {
  displacement: 20.5,
} as Partial<AvatarGroupProps>

MobileStyleRegistry.registerComponent(AvatarGroup)
