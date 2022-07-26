import { assignTextStyle, createDefaultVariantFactory } from '@codeleap/common'
import { SelectComposition, SelectStyles } from '../Select'
import { TextInputComposition } from '../TextInput'

export type AutoCompleteComposition = SelectComposition | `searchInput${Capitalize<TextInputComposition>}` | 'titleWrapper'

const createAutoCompleteStyle = createDefaultVariantFactory<AutoCompleteComposition>()

export const AutoCompleteStyles = {
  ...SelectStyles,
  default: createAutoCompleteStyle((theme) => {
    const defaultStyle = SelectStyles.default(theme)

    return {
      ...defaultStyle,
      header: {
        ...theme.spacing.paddingHorizontal(2),
        ...theme.presets.column,
        ...theme.presets.alignStart,
      },
      box: {
        minHeight: theme.values.height * 0.85,
        maxHeight: theme.values.height * 0.85,
      },
      listContent: {
        ...theme.presets.safeAreaBottom(0, true),
      },
      searchInputWrapper: {
        ...theme.presets.fullWidth,
        ...theme.spacing.marginTop(2),
      },

      titleWrapper: {
        ...theme.presets.row,
        ...theme.presets.alignCenter,
        ...theme.presets.fullWidth,
        ...theme.presets.justifyCenter,
      },
      title: {
        ...theme.presets.textCenter,
        flex: 1,
      },
      closeButtonWrapper: {
        position: 'absolute',
        right: 0,
      },
    }
  }),
}
