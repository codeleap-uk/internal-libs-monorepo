import { InputBaseParts, InputBaseStates } from '../InputBase'

export type NumberIncrementParts = InputBaseParts | 'input' | 'placeholder' | 'selection'

export type NumberIncrementStates = InputBaseStates

export type NumberIncrementComposition =
  | NumberIncrementParts
  | `${NumberIncrementParts}:${NumberIncrementStates}`
