import { OverlayComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createOverlayStyle =
  variantProvider.createVariantFactory<OverlayComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Overlay')

export const AppOverlayStyles = {
  ...defaultStyles,
  default: createOverlayStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
