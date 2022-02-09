import { includePresets } from '../../presets';
import { createDefaultVariantFactory } from '../createDefaults';

export type DrawerComposition =
  | 'wrapper'
  | 'overlay'
  | 'header'
  | 'footer'
  | 'headerCloseButton'
  | 'body'
  | 'box';

const createDrawerStyle = createDefaultVariantFactory<DrawerComposition>();

const presets = includePresets((styles) => createDrawerStyle(() => ({ wrapper: styles })),
);

export const DrawerStyles = {
  ...presets,
  default: createDrawerStyle((theme) => ({
    wrapper: {
      zIndex: 3000,
      elevation: 3000,

      position: theme.IsBrowser ? 'fixed' : 'absolute',
      ...theme.presets.whole,
      visibility: 'hidden',
      display: 'flex',
      ...theme.presets.row,
    },
    body: {
      ...theme.spacing.padding(1),
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto',
    },
    overlay: {
      backgroundColor: theme.colors.black,
      height: theme.IsBrowser ? '100vh' : '100%',
      elevation: 1,

      zIndex: 1,
    },
    box: {
      backgroundColor: theme.colors.white,

      elevation: 2,
      zIndex: 2,
      flexDirection: 'column',
    },
    header: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      ...theme.presets.justifySpaceBetween,
      ...theme.spacing.padding(1),
    },
    footer: {
      backgroundColor: 'transparent',
      ...theme.spacing.padding(1),
    },
  })),
};
