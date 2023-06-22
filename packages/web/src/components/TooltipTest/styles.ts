import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

// export type TooltipTestStates = 'disabled'
export type TooltipTestSide = 'left' | 'right' | 'bottom' | 'top'
export type TooltipTestParts = 'wrapper' | 'arrow'

export type TooltipTestComposition = `wrapper[${TooltipTestSide}]` | TooltipTestParts

const createTooltipTestStyle = createDefaultVariantFactory<TooltipTestComposition>()

export const TooltipTestPresets = includePresets((styles) => createTooltipTestStyle(() => ({
  wrapper: styles,
})))
