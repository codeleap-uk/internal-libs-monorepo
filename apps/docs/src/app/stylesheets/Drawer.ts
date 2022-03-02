import { DrawerComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createDrawerStyle =
  variantProvider.createVariantFactory<DrawerComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Drawer')

export const AppDrawerStyles = {
  ...defaultStyles,
  default: createDrawerStyle((theme) => ({
    ...defaultStyles.default(theme),
    box: {
      ...defaultStyles.default(theme).box,

      backgroundColor: theme.colors.background,
    },
    body: {
      ...defaultStyles.default(theme).body,
      ...theme.spacing.padding(0),
    },
  })),
}
