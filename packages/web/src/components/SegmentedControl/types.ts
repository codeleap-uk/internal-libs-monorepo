import { PropsOf } from '@codeleap/common'
import { StylesOf } from '../../types'
import { SegmentedControlComposition } from './styles'
import { ActionIcon } from '../ActionIcon'

export interface SegmentedControlProps {
  options?: {label: string; value: any }[]
  /**
   * Determine if the modal is visible
  */
  value?: any
  /**
   * Determine if the modal is visible
  */
  styles?: React.ReactNode
  /**
    * Determine if the modal is visible
  */
  label?: React.ReactNode
  /**
    * Determine if the modal is visible
  */
  getItemWidth?: (item:{label: string; value: any }, idx: number, arr: {label: string; value: any }[]) => number
  /**
    * Determine if the modal is visible
  */
}

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
  > & {
    buttonFeedback?: TouchableStylesGen['feedback']
  }
