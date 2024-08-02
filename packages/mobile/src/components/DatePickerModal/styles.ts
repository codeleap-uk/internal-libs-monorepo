import { ButtonComposition } from '../Button'
import { ModalComposition } from '../Modal'
import { TextInputComposition } from '../TextInput'

export type DatePickerModalButtonCompositions =
  `doneButton${Capitalize<ButtonComposition>}` |
  `confirmButton${Capitalize<ButtonComposition>}` |
  `cancelButton${Capitalize<ButtonComposition>}`

export type DatePickerModalComposition =
  ModalComposition |
  `input${Capitalize<TextInputComposition>}` |
  `picker` |
  DatePickerModalButtonCompositions
