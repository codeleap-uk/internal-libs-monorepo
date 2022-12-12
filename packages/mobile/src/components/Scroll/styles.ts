import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ScrollComposition = 'wrapper' |'content' | 'refreshControl'

const createScrollStyle = createDefaultVariantFactory<ScrollComposition>()

const presets = includePresets(style => createScrollStyle(() => ({ content: style })))

export const ScrollStyles = {
  ...presets,
  default: createScrollStyle((theme) => {
    return {
      wrapper: {
        ...theme.presets.fullHeight,
      },
      refreshControl: {
        color: theme.colors.primary,
      },
    }
  }),
}
