import React from 'react'
import { useAvatarContext } from '../context'
import { Badge } from '../../Badge'
import { useCompositionStyles } from '@codeleap/styles'
import { AvatarBadgeProps } from '../types'
import { TypeGuards } from '@codeleap/types'

export const AvatarBadge = (props: AvatarBadgeProps) => {
  const { badge, styles, ...badgeProps } = useAvatarContext(props)

  const compositionsStyles = useCompositionStyles('badge', styles)

  if (TypeGuards.isNil(badge)) return null

  return <Badge badge={badge} {...badgeProps} style={compositionsStyles.badge} />
}
