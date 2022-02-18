import { SwitchComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createSwitchStyle =
  variantProvider.createVariantFactory<SwitchComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Switch')

export const AppSwitchStyles = {
  ...defaultStyles,
  default: createSwitchStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
