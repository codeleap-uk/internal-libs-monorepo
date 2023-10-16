import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActionIconComposition } from '../ActionIcon'

export type DropzoneComposition =
  | 'wrapper'
  | 'dropzone'
  | 'icon'
  | 'placeholder'
  | 'filesWrapper'
  | 'fileWrapper'
  | 'fileLeftIcon'
  | 'fileName'
  | 'fileError'
  | 'fileErrors'
  | 'fileNameWrapper'
  | 'fileImage'
  | 'iconWrapper'
  | `fileRightIcon${Capitalize<ActionIconComposition>}`

const createDropzoneStyle = createDefaultVariantFactory<DropzoneComposition>()

export const DropzonePresets = includePresets((styles) => createDropzoneStyle(() => ({ wrapper: styles })),
)
