import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ButtonComposition } from '../Button'
import { ModalComposition } from '../Modal'
import { TextInputComposition } from '../TextInput'

export type DatePickerModalComposition =
    ModalComposition | 
    `input${Capitalize<TextInputComposition>}` | 
    `picker` | 
    `doneButton${Capitalize<ButtonComposition>}` | 
    `confirmButton${Capitalize<ButtonComposition>}` | 
    `cancelButton${Capitalize<ButtonComposition>}`

const createDatePickerModalStyle = createDefaultVariantFactory<DatePickerModalComposition>()
export const DatePickerModalPresets = includePresets((styles) => createDatePickerModalStyle(() => ({ inputWrapper: styles })))
