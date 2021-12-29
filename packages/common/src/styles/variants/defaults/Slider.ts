import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type SliderComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';

const createSliderStyle = createDefaultVariantFactory<SliderComposition>()

const presets = includePresets((styles) => createSliderStyle(() => ({ wrapper: styles })))

export const SliderStyles = {
  ...presets,
  default: createSliderStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),
    },
  })),
  circle: createSliderStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(2),
    },
    text: {
      color: 'yellow',
    },
  })),
  pill: createSliderStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius,
    },
  })),

}
