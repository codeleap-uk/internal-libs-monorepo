import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type FileInputComposition = 'label' | 'wrapper' | 'input'

const createFileInputStyle =
  createDefaultVariantFactory<FileInputComposition>()

const presets = includePresets((styles) => createFileInputStyle(() => ({ wrapper: styles })),
)

export const FileInputStyles = {
  ...presets,
  default: createFileInputStyle((theme) => ({})),
  circle: createFileInputStyle((theme) => ({})),
  pill: createFileInputStyle((theme) => ({})),
}
