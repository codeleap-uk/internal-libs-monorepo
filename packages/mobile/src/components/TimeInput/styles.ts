import { TextInputComposition } from '../TextInput'

export type TimeInputComposition =
  'wrapper' |
  `input${Capitalize<TextInputComposition>}` |
  'timePicker'