import React from 'react'
import { AvatarProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { AvatarContext } from './context'
import { AvatarContent } from './components/Content'
import { useStylesFor } from '../../hooks'
import { AvatarIllustration } from './components/Illustration'
import { AvatarText } from './components/Text'
import { AvatarBadge } from './components/Badge'
import { AvatarOverlayIcon } from './components/OverlayIcon'

export * from './styles'
export * from './types'

export const Avatar = (props: AvatarProps) => {
  const {
    children,
    style,
    ...contextValue
  } = {
    ...Avatar.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Avatar.styleRegistryName, style)

  return (
    <AvatarContext.Provider value={{ ...contextValue, styles }}>
      <AvatarContent>
        {children}
      </AvatarContent>
    </AvatarContext.Provider>
  )
}

Avatar.styleRegistryName = 'Avatar'
Avatar.elements = ['wrapper', 'text', 'image', 'icon', 'overlayIcon', 'badge']
Avatar.rootElement = 'wrapper'

Avatar.Illustration = AvatarIllustration
Avatar.Text = AvatarText
Avatar.Badge = AvatarBadge
Avatar.OverlayIcon = AvatarOverlayIcon

Avatar.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Avatar as ((props: StyledComponentProps<AvatarProps, typeof styles>) => IJSX) & Pick<typeof Avatar, 'Text' | 'Illustration' | 'Badge' | 'OverlayIcon'>
}

Avatar.defaultProps = {
  badge: false,
  firstNameOnly: false,
} as Partial<AvatarProps>

MobileStyleRegistry.registerComponent(Avatar)
