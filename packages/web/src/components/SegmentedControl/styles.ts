import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'

export type SegmentedControlStates = 'selected' | 'disabled'

export type SegmentedControlComposition =
 'selectedBubble' |
 'wrapper' |
 'innerWrapper' |
 'scroll' |
 'scrollContent' |
 'text' |
 `text:${SegmentedControlStates}` |
 'icon' |
 'button' |
 'buttonFeedback' |
 `button:${SegmentedControlStates}` |
  `selectedBubble:${SegmentedControlStates}` |
 `label`

export type SegmentedControlStylesGen<TCSS = any> =
  StylesOf<
    Exclude<SegmentedControlComposition, 'buttonFeedback'>
  >

const createSegmentedControlStyle = createDefaultVariantFactory<
SegmentedControlComposition,
SegmentedControlStylesGen
>()

export const SegmentedControlPresets = includePresets((style) => createSegmentedControlStyle(() => ({ wrapper: style })))

