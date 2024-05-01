import { StylesOf } from '@codeleap/common'
import { BadgeComposition } from '../Badge'
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
  'labelText' |
  'labelWrapper' |
  `badge${Capitalize<BadgeComposition>}`

export type SegmentedControlStylesGen<TCSS = any> =
  StylesOf<
    Exclude<SegmentedControlComposition, 'buttonFeedback'>
  > & {
    buttonFeedback?: TouchableStylesGen['feedback']
  }
