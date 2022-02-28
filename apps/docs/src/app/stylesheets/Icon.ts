import { IconComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createIconStyle = variantProvider.createVariantFactory<IconComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Icon')

export const AppIconStyles = {
  ...defaultStyles,
}
