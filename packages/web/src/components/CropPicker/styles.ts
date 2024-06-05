import { ButtonComposition } from '../Button'
import { ModalComposition } from '../Modal'

export type CropPickerComposition =
  | 'cropPreview'
  | 'previewSize'
  | `confirmButton${Capitalize<ButtonComposition>}`
  | `modal${Capitalize<ModalComposition>}`

