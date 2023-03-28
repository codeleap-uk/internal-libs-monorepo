import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActionIconParts } from '../ActionIcon'
import { InputLabelComposition } from '../InputLabel'

export type IconParts = Exclude<ActionIconParts, 'icon' | 'icon:disabled'>
type InputIcons = 'icon' | 'leftIcon' | 'rightIcon'

export type InputIconComposition = `${InputIcons}${Capitalize<IconParts>}`
| InputIcons

type TextInputParts =
  | 'wrapper'
  | InputIconComposition
  | 'textField'
  | 'innerWrapper'
  | 'error'
  | 'subtitle'
  | 'subtitleWrapper'
  | 'placeholder'
  | 'selection'
  | `label${Capitalize<InputLabelComposition>}`

export type TextInputComposition =
  | `${TextInputParts}:error`
  | `${TextInputParts}:focus`
  | TextInputParts

const createTextInputStyle =
  createDefaultVariantFactory<TextInputComposition>()

export const TextInputPresets = includePresets((styles) => createTextInputStyle(() => ({ wrapper: styles })))
