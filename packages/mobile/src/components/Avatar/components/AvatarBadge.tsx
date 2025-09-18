import React from 'react'
import { useAvatarContext } from '../context'
import { Badge } from '../../Badge'
import { useNestedStylesByKey } from '@codeleap/styles'

export const AvatarBadge = () => {
  const { badge, badgeProps, styles } = useAvatarContext()
  const badgeStyles = useNestedStylesByKey('badge', styles)
  if (!badge) return null
  return <Badge badge={badge} {...badgeProps} style={badgeStyles} />
}
