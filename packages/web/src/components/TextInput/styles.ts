import { ActionIconParts } from '../ActionIcon'
import { InputBaseParts, InputBaseStates } from '../InputBase'

type TextInputParts = InputBaseParts | 'input' | 'placeholder' | 'selection'

export type TextInputStates = InputBaseStates | 'multiline' | 'hasMultipleLines'

export type IconParts = Exclude<ActionIconParts, 'icon' | 'icon:disabled'>

export type TextInputComposition = `${TextInputParts}:${TextInputStates}` | TextInputParts
