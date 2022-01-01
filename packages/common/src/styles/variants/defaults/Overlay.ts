import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type OverlayComposition = 'wrapper';
const createOverlayStyle = createDefaultVariantFactory<OverlayComposition>()

const presets = includePresets((styles) => createOverlayStyle(() => ({ wrapper: styles })))

export const OverlayStyles = {
  ...presets,
  default: createOverlayStyle((theme) => ({
    wrapper: {
      background: theme.colors.black,
      opacity: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      position: 'fixed',
    },
  })),
  visible: createOverlayStyle(() => ({
    wrapper: {
   
      opacity: 0.5,
  
    },
  })),
}
