import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputBaseParts } from '../InputBase'

export type NumberIncrementParts = InputBaseParts | 'input' | 'placeholder'

export type NumberIncrementStates = 'disabled' | 'focus' | 'error'

export type NumberIncrementComposition =
  | NumberIncrementParts
  | `${NumberIncrementParts}:${NumberIncrementStates}`
  | `innerWrapper:cursor`

const createNumberIncrementStyle = createDefaultVariantFactory<NumberIncrementComposition>()

export const NumberIncrementPresets = includePresets((styles) => createNumberIncrementStyle(() => ({ wrapper: styles })))
