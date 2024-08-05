import { ActionIconComposition } from '@codeleap/web'
import { createStyles } from '@codeleap/styles'
import { StyleRegistry } from '../styles'

const createActionIconVariant = createStyles<ActionIconComposition>

export const ActionIconStyles = {
  default: createActionIconVariant((theme) => ({
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
    },
  })),
  small: createActionIconVariant((theme) => ({
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
  large: createActionIconVariant((theme) => ({
    touchableWrapper: {
      width: theme.values.itemHeight.default,
      height: theme.values.itemHeight.default,
    },
  })),
  'iconSize:1': createActionIconVariant((theme) => ({
    icon: {
      width: theme.values.iconSize[1],
      height: theme.values.iconSize[1],
    },
  })),
  'iconSize:2': createActionIconVariant((theme) => ({
    icon: {
      width: theme.values.iconSize[2],
      height: theme.values.iconSize[2],
    },
  })),
  'iconSize:3': createActionIconVariant((theme) => ({
    icon: {
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    },
  })),
  floating: createActionIconVariant((theme) => ({
    touchableWrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
  outline: createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral10,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ width: theme.values.borderWidth.small, color: theme.colors.neutral5 }),
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    'touchableWrapper:disabled': {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ width: theme.values.borderWidth.small, color: theme.colors.neutral2 }),
    },
  })),
  'primary:outline': createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.primary3,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ width: theme.values.borderWidth.small, color: theme.colors.primary3 }),
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    'touchableWrapper:disabled': {
      backgroundColor: theme.colors.neutral3,
      ...theme.border({ width: theme.values.borderWidth.small, color: theme.colors.primary3 }),
    },
  })),
  minimal: createActionIconVariant((theme) => ({
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
  destructive: createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral1,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.destructive2,
    },
  })),
  'destructive:outline': createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.destructive2,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ width: theme.values.borderWidth.small, color: theme.colors.destructive2 }),
    },
  })),
  'destructive:minimal': createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.destructive2,
    },
    touchableWrapper: {
      backgroundColor: theme.colors.neutral1,
      ...theme.border({ width: theme.values.borderWidth.small, color: theme.colors.neutral5 }),
    },
  })),
  selected: createActionIconVariant((theme) => ({
    touchableWrapper: {
      backgroundColor: theme.colors.neutral2,
    },
  })),
  neutral1: createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral1,
    },
  })),
  originalColor: createActionIconVariant((theme) => ({
    icon: {
      color: 'unset',
    },
  })),
  primary3: createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.primary3,
    },
  })),
  destructive2: createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.destructive2,
    },
  })),
  positive2: createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.positive2,
    },
  })),
  neutral10: createActionIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral10,
    },
  })),
  normalize: createActionIconVariant((theme) => ({
    'touchableWrapper': {
      width: 'unset',
      height: 'unset',
      borderRadius: 'unset',
      ...theme.presets.center,
      backgroundColor: 'unset',
      padding: theme.spacing.value(0),
    },
  })),
}

StyleRegistry.registerVariants('ActionIcon', ActionIconStyles)
