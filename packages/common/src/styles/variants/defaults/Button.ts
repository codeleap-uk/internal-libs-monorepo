import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ButtonComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';

const createButtonStyle = createDefaultVariantFactory<ButtonComposition>()

const presets = includePresets((styles) => createButtonStyle(() => ({ wrapper: styles })))

export const ButtonStyles = {
  ...presets,
  default: createButtonStyle(() => ({
    wrapper: {
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
    },
    text: {},
  })),
  circle: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(1),
    },
  })),
  pill: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius,
      ...theme.spacing.paddingHorizontal(1),
      ...theme.spacing.paddingVertical(0.5),
    },
  })),
}
