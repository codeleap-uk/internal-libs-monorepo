import { InputBaseStates, InputBaseParts } from '../InputBase'

type TextInputParts =  InputBaseParts | 'input'  | 'placeholder' | 'selection'

export type TextInputStates = InputBaseStates | 'multiline' | 'hasMultipleLines' | 'pressable'

export type TextInputComposition =  `${TextInputParts}:${TextInputStates}` | TextInputParts
