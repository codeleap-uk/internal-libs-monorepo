import { IconComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createIconStyle = variantProvider.createVariantFactory<IconComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Icon')

export const AppIconStyles = {
  ...defaultStyles,
  default: createIconStyle((theme) => ({
    ...defaultStyles.default,
    icon: {
      ...defaultStyles.default.icon,
      color: theme.typography.color,
    },
  })),

  large: createIconStyle((theme) => ({
    ...defaultStyles.default,
    icon: {
      ...defaultStyles.default.icon,
      ...theme.sized(10),
    },
  })),
}
