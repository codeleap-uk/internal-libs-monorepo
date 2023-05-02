import { ButtonComposition, createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type DatePickerModalComposition = 'labelText' | `button${Capitalize<ButtonComposition>}`

const createDatePickerModalStyle = createDefaultVariantFactory<DatePickerModalComposition>()
export const DatePickerModalPresets = includePresets((styles) => createDatePickerModalStyle(() => ({ buttonWrapper: styles })))
