import { BadgeComposition } from '../Badge'

export type AvatarComposition =
  | 'wrapper'
  | 'text'
  | 'image'
  | 'icon'
  | 'overlayIconWrapper'
  | 'overlayIcon'
  | `badge${Capitalize<BadgeComposition>}`
