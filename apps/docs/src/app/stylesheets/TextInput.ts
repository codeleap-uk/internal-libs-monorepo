import { TextInputComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createTextInputStyle =
  variantProvider.createVariantFactory<TextInputComposition>()
const defaultStyles = variantProvider.getDefaultVariants('TextInput')

const defaultVariant = createTextInputStyle((theme) => ({
  ...defaultStyles.default(theme),
  innerWrapper: {
    ...defaultStyles.default(theme).innerWrapper,
    borderRadius: theme.borderRadius.small,
  },
}))

export const AppTextInputStyles = {
  ...defaultStyles,
  default: defaultVariant,
}
