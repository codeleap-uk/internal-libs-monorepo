import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { BadgeComposition } from '../Badge'

export type AvatarParts =
  | 'wrapper'
  | 'touchable'
  | 'initials'
  | 'image'
  | 'icon'
  | 'iconWrapper'
  | 'description'
  | 'descriptionOverlay'
  | 'badgeIconWrapper'
  | 'badgeIcon'
  | `badge${Capitalize<BadgeComposition>}`

export type AvatarComposition = AvatarParts

const createAvatarStyle = createDefaultVariantFactory<AvatarComposition>()

export const AvatarPresets = includePresets((styles) => createAvatarStyle(() => ({ wrapper: styles })),
)
