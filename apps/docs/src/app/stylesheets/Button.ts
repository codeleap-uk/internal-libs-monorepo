import { ButtonComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const defaultStyle = variantProvider.getDefaultVariants('Button')
const createButtonVariant =
  variantProvider.createVariantFactory<ButtonComposition>()

const defaultVariant = createButtonVariant((theme) => ({
  ...defaultStyle.default(theme),
  ...defaultStyle.pill,
  wrapper: {
    ...defaultStyle.default(theme).wrapper,
    ...defaultStyle.pill.wrapper,
    height: theme.values.buttons.default.height,
  },
  icon: {
    ...defaultStyle.default(theme).icon,
    color: theme.colors.text,
    size: 30,
  },
  loader: {
    ...defaultStyle.default(theme).loader,
    color: theme.colors.text,
  },
  text: {
    ...defaultStyle.default(theme).text,
    color: theme.colors.text,
  },
}))

export const AppButtonStyle = {
  ...defaultStyle,
  default: defaultVariant,
  neutral: createButtonVariant((theme) => ({
    ...defaultVariant,
    wrapper: {
      ...defaultVariant.wrapper,
      backgroundColor: theme.colors.gray,
    },
  })),
  text: createButtonVariant((theme) => ({
    ...defaultStyle.default(theme),
    wrapper: {
      ...defaultStyle.default(theme).wrapper,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    text: {
      color: theme.typography.pColor,
    },
  })),
  'icon:black': createButtonVariant((theme) => ({
    ...defaultStyle.icon,
    icon: {
      color: theme.colors.black,
    },
  })),
  'icon:white': createButtonVariant((theme) => ({
    ...defaultStyle.icon,
    icon: {
      color: theme.colors.white,
    },
  })),
  'icon:primary': createButtonVariant((theme) => ({

    ...defaultVariant,
    ...defaultStyle.icon,
    icon: {
      ...defaultVariant.icon,
      color: theme.colors.primary,
    },
  })),
  'icon:navBar': createButtonVariant((theme) => ({
    ...defaultStyle.icon,
    icon: {
      color: theme.colors.primary,
      // color: theme.typography.pColor,
      size: 25,
    },
  })),
  list: createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.background,
      borderRadius: 0,
      borderBottomWidth: theme.values.pixel,
      borderBottomColor: theme.colors.borders,
    },
    text: {
      ...defaultStyle.default(theme).text,
      color: theme.typography.hColor,
      textAlign: 'left',
    },
  })),
  outline: createButtonVariant((theme) => ({
  })),
  'list:first': createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.background,
      borderRadius: 0,
      borderTopWidth: theme.values.pixel,
      borderTopColor: theme.colors.borders,
    },
  })),
  'list:selected': createButtonVariant((theme) => ({
    wrapper: {
      ...defaultStyle.default(theme).wrapper,
      backgroundColor: theme.colors.primary,
    },
    text: {
      color: theme.colors.white,
    },
  })),
  gray: createButtonVariant((theme) => ({
    wrapper: {
      ...defaultStyle.default(theme).wrapper,
      backgroundColor: theme.colors.gray,
    },
    text: {
      ...defaultStyle.default(theme).text,
      color: theme.colors.white,
    },
    icon: {
      ...defaultStyle.default(theme).icon,
      color: theme.colors.white,
      width: 24,
      height: 24,
    },
  })),
  positive: createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.positive,
    },
  })),
  small: createButtonVariant((theme) => ({
    wrapper: {
      height: theme.values.buttons.small.height,
    },
  })),
  large: createButtonVariant((theme) => ({
    wrapper: {
      height: theme.values.buttons.large.height,
    },
  })),
}
