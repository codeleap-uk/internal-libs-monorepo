import { ButtonComposition, createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type DatePickerModalComposition = 'labelText' | `button${Capitalize<ButtonComposition>}`

const createDatePickerModalStyle = createDefaultVariantFactory<DatePickerModalComposition>()

export const DatePickerModalPresets = includePresets((styles) => createDatePickerModalStyle(() => ({ buttonWrapper: styles })))

export const DatePickerModalStyles = {
  ...DatePickerModalPresets,
  default: createDatePickerModalStyle((theme) => ({
    buttonWrapper: {
      backgroundColor: theme.colors.lightGray,
      borderRadius: theme.borderRadius.medium,
      justifyContent: 'space-between',
    },
    labelText: {

    },
  })),
}
