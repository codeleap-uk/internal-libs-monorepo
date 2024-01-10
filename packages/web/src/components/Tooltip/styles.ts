import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TooltipSide = 'left' | 'right' | 'bottom' | 'top'
export type TooltipState = 'delayed-open' | 'closed' | 'instant-open' | 'disabled'
export type TooltipParts = 
  'wrapper' | 
  'arrow' |
  'content' |
  'triggerWrapper' |
  'triggerInnerWrapper'

export type TooltipComposition = `content:${TooltipSide}` | TooltipParts

const createTooltipStyle = createDefaultVariantFactory<TooltipComposition>()

export const TooltipPresets = includePresets((styles) => createTooltipStyle(() => ({
  wrapper: styles,
})))
