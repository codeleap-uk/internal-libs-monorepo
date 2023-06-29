import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputBaseParts, InputBaseStates } from '../InputBase'

export type NumberIncrementParts = InputBaseParts | 'input' | 'placeholder' | 'selection'

export type NumberIncrementStates = InputBaseStates

export type NumberIncrementComposition =
  | NumberIncrementParts
  | `${NumberIncrementParts}:${NumberIncrementStates}`

const createNumberIncrementStyle = createDefaultVariantFactory<NumberIncrementComposition>()

export const NumberIncrementPresets = includePresets((styles) => createNumberIncrementStyle(() => ({ wrapper: styles })))
