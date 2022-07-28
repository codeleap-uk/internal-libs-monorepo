import { createDefaultVariantFactory } from '@codeleap/common'

export type ScrollComposition = 'wrapper' |'content' | 'refreshControl'

const createScrollStyle = createDefaultVariantFactory<ScrollComposition>()

export const ScrollStyles = {
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
