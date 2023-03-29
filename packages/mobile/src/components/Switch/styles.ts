import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputLabelComposition } from '../InputLabel'

export type SwitchParts = 'wrapper' | `label${Capitalize<InputLabelComposition>}` | 'input' | 'error' | 'inputWrapper'
export type SwitchComposition =
  | SwitchParts
  | `${SwitchParts}:disabled`
  | `${SwitchParts}:on`

const createSwitchStyle = createDefaultVariantFactory<SwitchComposition>()

export const SwitchPresets = includePresets((styles) => createSwitchStyle(() => ({ wrapper: styles })))

