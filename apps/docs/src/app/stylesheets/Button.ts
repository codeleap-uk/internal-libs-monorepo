import { createStyles } from '@codeleap/styles'
import { ButtonComposition } from '@codeleap/web'
import { StyleRegistry } from '../styles'

const createButtonVariant = createStyles<ButtonComposition>

export const ButtonStyles = {
  default: createButtonVariant((theme) => ({
    wrapper: {
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      ...theme.presets.row,
      ...theme.presets.relative,
      backgroundColor: theme.colors.primary3,
      borderRadius: theme.borderRadius.small,
      transitionProperty: 'background, color, border, filter',
      transitionDuration: '0.2s',
      ...theme.presets.alignCenter,
      ...theme.presets.justifyCenter,
      width: 'auto',

      '&:hover': {
        backgroundColor: theme.colors.primary4,
      },
      ...theme.spacing.padding(1),
      ...theme.spacing.paddingHorizontal(2),
    },
    text: {
      textAlign: 'center',
      color: theme.colors.neutral10,
    },
    'text:disabled': {
      color: theme.colors.neutral5,
    },
    'loaderWrapper': {
      height: theme.values.iconSize[4],
      width: theme.values.iconSize[4],
    },
    icon: {
      color: theme.colors.neutral10,
      width: theme.values.iconSize[1],
      height: theme.values.iconSize[1],
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    leftIcon: {
      ...theme.spacing.marginRight('auto'),
    },
    rightIcon: {
      ...theme.spacing.marginLeft('auto'),
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral2,

      cursor: 'not-allowed',

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
      },
    },
  })),
  large: createButtonVariant((theme) => ({
    wrapper: {
      height: theme.values.itemHeight.default,
    },
    text: {
      fontWeight: '500',
    },
    'loaderWrapper': {
      width: theme.values.iconSize[5],
      height: theme.values.iconSize[5],
    },
    icon: {
      width: theme.values.iconSize[2],
      height: theme.values.iconSize[2],
    },
    leftIcon: {
      ...theme.spacing.marginRight(1),
    },
    rightIcon: {
      ...theme.spacing.marginLeft(1),
    },
  })),
  small: createButtonVariant((theme) => ({
    wrapper: {
      height: theme.values.itemHeight.small,
      ...theme.spacing.paddingHorizontal(1),
    },
    text: {
      fontSize: theme.typography.base.styles.p3.size,
      fontWeight: '500',
    },
    loaderWrapper: {
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    },
    icon: {
      width: theme.values.iconSize[1],
      height: theme.values.iconSize[1],
    },
    leftIcon: {
      ...theme.spacing.marginLeft(1),
    },
    rightIcon: {
      ...theme.spacing.marginRight(1),
    },
  })),
  outline: createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ color: theme.colors.neutral5, width: theme.values.borderWidth.small }),

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border({ color: theme.colors.primary2, width: theme.values.borderWidth.small }),
      },
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ color: theme.colors.neutral2, width: theme.values.borderWidth.small }),

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
        ...theme.border({ color: theme.colors.neutral2, width: theme.values.borderWidth.small }),
      },
    },
    text: {
      color: theme.colors.neutral10,
    },
    'text:disabled': {
      color: theme.colors.neutral5,
    },
    icon: {
      color: theme.colors.neutral10,
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    loaderWrapper: {
      color: theme.colors.neutral10,
    },
    'loaderWrapper:disabled': {
      color: theme.colors.neutral5,
    },
  })),
  'primary:outline': createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ color: theme.colors.primary3, width: theme.values.borderWidth.small }),

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
        ...theme.border({ color: theme.colors.primary4, width: theme.values.borderWidth.small }),
      },
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral2,
      ...theme.border({ color: theme.colors.neutral2, width: theme.values.borderWidth.small }),

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border({ color: theme.colors.neutral2, width: theme.values.borderWidth.small }),
      },
    },
    text: {
      color: theme.colors.primary3,
    },
    icon: {
      color: theme.colors.primary3,
    },
    loaderWrapper: {
      color: theme.colors.primary3,
    },
  })),
  minimal: createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
      },
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral1,

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
      },
    },
    text: {
      color: theme.colors.primary3,
    },
    'text:disabled': {
      color: theme.colors.neutral5,
    },
    icon: {
      color: theme.colors.primary3,
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    loaderWrapper: {
      color: theme.colors.primary3,
    },
    'loaderWrapper:disabled': {
      color: theme.colors.neutral5,
    },
  })),
  destructive: createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.destructive2,

      '&:hover': {
        backgroundColor: theme.colors.destructive2,
        filter: 'brightness(90%)',
      },
    },
    text: {
      color: theme.colors.neutral1,
    },
    icon: {
      color: theme.colors.neutral1,
    },
    loaderWrapper: {
      color: theme.colors.neutral1,
    },
  })),
  cancel: createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.destructive2,

      '&:hover': {
        backgroundColor: theme.colors.destructive2,
        filter: 'brightness(90%)',
      },
    },
    text: {
      color: theme.colors.neutral1,
    },
    icon: {
      color: theme.colors.neutral1,
    },
    loaderWrapper: {
      color: theme.colors.neutral1,
    },
  })),
  'destructive:outline': createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ color: theme.colors.neutral5, width: theme.values.borderWidth.small }),

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border({ color: theme.colors.neutral5, width: theme.values.borderWidth.small }),
      },
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ color: theme.colors.neutral2, width: theme.values.borderWidth.small }),
    },
    text: {
      color: theme.colors.destructive2,
    },
    icon: {
      color: theme.colors.destructive2,
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    loaderWrapper: {
      backgroundColor: theme.colors.destructive2,
    },
  })),
  'destructive:minimal': createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
      },
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral1,
    },
    text: {
      color: theme.colors.destructive2,
    },
    icon: {
      color: theme.colors.destructive2,
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    loaderWrapper: {
      color: theme.colors.destructive2,
    },
  })),
  link: createButtonVariant((theme) => ({
    'wrapper': {
      textDecoration: 'none',
      color: theme.colors.neutral10,
    },
    text: {
      textDecoration: 'none',
      color: theme.colors.neutral10,
    },
  })),
  'link:outline': createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ color: theme.colors.primary3, width: theme.values.borderWidth.small }),
      color: theme.colors.primary3,

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
        ...theme.border({ color: theme.colors.primary4, width: theme.values.borderWidth.small }),
      },
    },
    text: {
      color: theme.colors.primary3,
    },
  })),
  noPadding: createButtonVariant((theme) => ({
    wrapper: {
      ...theme.spacing.padding(0),
    },
  })),
  pill: createButtonVariant((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.medium,
      ...theme.spacing.paddingHorizontal(1),
      ...theme.spacing.paddingVertical(0.5),
    },
  })),
  normal: createButtonVariant((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.small,
      ...theme.spacing.paddingHorizontal(1),
      ...theme.spacing.paddingVertical(0.5),
    },
  })),
  centerLeftIcon: createButtonVariant((theme) => ({
    wrapper: {
      ...theme.presets.center,
      ...theme.presets.fullWidth,
    },
    leftIcon: {
      marginRight: 0,
    },
    rightIcon: {
      display: 'none',
    },
    text: {
      ...theme.spacing.marginLeft(1),
    },
  })),
  centerRightIcon: createButtonVariant((theme) => ({
    wrapper: {
      ...theme.presets.center,
      ...theme.presets.fullWidth,
    },
    rightIcon: {
      marginLeft: 0,
    },
    leftIcon: {
      display: 'none',
    },
    text: {
      ...theme.spacing.marginRight(1),
    },
  })),
}

StyleRegistry.registerVariants('Button', ButtonStyles)
