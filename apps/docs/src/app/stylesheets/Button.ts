import { ButtonComposition, getActivityIndicatorBaseStyles } from '@codeleap/common'
import { Theme } from '..'
import { variantProvider } from '../theme'

const defaultStyle = variantProvider.getDefaultVariants('Button')
const createButtonVariant =
  variantProvider.createVariantFactory<ButtonComposition>()

const defaultVariant = createButtonVariant((theme) => {

  const loaderStyle = getActivityIndicatorBaseStyles(theme.values.buttons.default.height * 0.6)
  return {
    ...defaultStyle.default(theme),
    ...defaultStyle.pill(theme),
    wrapper: {
      ...defaultStyle.default(theme).wrapper,
      ...defaultStyle.pill(theme).wrapper,
      height: theme.values.buttons.default.height,
      justifyContent: 'center',
    },
    icon: {
      ...defaultStyle.default(theme).icon,
      color: theme.colors.white,
      size: 22,

    },
    loaderWrapper: {
      ...loaderStyle.wrapper,
    },
    loaderCircle: {
      ...loaderStyle.circle,
    },
    loaderFrontCircle: {
      ...defaultStyle.default(theme).loaderFrontCircle,
      ...loaderStyle.frontCircle,
      borderTopColor: theme.colors.white,
    },
    loaderBackCircle: {
      ...defaultStyle.default(theme).loaderBackCircle,
      ...loaderStyle.backCircle,
      borderColor: theme.colors.white,
    },
    text: {
      ...defaultStyle.default(theme).text,
      color: theme.colors.white,
    },
  }
})

export const AppButtonStyle = {
  ...defaultStyle,
  default: defaultVariant,
  neutral: createButtonVariant((theme) => ({
    ...defaultVariant(theme),
    wrapper: {
      ...defaultVariant(theme).wrapper,
      backgroundColor: theme.colors.neutral,
    },
  })),
  text: createButtonVariant((theme) => ({
    ...defaultStyle.default(theme),
    wrapper: {
      ...defaultStyle.default(theme).wrapper,

      backgroundColor: 'rgba(0,0,0,0)',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0)',
      },
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
      ...defaultVariant(theme).icon,
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
    ...defaultVariant(theme),
    wrapper: {
      ...defaultVariant(theme).wrapper,
      height: 'auto',
      ...theme.spacing.padding(1),
      backgroundColor: 'transparent',
      ...theme.presets.alignCenter,
      borderRadius: 0,
      width: '100%',
      '&:hover': {
        backgroundColor: theme.colors.grayFade,

      },
    },
    text: {
      ...defaultVariant(theme).text,
      color: theme.colors.textH,
      textAlign: 'center',
    },
    icon: {
      ...defaultVariant(theme).icon,
      size: 16,
      color: theme.colors.icon,
    },
  })),
  noHover: createButtonVariant((theme) => ({

    wrapper: {

      '&:hover': {
        backgroundColor: 'transparent',

      },
    },
  })),
  'text:negative': createButtonVariant((theme) => ({
    icon: {
      color: theme.colors.negative,
    },
    text: {
      color: theme.colors.negative,

    },
  })),
  icon: createButtonVariant((theme) => ({
    ...defaultStyle.icon(theme),
    wrapper: {
      ...defaultStyle.icon(theme).wrapper,
      width: 'auto',
    },
    icon: {
      ...defaultStyle.icon(theme).icon,
      color: theme.colors.textH,
      '&:hover': {
        color: theme.colors.primary,
      },
    },

  })),
  'list:selected': createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.primary,
      '&:hover': {
        backgroundColor: theme.colors.primary,

      },
    },
    text: {
      color: theme.colors.white,
    },
  })),
  outline: createButtonVariant((theme) => ({
    ...defaultVariant(theme),
    wrapper: {
      ...defaultVariant(theme).wrapper,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      ...theme.border.primary(1),
    },
    text: {
      ...defaultVariant(theme).text,
      color: theme.colors.primary,

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
      height: 'auto',
      minHeight: theme.values.buttons.small.height,
    },
  })),
  large: createButtonVariant((theme) => ({
    wrapper: {
      height: theme.values.buttons.large.height,
    },
  })),
  link: createButtonVariant((theme) => ({
    wrapper: {
      padding: 0,
      height: 'auto',
    },
    text: {
      color: theme.colors.textH,
      textDecoration: 'underline',
      '&:hover': {
        color: theme.colors.primary,
      },
    },
  })),
  categoryButton: createButtonVariant((theme) => ({
    // ...defaultVariant(theme),
    wrapper: {
      // ...defaultVariant(theme).wrapper,
      backgroundColor: 'transparent',
      transition: 'background-color 0.2s ease',
      borderRadius: 0,
      ...theme.presets.alignSelfStretch,
      '&:hover': {
        backgroundColor: Theme.colors[theme.theme == 'light' ? 'dark' : 'light'].background + '22',
      },
    },
    text: {
      ...defaultVariant(theme).text,
      color: theme.colors.textH,
      textTransform: 'capitalize',

    },
    rightIcon: {
      ...defaultVariant(theme).rightIcon,
      color: theme.colors.textH,
      transition: 'transform 0.2s ease',
    },
  })),
  'icon:small': createButtonVariant(() => ({
    icon: {
      size: '16px',
    },
  })),
}
