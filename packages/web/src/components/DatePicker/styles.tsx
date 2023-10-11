import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type DatePickerComposition = 'wrapper'

const createDatePickerStyle =
  createDefaultVariantFactory<DatePickerComposition>()

export const DatePickerPresets = includePresets(
  (style) => createDatePickerStyle(() => ({ wrapper: style })),
)
