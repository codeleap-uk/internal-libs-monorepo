import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TooltipComposition = 'wrapper' | 'arrow' | 'bubble';

const createTooltipStyle = createDefaultVariantFactory<TooltipComposition>()

const presets = includePresets((styles) => createTooltipStyle(() => ({ wrapper: styles })))

export const TooltipStyles = {
  ...presets,
  default: createTooltipStyle((t) =>  ({
    wrapper: {
      display: 'flex',
      background: t.colors.white,
      border: t.border.black(1),
      position: 'absolute',
      zIndex: 10,
    },
    arrow: {
      content: '""',
      position: 'absolute',
      background: 'black',
      height: 10,
      width: 10,

    }

  })),
}

