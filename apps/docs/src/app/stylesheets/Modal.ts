import { mapVariants, ModalComposition, ModalStyles } from '@codeleap/common'

import { variantProvider } from '../theme'

const createModalStyle =
  variantProvider.createVariantFactory<ModalComposition>()
const defaultStyles = ModalStyles

export const AppModalStyles = {
  ...defaultStyles,
  default: createModalStyle((theme) => ({
    ...defaultStyles.default(theme),
    box: {
      ...defaultStyles.default(theme).box,
      backgroundColor: theme.colors.background,
    },
  })),
  appStatusIndicator: createModalStyle((theme) => ({
    ...defaultStyles.default(theme),
    box: {
      width: 80,
      height: 80,
      ...theme.presets.center,
      backgroundColor: 'white',
    },
  })),
  appStatusOverlay: createModalStyle((theme) => ({
    // ...defaultStyles.default(theme),
    wrapper: {
      ...theme.presets.center,
      ...theme.presets.whole,
      backgroundColor: 'transparent',
    },
    box: {
      ...theme.spacing.padding(0),
      backgroundColor: 'transparent',
      width: '100%',
    },
    overlay: {
      opacity: 0,
      backgroundColor: 'transparent',
    },
    'overlay:visible': {
      opacity: 1,
      backgroundColor: 'transparent',
    },
  })),
}
