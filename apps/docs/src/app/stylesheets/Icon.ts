import { IconComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createIconStyle = variantProvider.createVariantFactory<IconComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Icon')

export const AppIconStyles = {
  ...defaultStyles,
  default: createIconStyle((theme) => ({
    ...defaultStyles.default(theme),
    icon: {
      ...defaultStyles.default(theme).icon,
      flexShrink: 0,
    },
  })),
  large: createIconStyle(() => ({
    icon: {
      width: 50,
      height: 50,
    },
  })),
}
