import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type OverlayComposition = 'wrapper' | 'wrapper:visible';
const createOverlayStyle = createDefaultVariantFactory<OverlayComposition>()

const presets = includePresets((styles) => createOverlayStyle(() => ({ wrapper: styles })))

export const OverlayStyles = {
  ...presets,
  default: createOverlayStyle((theme) => ({
    wrapper: {
      
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      position: 'fixed',
      background: theme.colors.black,
      opacity: 0,
      visibility: 'hidden',
    },
    'wrapper:visible': {
      opacity: 0.5,
      visibility: 'visible',
    },
  })),

}
