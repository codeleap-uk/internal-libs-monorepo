import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ContentViewComposition = 'placeholder' | 'wrapper' | 'loader'

const createContentViewStyle =
  createDefaultVariantFactory<ContentViewComposition>()

const presets = includePresets((styles) => createContentViewStyle(() => ({ wrapper: styles })),
)

export const ContentViewStyles = {
  ...presets,
  default: createContentViewStyle((theme) => ({
    wrapper: {
      display: 'flex',
      ...theme.presets.column,
    },
    loader: {
      alignSelf: 'center',
      height: theme.values.width * 0.15,
      width: theme.values.width * 0.15,
    },
  })),
}
