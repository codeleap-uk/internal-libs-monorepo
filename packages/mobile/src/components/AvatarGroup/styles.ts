import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { AvatarComposition } from '../components'

export type AvatarGroupParts = 'wrapper'

export type AvatarGroupComposition = AvatarGroupParts | `avatar${Capitalize<AvatarComposition>}`

const createAvatarStyle = createDefaultVariantFactory<AvatarGroupComposition>()

export const AvatarGroupPresets = includePresets((styles) => createAvatarStyle(() => ({ wrapper: styles })),
)
