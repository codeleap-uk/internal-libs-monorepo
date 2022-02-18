import { ImageComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createImageStyle =
  variantProvider.createVariantFactory<ImageComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Image')

export const AppImageStyles = {
  ...defaultStyles,
  default: createImageStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
