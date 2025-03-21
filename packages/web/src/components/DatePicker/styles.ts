import { ActionIconComposition } from '../ActionIcon'
import { TextInputComposition } from '../TextInput'

export type DatePickerStates = ':selected' | ':disabled' | ''

export type DatePickerParts =
  | 'wrapper'
  | `dayWrapper${DatePickerStates}`
  | `day${DatePickerStates}`
  | `yearWrapper${DatePickerStates}`
  | `year${DatePickerStates}`

export type DatePickerHeaderComposition =
  | 'wrapper'
  | 'buttonsWrapper'
  | `prevButton${Capitalize<ActionIconComposition>}`
  | `nextButton${Capitalize<ActionIconComposition>}`
  | 'title'

export type DatePickerComposition =
  | DatePickerParts
  | `outerInput${Capitalize<TextInputComposition>}`
  | `header${Capitalize<DatePickerHeaderComposition>}`
