import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { LoadingOverlayComposition } from '../LoadingOverlay/styles'

export type ImageComposition = 'wrapper' | 'touchable' | `overlay${Capitalize<LoadingOverlayComposition>}`
const createImageStyle = createDefaultVariantFactory<ImageComposition>()

export const ImagePresets = includePresets((styles) => createImageStyle(() => ({ wrapper: styles, touchable: styles })))

