import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type DropzoneComposition = 'wrapper'

const createDropzoneStyle = createDefaultVariantFactory<DropzoneComposition>()

export const DropzonePresets = includePresets((styles) => createDropzoneStyle(() => ({ wrapper: styles })),
)
