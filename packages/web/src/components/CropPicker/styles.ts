import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type CropPickerComposition = 'wrapper' | 'cropPreview' | 'previewSize'

const createCropPickerStyle = createDefaultVariantFactory<CropPickerComposition>()

export const CropPickerPresets = includePresets(style => createCropPickerStyle(() => ({ wrapper: style })))
