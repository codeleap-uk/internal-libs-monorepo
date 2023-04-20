import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type InputLabelComposition = 'text' | 'wrapper' | 'asterisk'

const createInputLabelStyle = createDefaultVariantFactory<InputLabelComposition>()

export const InputLabelPresets = includePresets(style => createInputLabelStyle(() => ({ wrapper: style, text: style })))
