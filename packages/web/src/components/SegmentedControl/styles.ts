import { StylesOf } from '@codeleap/common'

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

export type SegmentedControlStylesGen<TCSS = any> = StylesOf<Exclude<SegmentedControlComposition, 'buttonFeedback'>>

