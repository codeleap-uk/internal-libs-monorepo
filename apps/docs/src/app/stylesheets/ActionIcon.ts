import { ActionIconComposition, ActionIconPresets } from '@codeleap/web'
import { variantProvider } from '..'

const createActionIconStyle = variantProvider.createVariantFactory<ActionIconComposition>()

export const AppActionIconStyles = {
  ...ActionIconPresets,
  default: createActionIconStyle((theme) => ({
    icon: {
      width: theme.values.iconSize[2],
      height: theme.values.iconSize[2],
      color: theme.colors.neutral1,
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    'touchableWrapper': {
      width: theme.values.itemHeight.small,
      height: theme.values.itemHeight.small,
      borderRadius: theme.borderRadius.small,
      ...theme.presets.center,
      backgroundColor: theme.colors.primary3,
    },
    'touchableWrapper:pressable': {
      cursor: 'pointer',
    },
    'touchableWrapper:disabled': {
      cursor: 'not-allowed',
      backgroundColor: theme.colors.neutral2,
    }
  })),
  small: createActionIconStyle((theme) => ({
    touchableWrapper: {
      width: theme.values.itemHeight.small,
      height: theme.values.itemHeight.small,
      ...theme.spacing.padding(theme.values.borderWidth.small),
      borderRadius: theme.borderRadius.small,
    },
    icon: {
      width: theme.values.iconSize[1],
      height: theme.values.iconSize[1],
    },
  })),
  large: createActionIconStyle((theme) => ({
    touchableWrapper: {
      width: theme.values.itemHeight.default,
      height: theme.values.itemHeight.default,
    },
  })),
  'iconSize:1': createActionIconStyle((theme) => ({
    icon: {
      width: theme.values.iconSize[1],
      height: theme.values.iconSize[1],
    },
  })),
  'iconSize:2': createActionIconStyle((theme) => ({
    icon: {
      width: theme.values.iconSize[2],
      height: theme.values.iconSize[2],
    },
  })),
  'iconSize:3': createActionIconStyle((theme) => ({
    icon: {
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    },
  })),
  floating: createActionIconStyle((theme) => ({
    touchableWrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
  outline: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.neutral10,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.neutral5(theme.values.borderWidth.small),
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    'touchableWrapper:disabled': {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.neutral2(theme.values.borderWidth.small),
    },
  })),
  'primary:outline': createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.primary3,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.primary3(theme.values.borderWidth.small),
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    'touchableWrapper:disabled': {
      backgroundColor: theme.colors.neutral3,
      ...theme.border.primary3(theme.values.borderWidth.small),
    },
  })),
  minimal: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.primary3,
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    touchableWrapper: {
      backgroundColor: 'transparent',
      ...theme.spacing.padding(0),
    },
    'touchableWrapper:disabled': {
      backgroundColor: 'transparent',
    },
  })),
  destructive: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.neutral1,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.destructive2,
    },
  })),
  'destructive:outline': createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.destructive2,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.destructive2(theme.values.borderWidth.small),
    },
  })),
  'destructive:minimal': createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.destructive2,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border.neutral5(theme.values.borderWidth.small),
    },
  })),
  selected: createActionIconStyle((theme) => ({
    touchableWrapper: {
      backgroundColor: theme.colors.neutral2,
    },
  })),
  neutral1: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.neutral1,
    },
  })),
  originalColor: createActionIconStyle((theme) => ({
    icon: {
      color: 'unset'
    }
  })),
  primary3: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.primary3,
    },
  })),
  destructive2: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.destructive2,
    },
  })),
  positive2: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.positive2,
    },
  })),
  neutral10: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.neutral10,
    },
  })),
}
