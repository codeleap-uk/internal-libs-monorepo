import React from 'react'
import { Icon } from '../../Icon'
import { AvatarIllustrationProps } from '../types'
import { Image } from '../../Image'
import { useAvatarContext } from '../context'
import { TypeGuards } from '@codeleap/types'

export const AvatarIllustration = (props: AvatarIllustrationProps) => {
  const { icon, image, styles } = useAvatarContext(props)

  const source = TypeGuards.isString(image) ? { uri: image } : image

  return <>
    {icon ? <Icon name={icon} style={styles.icon} /> : null}
    {image ? <Image source={source} style={styles.image} /> : null}
  </>
}
