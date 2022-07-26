import { createDefaultVariantFactory } from '@codeleap/common'

export type ListComposition = 'wrapper' |'content'

const createListStyle = createDefaultVariantFactory<ListComposition>()

export const ListStyles = {
  default: createListStyle((theme) => {
    return {
      wrapper: {
        ...theme.presets.fullHeight,
      },
    }
  }),
}
