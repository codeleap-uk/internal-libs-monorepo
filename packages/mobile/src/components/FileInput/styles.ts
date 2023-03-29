import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type FileInputComposition = 'label' | 'wrapper' | 'input'

const createFileInputStyle =
  createDefaultVariantFactory<FileInputComposition>()

export const FileInputPresets = includePresets((styles) => createFileInputStyle(() => ({ wrapper: styles })))
