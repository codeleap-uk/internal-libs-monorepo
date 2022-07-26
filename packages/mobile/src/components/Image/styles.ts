import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ImageComposition = 'wrapper' | 'touchable'
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
