import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TooltipComposition = 'wrapper' | 'arrow' | 'bubble'

const createTooltipStyle = createDefaultVariantFactory<TooltipComposition>()

export const TooltipPresets = includePresets((styles) => createTooltipStyle(() => ({
  wrapper: styles,
})))
