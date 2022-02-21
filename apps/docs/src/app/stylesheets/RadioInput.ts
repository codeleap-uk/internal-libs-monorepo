import { RadioInputComposition, RadioInputStyles } from '@codeleap/common'
import { variantProvider } from '../theme'

const createRadioInputStyle =
  variantProvider.createVariantFactory<RadioInputComposition>()
const defaultStyles = RadioInputStyles

export const AppRadioInputStyles = {
  ...defaultStyles,
  default: createRadioInputStyle((theme) => ({
    ...defaultStyles.default(theme),
  })),
}
