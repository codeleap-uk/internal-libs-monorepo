import { createDefaultVariantFactory } from '@codeleap/common'
import { ScrollComposition, ScrollStyles } from '../Scroll/styles'

export type ListComposition = ScrollComposition | 'separator'

const createListStyle = createDefaultVariantFactory<ListComposition>()

export const ListStyles = {
  default: createListStyle((theme) => {
    const defaultStyles = ScrollStyles.default(theme)
    return {
      ...defaultStyles,
      separator: {
        width: '100%',
        height: theme.spacing.value(1),
      },
    }
  }),
}
