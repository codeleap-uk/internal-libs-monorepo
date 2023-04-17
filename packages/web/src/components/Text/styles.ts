import { createDefaultVariantFactory, includePresets } from "@codeleap/common"

export type TextComposition = 'text'

const createTextStyle = createDefaultVariantFactory<TextComposition>()

export const TextPresets = includePresets((styles) =>
  createTextStyle(() => ({ text: styles }))
)