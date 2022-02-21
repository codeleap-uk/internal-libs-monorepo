import { RouterPageComposition, RouterPageStyles } from '@codeleap/web'
import { variantProvider } from '../theme'

const createRouterPageStyle =
  variantProvider.createVariantFactory<RouterPageComposition>()
const defaultStyles = RouterPageStyles

export const AppRouterPageStyles = {
  ...defaultStyles,
}
