import { TextInputComposition } from '@codeleap/common'
import { variantProvider } from '../theme'
import { assignTextStyle } from '@codeleap/common'

const createTextInputStyle =
  variantProvider.createVariantFactory<TextInputComposition>()
const defaultStyles = variantProvider.getDefaultVariants('TextInput')

export const AppTextInputStyles = {
  ...defaultStyles,
  default: createTextInputStyle((theme) => ({
    ...defaultStyles.default,
    innerWrapper: {
      ...defaultStyles.default.innerWrapper,
      height: theme.values.buttons.default.height,
      borderRadius: theme.borderRadius.medium,
    },
    textField: {
      ...defaultStyles.default.textField,
      // backgroundColor: 'red',
    },
    icon: {
      ...defaultStyles.default.icon,
      // size: theme.values.buttons.default.height * 0.5, // NOTE if this is needed maybe it should be another variant because it breaks the input icons
    },
    // wrapper: {
    // },
  })),
}
