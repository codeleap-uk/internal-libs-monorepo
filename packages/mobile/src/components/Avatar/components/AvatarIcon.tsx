import React from 'react'
import { useAvatarContext } from '../context'
import { Icon } from '../../Icon'

export const AvatarIcon = () => {
  const { icon, styles } = useAvatarContext()
  if (!icon) return null
  return <Icon name={icon} style={styles.icon} />
}
