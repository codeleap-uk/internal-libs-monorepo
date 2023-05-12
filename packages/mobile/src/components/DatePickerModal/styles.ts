import { ButtonComposition, createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ModalComposition } from '@codeleap/mobile'

export type DatePickerModalComposition =
    `modal${Capitalize<ModalComposition>}` |
    'headerWrapper' |
    'headerText' |
    'fotterButtonWrapper' |
    'footerCancelButton' |
    'footerConfirmButton'

const createDatePickerModalStyle = createDefaultVariantFactory<DatePickerModalComposition>()
export const DatePickerModalPresets = includePresets((styles) => createDatePickerModalStyle(() => ({ headerWrapper: styles })))
