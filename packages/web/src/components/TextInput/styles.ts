import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActionIconParts } from '../ActionIcon'
import { InputBaseParts, InputBaseStates } from '../InputBase'

type TextInputParts =  InputBaseParts | 'input'  | 'placeholder' | 'selection'
export type TextInputStates = InputBaseStates | 'multiline' | 'hasMultipleLines'

export type IconParts = Exclude<ActionIconParts, 'icon' | 'icon:disabled'>

export type TextInputComposition =  `${TextInputParts}:${TextInputStates}` | TextInputParts

const createTextInputStyle =
  createDefaultVariantFactory<TextInputComposition>()

export const TextInputPresets = includePresets((styles) => createTextInputStyle(() => ({ wrapper: styles })))
