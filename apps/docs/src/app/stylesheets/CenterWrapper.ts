import { CenterWrapperComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createCenterWrapperStyle =
  variantProvider.createVariantFactory<CenterWrapperComposition>()
const defaultStyles = variantProvider.getDefaultVariants('CenterWrapper')

export const AppCenterWrapperStyles = {
  ...defaultStyles,
  default: createCenterWrapperStyle((theme) => ({
    ...defaultStyles.default(theme),
    wrapper: {
      ...defaultStyles.default(theme).wrapper,
    },
  })),
  noCenter: createCenterWrapperStyle((theme) => ({

  })),
}
