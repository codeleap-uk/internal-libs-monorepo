import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ImageComposition = 'wrapper';
const createImageStyle = createDefaultVariantFactory<ImageComposition>()

const presets = includePresets((styles) => createImageStyle(() => ({ wrapper: styles })))

export const ImageStyles = {
  ...presets,
  default: createImageStyle(() => ({
    wrapper: {
    
    },
  })),
  skeleton: createImageStyle(() => ({
    wrapper: {
      backgroundColor: '#f3f3f3',
    },
  })),
  round: createImageStyle(() => ({
    wrapper: {
      borderRadius: 100,
    },
  })),
}
