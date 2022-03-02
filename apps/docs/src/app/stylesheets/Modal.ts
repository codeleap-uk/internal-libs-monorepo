import { mapVariants, ModalComposition } from '@codeleap/common'
import { WebModalStyles } from '@codeleap/web'
import { variantProvider } from '../theme'

const createModalStyle =
  variantProvider.createVariantFactory<ModalComposition>()
const defaultStyles = WebModalStyles

export const AppModalStyles = {
  ...defaultStyles,
  default: createModalStyle((theme) => ({
    ...defaultStyles.default(theme),
    box: {
      ...defaultStyles.default(theme).box,
      padding: 0,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.medium,
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.spacing.padding(1),
      ...theme.spacing.paddingHorizontal(3),
      ...theme.border.primary({
        width: 1,
        directions: ['bottom'],
      }),
    },
    closeButton: {
      marginLeft: 'auto',
    },
    title: {
      ...defaultStyles.default(theme).title,
      marginLeft: 'auto',

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
  OSAlert: createModalStyle((theme) => ({
    ...defaultStyles.OSAlert(theme),
    box: {
      ...defaultStyles.OSAlert(theme).box,
      width: '80vw',
      maxWidth: '400px',
    },
    body: {
      ...defaultStyles.OSAlert(theme).body,
      flex: 1,
    },
  })),
}
