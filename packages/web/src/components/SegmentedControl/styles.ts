import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'

export type SegmentedControlStates = 'selected' | 'disabled'

type SegmentedControlParts =
'selectedBubble' |
'wrapper' |
'innerWrapper' |
'text' |
'icon' |
'button' |
`label`

export type SegmentedControlComposition = SegmentedControlParts | `${SegmentedControlParts}:${SegmentedControlStates}`

export type SegmentedControlStylesGen<TCSS = any> =
  StylesOf<
    Exclude<SegmentedControlComposition, 'buttonFeedback'>
  >

const createSegmentedControlStyle = createDefaultVariantFactory<
SegmentedControlComposition,
SegmentedControlStylesGen
>()

export const SegmentedControlPresets = includePresets((style) => createSegmentedControlStyle(() => ({ wrapper: style })))
