import { RadioInputComposition } from '@codeleap/common'
import { WebRadioInputStyles } from '@codeleap/web'
import { variantProvider } from '../theme'

const createRadioInputStyle =
  variantProvider.createVariantFactory<RadioInputComposition>()
const defaultStyles = WebRadioInputStyles

export const AppRadioInputStyles = {
  ...defaultStyles,
  default: createRadioInputStyle((theme) => ({
    ...defaultStyles.default(theme),
    button: {
      ...defaultStyles.default(theme).button,
      ...theme.border.primary(1),
    },
  })),
}
