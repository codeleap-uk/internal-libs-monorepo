import { StylesOf } from '../../types'
import { TouchableFeedbackConfig } from '../../utils'

export type TouchableComposition = 'wrapper' | 'wrapper:disabled' | 'feedback' | 'pressable'

export type TouchableStylesGen<TCSS = any> = StylesOf<Exclude<TouchableComposition, 'feedback'>> & {
  feedback?: TouchableFeedbackConfig
}
