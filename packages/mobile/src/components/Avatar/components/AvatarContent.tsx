import React from 'react'
import { useAvatarContext } from '../context'
import { AvatarImage } from './AvatarImage'
import { AvatarIcon } from './AvatarIcon'
import { AvatarInitials } from './AvatarInitials'

export const AvatarContent = () => {
  const { image, icon } = useAvatarContext()

  return (
    <>
      {image ? <AvatarImage /> : icon ? <AvatarIcon /> : <AvatarInitials />}
    </>
  )
}
