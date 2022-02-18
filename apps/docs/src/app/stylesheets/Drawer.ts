import { DrawerComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createDrawerStyle =
  variantProvider.createVariantFactory<DrawerComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Drawer')

export const AppDrawerStyles = {
  ...defaultStyles,
  default: createDrawerStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
