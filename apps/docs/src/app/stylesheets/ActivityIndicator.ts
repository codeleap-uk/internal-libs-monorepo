import { ActivityIndicatorComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createActivityIndicatorStyle =
  variantProvider.createVariantFactory<ActivityIndicatorComposition>()
const defaultStyles = variantProvider.getDefaultVariants('ActivityIndicator')

export const AppActivityIndicatorStyles = {
  ...defaultStyles,
  default: createActivityIndicatorStyle((theme) => ({
    ...defaultStyles.default,
    wrapper: {
      ...defaultStyles.default.wrapper,
      color: theme.colors.primary,
    },
  })),
  small: createActivityIndicatorStyle((theme) => ({
    wrapper: {
      height: theme.values.buttons.small.height,
    },
  })),
  large: createActivityIndicatorStyle((theme) => ({
    wrapper: {
      height: theme.values.buttons.large.height,
    },
  })),
}
