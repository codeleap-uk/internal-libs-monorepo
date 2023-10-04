import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type DropzoneComposition =
  | 'wrapper'
  | 'dropzone'
  | 'icon'
  | 'placeholder'
  | 'filesWrapper'
  | 'fileWrapper'
  | 'fileLeftIcon'
  | 'fileRightIcon'
  | 'fileName'
  | 'fileError'
  | 'fileErrors'
  | 'fileNameWrapper'
  | 'fileImage'
  | 'iconWrapper'

const createDropzoneStyle = createDefaultVariantFactory<DropzoneComposition>()

export const DropzonePresets = includePresets((styles) => createDropzoneStyle(() => ({ wrapper: styles })),
)
