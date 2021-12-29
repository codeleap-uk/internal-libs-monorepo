import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type OverlayComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';
const createOverlayStyle = createDefaultVariantFactory<OverlayComposition>()

const presets = includePresets((styles) => createOverlayStyle(() => ({ wrapper: styles })))

export const OverlayStyles = {
  ...presets,
  default: createOverlayStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),
    },
  })),
  circle: createOverlayStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(2),
    },
    text: {
      color: 'yellow',
    },
  })),
  pill: createOverlayStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius,
    },
  })),

}
