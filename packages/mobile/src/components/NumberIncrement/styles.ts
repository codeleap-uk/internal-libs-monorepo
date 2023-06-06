import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputBaseParts } from '../InputBase'

export type NumberIncrementParts = InputBaseParts | 'input' | 'placeholder' | 'selection'

export type NumberIncrementStates = 'disabled' | 'focus' | 'error'

export type NumberIncrementComposition =
  | NumberIncrementParts
  | `${NumberIncrementParts}:${NumberIncrementStates}`

const createNumberIncrementStyle = createDefaultVariantFactory<NumberIncrementComposition>()

export const NumberIncrementPresets = includePresets((styles) => createNumberIncrementStyle(() => ({ wrapper: styles })))
