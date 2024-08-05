import { InputBaseParts } from '../InputBase'

export type NumberIncrementParts = InputBaseParts | 'input' | 'placeholder'

export type NumberIncrementStates = 'disabled' | 'focus' | 'error'

export type NumberIncrementComposition =
  | NumberIncrementParts
  | `${NumberIncrementParts}:${NumberIncrementStates}`
  | `innerWrapper:cursor`
