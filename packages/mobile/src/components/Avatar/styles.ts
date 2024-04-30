import { BadgeComposition } from '../Badge'

export type AvatarComposition =
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
