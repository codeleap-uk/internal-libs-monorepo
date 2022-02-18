import { mapVariants } from '@codeleap/common'
import { WebCheckboxComposition, WebCheckboxStyles } from '@codeleap/web'
import { variantProvider } from '../theme'

const defaultStyle = mapVariants(variantProvider.theme, WebCheckboxStyles)

const createCheckboxVariant =
  variantProvider.createVariantFactory<WebCheckboxComposition>()

export const AppCheckboxStyle = {
  ...defaultStyle,
  default: createCheckboxVariant((theme) => ({
    ...defaultStyle.default,
    wrapper: {
      ...defaultStyle.default.wrapper,
    },
  })),
}
