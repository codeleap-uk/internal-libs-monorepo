import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { BadgeComposition } from '../Badge'

export type IconComposition = 'icon' | 'wrapper' | `badge${Capitalize<BadgeComposition>}`

const createIconStyle = createDefaultVariantFactory<IconComposition>()

export const IconPresets = includePresets((styles) => createIconStyle(() => ({ icon: styles })))
