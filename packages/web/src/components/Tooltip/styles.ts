export type TooltipSide = 'left' | 'right' | 'bottom' | 'top'
export type TooltipState = 'delayed-open' | 'closed' | 'instant-open' | 'disabled'
export type TooltipParts =
  'arrow' |
  'content' |
  'triggerWrapper' |
  'triggerInnerWrapper'

export type TooltipComposition = `content:${TooltipSide}` | TooltipParts
