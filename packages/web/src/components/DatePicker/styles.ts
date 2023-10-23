import {
  TextInputComposition,
  createDefaultVariantFactory,
  includePresets,
} from '@codeleap/common'
import { ActionIconComposition } from '../ActionIcon'

export type DatePickerStates = 'selected' | 'disabled'

export type DatePickerParts =
  | 'wrapper'
  | 'dayWrapper'
  | 'day'
  | `dayWrapper:${DatePickerStates}`
  | `day:${DatePickerStates}`
  | 'yearWrapper'
  | 'year'
  | `yearWrapper:${DatePickerStates}`
  | `year:${DatePickerStates}`

export type DatePickerHeaderComposition =
  | 'wrapper'
  | 'buttonsWrapper'
  | `prevButton${Capitalize<ActionIconComposition>}`
  | `nextButton${Capitalize<ActionIconComposition>}`
  | 'title'

export type DatePickerComposition =
  | DatePickerParts
  | `outerInput${Capitalize<TextInputComposition>}`
  | `header${Capitalize<DatePickerHeaderComposition>}`

const createDatePickerStyle =
  createDefaultVariantFactory<DatePickerComposition>()

export const DatePickerPresets = includePresets(
  (style) => createDatePickerStyle(() => ({ wrapper: style })),
)
