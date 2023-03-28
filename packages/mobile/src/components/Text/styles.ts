import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { FeedbackConfig } from '../../utils'

export type TextComposition = 'text' | 'pressFeedback' | 'text:disabled'

export type TextStylesGen<TCSS = any> = StylesOf<'text', TCSS> & {
  'pressFeedback'?: FeedbackConfig
}

const createTextStyle = createDefaultVariantFactory<
  TextComposition, TextStylesGen
>()

export const TextPresets = includePresets((styles) => createTextStyle(() => ({ text: styles })))
