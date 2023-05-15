import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type DatePickerModalComposition =
    'headerWrapper' |
    'headerText' |
    'fotterButtonWrapper' |
    'footerCancelButton' |
    'footerConfirmButton'

const createDatePickerModalStyle = createDefaultVariantFactory<DatePickerModalComposition>()
export const DatePickerModalPresets = includePresets((styles) => createDatePickerModalStyle(() => ({ headerWrapper: styles })))
