import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TooltipComposition = 'wrapper' | 'arrow' | 'bubble';

const createTooltipStyle = createDefaultVariantFactory<TooltipComposition>()

const presets = includePresets((styles) => createTooltipStyle(() => ({ wrapper: styles })),
)

export const TooltipStyles = {
  ...presets,
  default: createTooltipStyle((t) => ({
    wrapper: {
      position: 'relative',
    },
    arrow: {
      content: '""',
      position: 'absolute',
      background: t.colors.backgroundSecondary,
      height: 10,
      width: 10,
      zIndex: -1,
    },
    bubble: {
      display: 'flex',
      background: t.colors.backgroundSecondary,
      zIndex: 10,
      position: 'absolute',
      ...t.spacing.padding(1),
    },
  })),
}
