import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type IconComposition = 'icon'

const createIconStyle = createDefaultVariantFactory<IconComposition>()

export const IconPresets = includePresets((styles) => createIconStyle(() => ({ icon: styles })))

