import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type CropPickerComposition = 'wrapper' | 'crop' | 'preview' | 'controls' | 'button' | 'input'

const createCropPickerStyle = createDefaultVariantFactory<CropPickerComposition>()

export const CropPickerPresets = includePresets(style => createCropPickerStyle(() => ({ wrapper: style })))
