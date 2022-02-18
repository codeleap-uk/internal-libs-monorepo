import { assignTextStyle, mapVariants } from '@codeleap/common'
import { WebSelectComposition, WebSelectStyles } from '@codeleap/web'
import { variantProvider, Theme} from '../theme'

const createSelectStyle =
  variantProvider.createVariantFactory<WebSelectComposition>()
const defaultStyles = mapVariants(variantProvider.theme, WebSelectStyles)

export const AppSelectStyles = {
  ...defaultStyles,
  default: createSelectStyle({
    ...defaultStyles.default,
  }),
}
