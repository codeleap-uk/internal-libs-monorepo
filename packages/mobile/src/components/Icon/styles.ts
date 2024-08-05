import { BadgeComposition } from '../Badge'

export type IconComposition = 'icon' | 'iconBadgeWrapper' | `badge${Capitalize<BadgeComposition>}`
