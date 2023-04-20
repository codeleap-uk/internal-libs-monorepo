import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ViewComposition = 'wrapper'

const createViewStyle = createDefaultVariantFactory<ViewComposition>()

export const ViewPresets = includePresets((styles) => createViewStyle(() => ({ wrapper: styles })))

