import { StylesOf } from '@codeleap/types'
import { FeedbackConfig } from '../../utils'

export type TextComposition = 'text' | 'pressFeedback' | 'text:disabled'

export type TextStylesGen<TCSS = any> = StylesOf<'text', TCSS> & {
  'pressFeedback'?: FeedbackConfig
}
