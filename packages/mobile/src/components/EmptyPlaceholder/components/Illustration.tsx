import React from 'react'
import { AppIcon } from '@codeleap/styles'
import { Icon } from '../../Icon'
import { EmptyPlaceholderIllustrationProps } from '../types'
import { Image } from '../../Image'
import { useEmptyPlaceholderContext } from '../context'

export const EmptyPlaceholderIllustration = (props: EmptyPlaceholderIllustrationProps) => {
  const { icon, image, styles } = useEmptyPlaceholderContext(props)

  return <>
    {icon ? <Icon name={icon as AppIcon} style={styles.icon} /> : null}
    {image ? <Image source={image} style={styles.image} /> : null}
  </>
}
