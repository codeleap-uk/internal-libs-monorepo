import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { BadgeComposition } from '../Badge'
import { InputLabelComposition } from '../InputLabel'
import { TouchableStylesGen } from '../Touchable'

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
 `label${Capitalize<InputLabelComposition>}` |
 `badge${Capitalize<BadgeComposition>}`

export type SegmentedControlStylesGen<TCSS = any> =
  StylesOf<
    Exclude<SegmentedControlComposition, 'buttonFeedback'>
  > & {
    buttonFeedback?: TouchableStylesGen['feedback']
  }

const createSegmentedControlStyle = createDefaultVariantFactory<
SegmentedControlComposition,
SegmentedControlStylesGen
>()

export const SegmentedControlPresets = includePresets((style) => createSegmentedControlStyle(() => ({ wrapper: style })))
