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
        maxHeight: theme.values.height * 0.7,
        paddingBottom: (theme.values.bottomNavHeight ?? 0) + theme.spacing.value(1),
      },
      innerWrapperScroll: {
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
