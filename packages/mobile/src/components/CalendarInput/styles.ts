import { TextInputComposition } from '../TextInput'
import { CalendarComposition } from '../Calendar'

export type CalendarInputComposition =
  'wrapper' |
  `input${Capitalize<TextInputComposition>}` |
  `calendar${Capitalize<CalendarComposition>}`