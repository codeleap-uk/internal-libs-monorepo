import { ViewComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createViewStyle = variantProvider.createVariantFactory<ViewComposition>()
const defaultStyles = variantProvider.getDefaultVariants('View')

export const AppViewStyles = {
  ...defaultStyles,
  default: createViewStyle((theme) => ({
    ...defaultStyles.default,
    wrapper: {
      ...defaultStyles.default(theme).wrapper,
      display: 'flex',
      flexDirection: 'row',
    },
  })),

  separator: createViewStyle((theme) => ({
    ...defaultStyles.default(theme),
    wrapper: {
      ...defaultStyles.default(theme).wrapper,
      ...theme.border.border({
        width: 2,
        directions: ['top'],
      }),
    },
  })),

}
