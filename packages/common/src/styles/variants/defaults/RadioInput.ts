import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type RadioInputComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';

const createRadioInputStyle = createDefaultVariantFactory<RadioInputComposition>()

const presets = includePresets((styles) => createRadioInputStyle(() => ({ wrapper: styles })))

export const RadioInputStyles = {
  ...presets,
  default: createRadioInputStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),
    },
  })),
  circle: createRadioInputStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(2),
    },
    text: {
      color: 'yellow',
    },
  })),
  pill: createRadioInputStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius,
    },
  })),

}
