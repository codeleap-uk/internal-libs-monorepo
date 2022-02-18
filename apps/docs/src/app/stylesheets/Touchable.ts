import { TouchableComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createTouchableStyle =
  variantProvider.createVariantFactory<TouchableComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Touchable')

export const AppTouchableStyles = {
  ...defaultStyles,
  default: createTouchableStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
