import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputBaseParts, InputBaseStates } from '../InputBase'

type AnimatableParts = 'checkmarkWrapper' | 'box'
export type CheckboxParts = InputBaseParts | AnimatableParts | 'checkmark'

export type AnimationStates = 'checked' | 'unchecked' | 'disabled-checked' | 'disabled-unchecked'

export type CheckboxStates = InputBaseStates

export type CheckboxComposition =
  | CheckboxParts
  | `${CheckboxParts}:${CheckboxStates}`
  | `${AnimatableParts}:transition`
  | `${AnimatableParts}:${AnimationStates}`
  | '__props'

const createCheckboxStyle = createDefaultVariantFactory<CheckboxComposition>()

export const CheckboxPresets = includePresets((styles) => createCheckboxStyle(() => ({ wrapper: styles })))

