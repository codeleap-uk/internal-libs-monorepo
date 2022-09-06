import { createDefaultVariantFactory } from '@codeleap/common'
import { ModalComposition, ModalStyles } from '../Modal'

export type DrawerComposition = ModalComposition
const createDrawerStyle = createDefaultVariantFactory<DrawerComposition>()

export const DrawerStyles = {
  ...ModalStyles,
  default: createDrawerStyle((theme) => {
    const defaultStyle = ModalStyles.default(theme)

    return {
      ...defaultStyle,
      box: {
        width: '100%',
        paddingBottom: 0,
        paddingTop: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        maxHeight: '100%',

      },
      innerWrapper: {
        ...theme.presets.justifyEnd,

      },

      'box:hidden': {
        translateY: theme.values.height,
        opacity: 1,
        scale: 1,
      },
      'box:visible': {
        translateY: 0,
        scale: 1,
        opacity: 1,
      },
      'box:transition': {
        translateY: theme.values.transitions.modal,
      },
    }
  }),
}
