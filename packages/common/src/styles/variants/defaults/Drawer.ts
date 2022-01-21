import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type DrawerComposition = 'wrapper' | 'overlay' | 'header'| 'footer' | 'headerCloseButton' | 'body'|'box';

const createDrawerStyle = createDefaultVariantFactory<DrawerComposition>()

const presets = includePresets((styles) => createDrawerStyle(() => ({ wrapper: styles })))

export const DrawerStyles = {
  ...presets,
  default: createDrawerStyle((theme) =>  ({
    wrapper: {
        
      zIndex: 2,
  
      position: 'fixed',
      ...theme.presets.whole,
      visibility: 'hidden',
    },
    body: {
      ...theme.spacing.padding(1),
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto',
    },
    overlay: {
      background: theme.colors.black,
      height: '100vh',
    },
    box: {
      background: theme.colors.white,
     
       
      flexDirection: 'column',
    },
    header: {
      background: 'transparent',
      color: theme.colors.primary,
      ...theme.presets.justifySpaceBetween,
      ...theme.spacing.padding(1),
    },
    footer: {
      background: 'transparent',
      ...theme.spacing.padding(1),
    },
  })),
}

