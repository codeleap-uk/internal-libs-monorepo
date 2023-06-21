import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'

export type SegmentedControlStates = 'selected' | 'disabled'

export type SegmentedControlComposition =
 'selectedBubble' |
 `selectedBubble:${SegmentedControlStates}` |
 'wrapper' |
 'innerWrapper' |
 `innerWrapper:${SegmentedControlStates}` |
 'text' |
 `text:${SegmentedControlStates}` |
 'icon' |
 `icon:${SegmentedControlStates}` |
 'button' |
 `button:${SegmentedControlStates}` |
 `label` |
 `label:${SegmentedControlStates}`

export type SegmentedControlStylesGen<TCSS = any> =
  StylesOf<
    Exclude<SegmentedControlComposition, 'buttonFeedback'>
  >

const createSegmentedControlStyle = createDefaultVariantFactory<
SegmentedControlComposition,
SegmentedControlStylesGen
>()

export const SegmentedControlPresets = includePresets((style) => createSegmentedControlStyle(() => ({ wrapper: style })))
