import { ViewComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createViewStyle = variantProvider.createVariantFactory<ViewComposition>()
const defaultStyles = variantProvider.getDefaultVariants('View')

export const AppViewStyles = {
  ...defaultStyles,
  default: createViewStyle((theme) => ({
    ...defaultStyles.default,
    wrapper: {
      ...defaultStyles.default.wrapper,
      display: 'flex',
      flexDirection: 'row',
    },
  })),

}
