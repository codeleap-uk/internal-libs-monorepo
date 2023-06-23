import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TooltipSide = 'left' | 'right' | 'bottom' | 'top'
export type TooltipParts = 'wrapper' | 'arrow'

export type TooltipComposition = `wrapper[${TooltipSide}]` | TooltipParts

const createTooltipStyle = createDefaultVariantFactory<TooltipComposition>()

export const TooltipPresets = includePresets((styles) => createTooltipStyle(() => ({
  wrapper: styles,
})))
