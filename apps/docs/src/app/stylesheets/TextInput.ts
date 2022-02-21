import { TextInputComposition } from '@codeleap/common'
import { variantProvider } from '../theme'


const createTextInputStyle =
  variantProvider.createVariantFactory<TextInputComposition>()
const defaultStyles = variantProvider.getDefaultVariants('TextInput')

export const AppTextInputStyles = {
  ...defaultStyles,
  default: createTextInputStyle((theme) => ({
    ...defaultStyles.default(theme),
    icon: {
      height: 10,
    },
  })),
}
