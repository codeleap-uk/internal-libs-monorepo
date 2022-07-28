import { createDefaultVariantFactory } from '@codeleap/common'
import { ScrollComposition, ScrollStyles } from '../Scroll/styles'

export type ListComposition = ScrollComposition

const createListStyle = createDefaultVariantFactory<ListComposition>()

export const ListStyles = {
  default: createListStyle((theme) => {
    const defaultStyles = ScrollStyles.default(theme)
    return {
      ...defaultStyles,
    }
  }),
}
