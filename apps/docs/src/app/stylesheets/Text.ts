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

    text: {

      color: theme.colors.white,
      '&:hover': {
        color: theme.colors.white,
      },
    },
  })),
  primary: createTextStyle((theme) => ({
    text: {
      color: theme.colors.primary,
    },
  })),
  code: createTextStyle((theme) => ({
    text: {
      color: theme.colors.inlineCode,
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

      '&:hover': {
        color: theme.colors.primary,
      },
    },
  })),
  underlined: createTextStyle((theme) => ({
    ...defaultStyles.default(theme),
    text: {
      textDecoration: 'underline',
      '&:hover': {
        color: theme.colors.primary,
      },
    },
  })),
  neutral: createTextStyle((theme) => ({

    text: {
      color: theme.colors.neutral,
    },
  })),
}
