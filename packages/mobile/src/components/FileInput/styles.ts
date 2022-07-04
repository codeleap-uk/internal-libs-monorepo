import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type FileInputComposition = 'label' | 'wrapper' | 'input'

const createFileInputStyle =
  createDefaultVariantFactory<FileInputComposition>()

const presets = includePresets((styles) => createFileInputStyle(() => ({ wrapper: styles })),
)

export const FileInputStyles = {
  ...presets,
  default: createFileInputStyle((theme) => ({})),

}
