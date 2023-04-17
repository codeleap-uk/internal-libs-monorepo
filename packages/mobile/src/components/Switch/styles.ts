import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputBaseParts, InputBaseStates } from '../InputBase'

type AnimatableParts = 'track' | 'thumb'
export type SwitchParts = InputBaseParts | AnimatableParts 

export type SwitchAnimationStates = 'on' | 'off' | 'disabled-on' | 'disabled-off'

export type SwitchStates = InputBaseStates

export type SwitchComposition =
  | SwitchParts
  | `${SwitchParts}:${SwitchStates}`
  | `${AnimatableParts}:transition`
  | `${AnimatableParts}:${SwitchAnimationStates}`
  | '__props'

const createSwitchStyle = createDefaultVariantFactory<SwitchComposition>()

export const SwitchPresets = includePresets((styles) => createSwitchStyle(() => ({ wrapper: styles })))

