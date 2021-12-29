import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type FileInputComposition = 'label' | 'wrapper' | '';

const createFileInputStyle = createDefaultVariantFactory<FileInputComposition>()

const presets = includePresets((styles) => createFileInputStyle(() => ({ wrapper: styles })))

export const FileInputStyles = {
  ...presets,
  default: createFileInputStyle((theme) => ({
    wrapper: {
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),  
    },
  })),
  circle: createFileInputStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(2), 
    },
    text: { 
      color: 'yellow',
    },
  })),
  pill: createFileInputStyle((theme) => ({ 
    wrapper: {
      borderRadius: theme.borderRadius,
    },
  })),

}
