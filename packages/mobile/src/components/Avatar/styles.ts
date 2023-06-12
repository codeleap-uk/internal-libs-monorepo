import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type AvatarParts =
  | 'wrapper'
  | 'touchable'
  | 'initials'
  | 'image'
  | 'icon'
  | 'iconWrapper'
  | 'description'
  | 'descriptionOverlay'

export type AvatarComposition = AvatarParts

const createAvatarStyle = createDefaultVariantFactory<AvatarComposition>()

export const AvatarPresets = includePresets((styles) => createAvatarStyle(() => ({ wrapper: styles })),
)
