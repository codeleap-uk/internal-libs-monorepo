import { createStyles } from '@codeleap/styles'
import { DrawerComposition } from '@codeleap/web'
import { StyleRegistry } from '../styles'

const createDrawerVariant = createStyles<DrawerComposition>

export const DrawerStyles = {
  default: createDrawerVariant((theme) => ({
    wrapper: {
      zIndex: 3000,
      position: 'fixed',
      ...theme.presets.whole,
    },
    body: {
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto',
    },
    overlay: {
      ...theme.presets.absolute,
      ...theme.presets.whole,
      backgroundColor: theme.colors.neutral10,
      zIndex: -1,
      minHeight: '100svh',
      transition: 'opacity 0.2s ease-in-out',
      animation: 'opacity 0.2s ease-in-out',
    },
    'overlay:visible': {
      opacity: 0.5,
    },
    'overlay:hidden': {
      opacity: 0,
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
    },
  })),
}

StyleRegistry.registerVariants('Drawer', DrawerStyles)
