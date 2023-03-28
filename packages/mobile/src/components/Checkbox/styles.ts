import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputLabelComposition } from '../InputLabel'

type CheckboxParts =
  | 'wrapper'
  | 'input'
  | 'inputFeedback'
  | 'checkmark'
  | 'checkmarkWrapper'
  | 'error'
  | `label${Capitalize<InputLabelComposition>}`

export type CheckboxComposition =
  | CheckboxParts
  | `${CheckboxParts}:checked`
  | `${CheckboxParts}:disabled`
  | `${CheckboxParts}:error`

const createCheckboxStyle =
  createDefaultVariantFactory<CheckboxComposition>()

export const CheckboxPresets = includePresets((styles) => createCheckboxStyle(() => ({ wrapper: styles })))
