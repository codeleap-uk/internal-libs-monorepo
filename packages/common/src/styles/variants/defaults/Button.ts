import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ButtonComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'leftIcon' | 'rightIcon' | 'loader';

const createButtonStyle = createDefaultVariantFactory<ButtonComposition>()

const presets = includePresets((styles) => createButtonStyle(() => ({ wrapper: styles })))

export const ButtonStyles = {
  ...presets,
  default: createButtonStyle((theme) => ({
    wrapper: {
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      display: 'flex',
      ...theme.presets.alignCenter,
      ...theme.spacing.padding(1),
    },
    text: {
      flex: 1,
      textAlign: 'center',
    },
    loader: {
      ...theme.spacing.marginRight(1),
    },
    leftIcon: {
      ...theme.spacing.marginRight(1),
    },
    rightIcon: {
      ...theme.spacing.marginRight(1),
    },
  })),
  circle: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
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
      ...theme.spacing.padding(0),
    },
    text: {
      flex: 1,
      textAlign: 'center',
    },
    loader: {
      ...theme.spacing.margin(0),
    },
    icon: {
      ...theme.spacing.margin(0),
    },
    leftIcon: {
      ...theme.spacing.marginRight(0),
    },
    rightIcon: {
      ...theme.spacing.marginRight(0),
    },
  })),
}
