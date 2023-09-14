import { DrawerPresets, DrawerComposition } from '@codeleap/web'
import { variantProvider } from '../theme'

const createDrawerStyle = variantProvider.createVariantFactory<DrawerComposition>()

export const AppDrawerStyles = {
  ...DrawerPresets,
  default: createDrawerStyle((theme) => ({
    wrapper: {
      zIndex: 3000,
      elevation: 3000,
      position: 'fixed',
      ...theme.presets.whole,
      visibility: 'hidden',
      display: 'flex',
      ...theme.presets.row,
    },
    body: {
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto',
    },
    overlay: {
      backgroundColor: theme.colors.neutral10,
      height: '100vh',
      elevation: 1,
      zIndex: 1,
    },
    box: {
      backgroundColor: theme.colors.neutral1,
      ...theme.spacing.padding(2),
      elevation: 2,
      zIndex: 2,
      flexDirection: 'column',
      height: '100lvh',
      paddingBottom: 'calc(100lvh - 100svh)',
    },
    header: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.primary3,
      ...theme.presets.justifySpaceBetween,
      ...theme.spacing.marginBottom(2),
    },
    footer: {
      backgroundColor: 'transparent',
      ...theme.spacing.padding(1),
    },
    'closeButtonTouchableWrapper': {
      padding: theme.spacing.value(0),
      width: 'auto',
      height: 'auto',
      borderRadius: 0,
      background: theme.colors.transparent,
      ...theme.spacing.marginLeft('auto'),
    },
    closeButtonIcon: {
      color: theme.colors.primary3,
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    }
  })),
}
