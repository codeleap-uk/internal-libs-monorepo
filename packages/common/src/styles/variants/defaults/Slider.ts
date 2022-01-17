import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type SliderComposition = 'wrapper' | 'handle' | 'bar' | 'track' ;

const createSliderStyle = createDefaultVariantFactory<SliderComposition>()

const presets = includePresets((styles) => createSliderStyle(() => ({ wrapper: styles })))

export const SliderStyles = {
  ...presets,
  default: createSliderStyle((theme) => ({
    wrapper: {
     
    },
  })),


}
