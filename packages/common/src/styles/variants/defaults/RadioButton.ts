import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type RadioButtonComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';

const createRadioButtonStyle = createDefaultVariantFactory<RadioButtonComposition>()

const presets = includePresets((styles) => createRadioButtonStyle(() => ({ wrapper: styles })))

export const RadioButtonStyles = {
  ...presets,
  default: createRadioButtonStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),
    },
  })),
  circle: createRadioButtonStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(2),
    },
    text: {
      color: 'yellow',
    },
  })),
  pill: createRadioButtonStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius,
    },
  })),

}
