import { mapVariants } from '@codeleap/common'
import { WebCheckboxComposition, WebCheckboxStyles } from '@codeleap/web'
import { variantProvider } from '../theme'

const defaultStyle = WebCheckboxStyles

const createCheckboxVariant =
  variantProvider.createVariantFactory<WebCheckboxComposition>()

export const AppCheckboxStyle = {
  ...defaultStyle,
}
