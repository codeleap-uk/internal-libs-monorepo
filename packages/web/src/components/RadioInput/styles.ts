import {
  createDefaultVariantFactory, includePresets
} from '@codeleap/common'

export type RadioInputComposition = "button" | "text" | "wrapper" | "itemText" | "button:checked" | "button:unchecked" | "itemWrapper" | "listWrapper" | "button:mark"

const createRadioStyle = createDefaultVariantFactory<RadioInputComposition>()

export const RadioInputPresets = includePresets((styles) => createRadioStyle(() => ({ wrapper: styles })))

