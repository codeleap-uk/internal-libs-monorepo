import React from 'react'
import { useAvatarContext } from '../context'
import { AvatarBadge } from './Badge'
import { AvatarIllustration } from './Illustration'
import { AvatarText } from './Text'
import { AvatarOverlayIcon } from './OverlayIcon'
import { AvatarWrapper } from './Wrapper'

export const AvatarContent = ({ children }: React.PropsWithChildren) => {
  const { icon, image } = useAvatarContext()

  if (children) {
    return (
      <AvatarWrapper>{children}</AvatarWrapper>
    )
  }

  return (
    <AvatarWrapper>
      {(!!icon || !!image) ? <AvatarIllustration /> : <AvatarText />}
      <AvatarBadge />
      <AvatarOverlayIcon />
    </AvatarWrapper>
  )
}
