import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ScrollComposition, ScrollStyles } from '../Scroll/styles'

export type ListComposition = ScrollComposition | 'separator'

const createListStyle = createDefaultVariantFactory<ListComposition>()

const presets = includePresets(style => createListStyle(() => ({ content: style })))

export const ListStyles = {
  ...presets,
  default: createListStyle((theme) => {
    const defaultStyles = ScrollStyles.default(theme)
    return {
      ...defaultStyles,
      separator: {
        width: '100%',
        height: theme.spacing.value(1),
      },
      content: {
        flexGrow: 1,
      },
    }
  }),
}
