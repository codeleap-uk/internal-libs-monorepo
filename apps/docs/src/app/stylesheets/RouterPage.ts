import { mapVariants } from '@codeleap/common'
import { RouterPageComposition, RouterPageStyles } from '@codeleap/web'
import { variantProvider } from '../theme'

const createRouterPageStyle =
  variantProvider.createVariantFactory<RouterPageComposition>()
const defaultStyles = mapVariants(variantProvider.theme, RouterPageStyles)

export const AppRouterPageStyles = {
  ...defaultStyles,
  default: createRouterPageStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
