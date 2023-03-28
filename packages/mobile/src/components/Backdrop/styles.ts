import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type BackdropComposition =
 'wrapper'|
'touchable' |
'wrapper:visible' |
'wrapper:hidden'

const createBackdropVariant = createDefaultVariantFactory<BackdropComposition>()

export const BackdropPresets = includePresets((style) => createBackdropVariant(() => ({ wrapper: style })))
