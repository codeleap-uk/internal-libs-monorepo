import { TextComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createTextStyle = variantProvider.createVariantFactory<TextComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Text')

export const AppTextStyles = {
  ...defaultStyles,
  default: createTextStyle((theme) => ({
    ...defaultStyles.default(theme),
    text: {
      ...defaultStyles.default(theme).text,

      textDecoration: 'none',
    },
  })),
  white: createTextStyle((theme) => ({
    ...defaultStyles.default(theme),
    text: {
      ...defaultStyles.default(theme).text,

      color: theme.colors.white,
    },
  })),
  primary: createTextStyle((theme) => ({
    text: {
      color: theme.colors.primary,
    },
  })),
  listItem: createTextStyle((theme) => ({
    ...defaultStyles.default,
    text: {
      ...theme.spacing.padding(0.3),
      whiteSpace: 'nowrap',
    },
  })),
  bold: createTextStyle((theme) => ({
    text: {
      fontWeight: 'bold',
    },
  })),
  semiBold: createTextStyle((theme) => ({
    text: {
      fontWeight: '500',
    },
  })),
  thin: createTextStyle((theme) => ({
    text: {
      fontWeight: '300',
    },
  })),
  link: createTextStyle((theme) => ({
    ...defaultStyles.default(theme),
    text: {
      ...defaultStyles.default(theme).text,
      color: theme.colors.white,
      textDecoration: 'none',
    },
  })),

}
