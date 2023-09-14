import { variantProvider } from '../theme'
import { ButtonComposition, ButtonPresets } from '@codeleap/web'
import { shadeColor } from '@codeleap/common'

const createButtonStyle = variantProvider.createVariantFactory<ButtonComposition>()

export const AppButtonStyles = {
  ...ButtonPresets,
  default: createButtonStyle((theme) => ({
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
      // '&:active': {
      //   backgroundColor: theme.colors.primary3,
      // },
      ...theme.spacing.padding(1),
      ...theme.spacing.paddingHorizontal(2)

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
      '&:active': {
        backgroundColor: theme.colors.neutral2,
      },
    },
  })),
  large: createButtonStyle((theme) => ({
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
  small: createButtonStyle((theme) => ({
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
  floating: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
  outline: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.neutral5(theme.values.borderWidth.small),

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border.primary2(theme.values.borderWidth.small),
      },
      '&:active': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border.primary4(theme.values.borderWidth.small),
      },
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.neutral2(theme.values.borderWidth.small),

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
      },
      '&:active': {
        backgroundColor: theme.colors.neutral1,
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
  'primary:outline': createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.primary3(theme.values.borderWidth.small),

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
        ...theme.border.primary4(theme.values.borderWidth.small),
      },
      '&:active': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border.primary4(theme.values.borderWidth.small),
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
  minimal: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
      },
      '&:active': {
        backgroundColor: theme.colors.neutral2,
      },
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral1,

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
      },
      '&:active': {
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
  destructive: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.destructive2,

      '&:hover': {
        backgroundColor: theme.colors.destructive2,
        filter: 'brightness(90%)'
      },
      '&:active': {
        backgroundColor: theme.colors.destructive2,
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
  'destructive:outline': createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.neutral5(theme.values.borderWidth.small),

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border.neutral5(theme.values.borderWidth.small),
      },
      '&:active': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border.neutral5(theme.values.borderWidth.small),
      },
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.neutral2(theme.values.borderWidth.small),
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
  'destructive:minimal': createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
      },
      '&:active': {
        backgroundColor: theme.colors.neutral2,
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
  destructive2: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.destructive2,

      '&:hover': {
        backgroundColor: shadeColor(theme.colors.destructive2, -30),
      },
    },
  })),
  list: createButtonStyle((theme) => ({
    wrapper: {
      height: theme.values.itemHeight.default,
      backgroundColor: theme.colors.neutral2,
      borderRadius: 0,
      borderTopStyle: 'solid',
      borderTopWidth: theme.values.borderWidth.small,
      borderTopColor: theme.colors.neutral3,
      ...theme.presets.justifyStart,

      '&:hover': {
        backgroundColor: theme.colors.neutral3,
      },
      '&:active': {
        backgroundColor: theme.colors.neutral3,
      },

      '&:first-of-type': {
        borderTopLeftRadius: theme.borderRadius.small,
        borderTopRightRadius: theme.borderRadius.small,
      },
      '&:last-of-type': {
        borderBottomLeftRadius: theme.borderRadius.small,
        borderBottomRightRadius: theme.borderRadius.small,
        borderBottomWidth: 0,
      },
    },
    text: {
      fontWeight: '500',
      ...theme.spacing.marginLeft(1),
      color: theme.colors.neutral10,
      textAlign: 'left',
    },
    loaderWrapper: {
      width: theme.values.iconSize[5],
      height: theme.values.iconSize[5],
    },
    icon: {
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    },
    leftIcon: {
      ...theme.spacing.marginLeft(1),
      marginRight: 0,
    },
    rightIcon: {
      ...theme.spacing.marginRight(1),
    },
  })),
  'list:first': createButtonStyle((theme) => ({
    wrapper: {
      borderTopWidth: 0,
      borderTopRightRadius: theme.borderRadius.small,
      borderTopLeftRadius: theme.borderRadius.small,
    },
  })),
  'list:last': createButtonStyle((theme) => ({
    wrapper: {
      borderBottomRightRadius: theme.borderRadius.small,
      borderBottomLeftRadius: theme.borderRadius.small,
    },
  })),
  'list:selected': createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.primary3,

      '&:hover': {
        backgroundColor: theme.colors.primary2,
      },
      '&:active': {
        backgroundColor: theme.colors.primary4,
      },
    },
    text: {
      color: theme.colors.neutral1,
    },
  })),
  noPadding: createButtonStyle((theme) => ({
    wrapper: {
      ...theme.spacing.padding(0),
    },
  })),
  'text:capitalize': createButtonStyle((theme) => ({
    text: {
      textTransform: 'capitalize',
    },
  })),

  // Old variants
  circle: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.rounded,
      ...theme.spacing.padding(1),
    },
  })),
  pill: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.medium,
      ...theme.spacing.paddingHorizontal(1),
      ...theme.spacing.paddingVertical(0.5),
    },
  })),
  icon: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: 'transparent',
      aspectRatio: 1,
      display: 'flex',
      ...theme.presets.center,
      ...theme.spacing.padding(0),
    },
    text: {
      flex: 1,
      textAlign: 'center',
    },
    loaderWrapper: {
      ...theme.spacing.margin(0),
    },
    icon: {
      ...theme.spacing.margin(0),
      ...theme.presets.center,
      height: null,
      width: null,
      color: theme.colors.neutral1,
    },
    leftIcon: {
      ...theme.spacing.marginRight(0),
    },
    rightIcon: {
      ...theme.spacing.marginRight(0),
    },
  })),
  neutral9: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral9,
    },
    text: {
      color: theme.colors.neutral1,
    },
    icon: {
      color: theme.colors.neutral1,
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    },
  })),
  neutral10: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral10,

      '&:hover': {
        backgroundColor: theme.colors.neutral9,
      },
    },
  })),
  'text:neutral8': createButtonStyle((theme) => ({
    text: {
      color: theme.colors.neutral8,
    },
  })),
  'icon:neutral8': createButtonStyle((theme) => ({
    icon: {
      color: theme.colors.neutral8,
    },
  })),
  'text:destructive2': createButtonStyle((theme) => ({
    text: {
      color: theme.colors.destructive2,
    },
  })),
  'icon:destructive2': createButtonStyle((theme) => ({
    icon: {
      color: theme.colors.destructive2,
    },
  })),
  'text:primary': createButtonStyle((theme) => ({
    text: {
      color: theme.colors.primary3,
    },
  })),
  positive2: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.positive2,
    },
  })),
  select: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral2,
      ...theme.presets.justifySpaceBetween,

      '&:hover': {
        backgroundColor: theme.colors.neutral3,
      },

      '&:active': {
        backgroundColor: theme.colors.neutral3,
      },
    },
    icon: {
      size: theme.values.iconSize[2],
      color: theme.colors.neutral7,
    },
    leftIcon: {
      ...theme.spacing.marginRight(1),
    },
    rightIcon: {
      ...theme.spacing.marginLeft(1),
    },
  })),
  white: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
    },
  })),
  round: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
  hideText: createButtonStyle((theme) => ({
    text: {
      display: 'none',
    },
  })),
  link: createButtonStyle((theme) => ({
    'wrapper': {
      textDecoration: 'none',
      color: theme.colors.neutral10,
    },
    text: {
      textDecoration: 'none',
      color: theme.colors.neutral10,
    },
  })),
  'link:outline': createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.primary3(theme.values.borderWidth.small),
      color: theme.colors.primary3,
      
      '&:hover': {
        backgroundColor: theme.colors.neutral1,
        ...theme.border.primary4(theme.values.borderWidth.small),
      },
      '&:active': {
        backgroundColor: theme.colors.neutral2,
        ...theme.border.primary4(theme.values.borderWidth.small),
      },
    },
    text: {
      color: theme.colors.primary3,
    },
  })),
}
