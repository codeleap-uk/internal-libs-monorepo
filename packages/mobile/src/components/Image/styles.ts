import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { LoadingOverlayComposition } from '../LoadingOverlay/styles'

export type ImageComposition = 'wrapper' | 'touchable' | `overlay${Capitalize<LoadingOverlayComposition>}`
const createImageStyle = createDefaultVariantFactory<ImageComposition>()

const presets = includePresets((styles) => createImageStyle(() => ({ wrapper: styles, touchable: styles })),
)

export const ImageStyles = {
  ...presets,
  default: createImageStyle(() => ({
    wrapper: {},
  })),

  round: createImageStyle(() => ({
    wrapper: {
      borderRadius: 100,
    },
  })),
}
