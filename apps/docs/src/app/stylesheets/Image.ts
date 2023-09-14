import { includePresets } from "@codeleap/common"
import { variantProvider } from "../theme"

export type ImageComposition = 'wrapper'

const createImageStyle = variantProvider.createVariantFactory<ImageComposition>()

export const ImagePresets = includePresets((styles) => createImageStyle(() => ({ wrapper: styles })))

export const AppImageStyles = {
  ...ImagePresets,
  default: createImageStyle(() => ({
    wrapper: {},
  })),
  skeleton: createImageStyle(theme => ({
    wrapper: {
      backgroundColor: theme.colors.neutral2,
    },
  })),
  round: createImageStyle(theme => ({
    wrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
}
