import { AvatarComposition } from '../components'

export type AvatarGroupParts = 'wrapper'

export type AvatarGroupComposition = AvatarGroupParts | `avatar${Capitalize<AvatarComposition>}`
