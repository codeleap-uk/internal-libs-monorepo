import React from 'react'
import { useAvatarContext } from '../context'
import { Image } from '../../Image'

export const AvatarImage = () => {
  const { image, imageProps, styles } = useAvatarContext()
  if (!image) return null
  return <Image source={image} {...imageProps} style={styles.image} />
}
