import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type OverlayComposition = 'wrapper';
const createOverlayStyle = createDefaultVariantFactory<OverlayComposition>()

const presets = includePresets((styles) => createOverlayStyle(() => ({ wrapper: styles })))

export const OverlayStyles = {
  ...presets,
  default: createOverlayStyle(() => ({
    wrapper: {
      
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      position: 'fixed',
    },
  })),
  dark: createOverlayStyle((theme) => ({
    wrapper: {
      background: theme.colors.black,
    },
  })),
  hidden: createOverlayStyle(() => ({
    wrapper: {
      visibility: 'hidden',
      opacity: 0,
    },
  })),
  visible: createOverlayStyle(() => ({
    wrapper: {
      visibility: 'visible',
      opacity: 0.5,
    },
  })),

}
