import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TooltipComposition = 'wrapper' | 'arrow';

const createTooltipStyle = createDefaultVariantFactory<TooltipComposition>()

const presets = includePresets((styles) => createTooltipStyle(() => ({ wrapper: styles })))

export const TooltipStyles = {
  ...presets,
  default: createTooltipStyle((t) =>  ({
    wrapper: {
      display: 'flex',
      background: t.colors.white,
      border: t.border.black(1)
    },

  })),
}

