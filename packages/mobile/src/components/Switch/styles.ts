import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputBaseParts, InputBaseStates } from '../InputBase'

type AnimatableParts = 'track' | 'thumb'
export type SwitchParts = InputBaseParts | AnimatableParts 

export type AnimationStates = 'on' | 'off' | 'disabled-on' | 'disabled-off'

export type SwitchStates = InputBaseStates

export type SwitchComposition =
  | SwitchParts
  | `${SwitchParts}:${SwitchStates}`
  | `${AnimatableParts}:transition`
  | `${AnimatableParts}:${AnimationStates}`
  | '__props'

const createSwitchStyle = createDefaultVariantFactory<SwitchComposition>()

export const SwitchPresets = includePresets((styles) => createSwitchStyle(() => ({ wrapper: styles })))

