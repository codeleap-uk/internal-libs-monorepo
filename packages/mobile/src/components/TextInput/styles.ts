import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputBaseComposition, InputBaseStates, InputBaseParts } from '../InputBase'


type TextInputParts =  InputBaseParts | 'input'  | 'placeholder' | 'selection'
export type TextInputStates = InputBaseStates | 'multiline'

export type TextInputComposition =  `${TextInputParts}:${TextInputStates}` | TextInputParts

const createTextInputStyle =
  createDefaultVariantFactory<TextInputComposition>()

export const TextInputPresets = includePresets((styles) => createTextInputStyle(() => ({ wrapper: styles })))
