import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ContentViewComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';

const createContentViewStyle = createDefaultVariantFactory<ContentViewComposition>()

const presets = includePresets((styles) => createContentViewStyle(() => ({ wrapper: styles })))

export const ContentViewStyles = {
  ...presets,
  default: createContentViewStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),
    },
  })),
  circle: createContentViewStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(2),
    },
    text: {
      color: 'yellow',
    },
  })),
  pill: createContentViewStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius,
    },
  })),

}
