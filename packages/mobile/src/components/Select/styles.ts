import { createDefaultVariantFactory, TextInputComposition } from '@codeleap/common'
import { DrawerComposition, DrawerStyles } from '../Drawer'
type ItemStates = '' | ':selected'
export type SelectComposition =
  DrawerComposition |
  `input${TextInputComposition}` |
  'list' |
  'listContent' |
  `itemWrapper${ItemStates}` |
  `itemText${ItemStates}` |
  'scroll' |
  'scrollContent'

const createSelectStyle = createDefaultVariantFactory<SelectComposition>()

export const SelectStyles = {
  ...DrawerStyles,
  default: createSelectStyle((theme) => {
    const defaultStyle = DrawerStyles.default(theme)
    return {
      ...defaultStyle,
      box: {
        ...theme.spacing.paddingHorizontal(0),

      },
      itemWrapper: {
        ...theme.spacing.padding(2),
        ...theme.presets.row,
        ...theme.presets.justifySpaceBetween,
        ...theme.presets.alignCenter,
      },
      'itemWrapper:selected': {
        backgroundColor: theme.colors.primary,
      },
      'itemText:selected': {
        color: theme.colors.white,

      },
      list: {
        height: 'auto',

      },
      listContent: {
        paddingBottom: theme.values.bottomNavHeight + theme.spacing.value(1),
      },

    }
  }),
}
