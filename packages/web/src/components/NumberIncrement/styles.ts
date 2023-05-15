import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputBaseParts } from '../InputBase'

export type NumberIncrementParts = InputBaseParts | 'text'

export type NumberIncrementStates = 'disabled'

export type NumberIncrementComposition =
  | NumberIncrementParts
  | `${NumberIncrementParts}:${NumberIncrementStates}`

const createNumberIncrementStyle = createDefaultVariantFactory<NumberIncrementComposition>()

export const NumberIncrementPresets = includePresets((styles) => createNumberIncrementStyle(() => ({ wrapper: styles })))
