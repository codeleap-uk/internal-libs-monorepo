import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputLabelComposition } from '../InputLabel'
type RadioParts = 'button' | 'itemWrapper' | 'text' | 'buttonMark' | 'buttonFeedback'

type RadioGroupParts = `label${Capitalize<InputLabelComposition>}` | 'wrapper' | 'list'

export type RadioInputComposition =
  | `${RadioParts}:checked`
  | RadioParts
  | RadioGroupParts

const createRadioStyle =
  createDefaultVariantFactory<RadioInputComposition>()

export const RadioInputPresets = includePresets(style => createRadioStyle(() => ({ wrapper: style })))
