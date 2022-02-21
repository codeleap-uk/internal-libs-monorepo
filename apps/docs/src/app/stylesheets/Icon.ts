import { IconComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createIconStyle = variantProvider.createVariantFactory<IconComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Icon')


export const AppIconStyles = {
  ...defaultStyles,
  default: createIconStyle((theme) => ({
    ...defaultStyles.default,
    icon: {
      ...defaultStyles.default(theme).icon,
    },
  })),

  large: createIconStyle((theme) => ({
    ...defaultStyles.default,
    icon: {
      ...defaultStyles.default(theme).icon,
      ...theme.sized(10),
    },
  })),
}
