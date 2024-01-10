import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ButtonComposition } from '../Button'
import { ModalComposition } from '../Modal'

export type CropPickerComposition =
  | 'cropPreview'
  | 'previewSize'
  | `confirmButton${Capitalize<ButtonComposition>}`
  | `modal${Capitalize<ModalComposition>}`

const createCropPickerStyle =
  createDefaultVariantFactory<CropPickerComposition>()

export const CropPickerPresets = includePresets((style) => createCropPickerStyle(() => ({ modalWrapper: style })),
)
