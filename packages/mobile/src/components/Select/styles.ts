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
  'scrollContent' |
  `itemIcon${ItemStates}`

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
        ...theme.presets.row,
        ...theme.presets.justifySpaceBetween,
        ...theme.presets.alignCenter,
        ...theme.spacing.padding(1.4),
        height: 50,
      },
      'itemWrapper:selected': {
        backgroundColor: theme.colors.primary,
      },
      'itemText:selected': {
        color: theme.colors.white,

      },
      'itemIcon:selected': {
        color: theme.colors.white,
        ...theme.sized(3),
      },
      itemIcon: {
        width: 0,
        height: 0,
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
