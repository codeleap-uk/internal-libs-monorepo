import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ContentViewComposition = 'placeholder' | 'wrapper' |  'loader';

const createContentViewStyle = createDefaultVariantFactory<ContentViewComposition>()

const presets = includePresets((styles) => createContentViewStyle(() => ({ wrapper: styles })))

export const ContentViewStyles = {
  ...presets,
  default: createContentViewStyle((theme) => ({
    wrapper: {
      display: 'flex',
      ...theme.presets.column,
    },
    loader: {
      alignSelf: 'center',
    },
  })),
 
}
