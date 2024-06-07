export type SegmentedControlStates = 'selected' | 'disabled'

type SegmentedControlParts =
    'wrapper' |
    'innerWrapper' |
    'selectedBubble' |
    'text' |
    'icon' |
    'button' |
    `label`

export type SegmentedControlComposition = SegmentedControlParts | `${SegmentedControlParts}:${SegmentedControlStates}`

