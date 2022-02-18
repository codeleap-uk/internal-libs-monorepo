import { RadioInputComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createRadioInputStyle =
  variantProvider.createVariantFactory<RadioInputComposition>()
const defaultStyles = variantProvider.getDefaultVariants('RadioInput')

export const AppRadioInputStyles = {
  ...defaultStyles,
  default: createRadioInputStyle((theme) => ({
    ...defaultStyles.default,
  })),
}
