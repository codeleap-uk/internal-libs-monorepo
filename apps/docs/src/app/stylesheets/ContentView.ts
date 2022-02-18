import { ContentViewComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createContentViewStyle =
  variantProvider.createVariantFactory<ContentViewComposition>()
const defaultStyles = variantProvider.getDefaultVariants('ContentView')

export const AppContentViewStyles = {
  ...defaultStyles,
  default: createContentViewStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
