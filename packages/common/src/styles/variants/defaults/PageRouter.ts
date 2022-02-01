import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type MenuComposition = 
    'menuItem' |
    'wrapper' |
    'menuItem:mobile' |
    'menuItem:text' |
    'menuItem:text:mobile' |
    'menuItem:text:selected' |
    'sideMenu' |
    'topMenu' |
    'horizontalScroll' 
export type PageRouterComposition = 
    'content' |
    'wrapper' |
    'router' |
    MenuComposition
const createPageRouterStyle = createDefaultVariantFactory<PageRouterComposition>()

const presets = includePresets((styles) => createPageRouterStyle(() => ({ topMenu: styles, sideMenu: styles })))

export const PageRouterStyles = {
  ...presets,
  default: createPageRouterStyle((Theme) => ({
    wrapper: {
      width: '100%',
    },
    menuItem: {
      alignItems: 'center',
      padding: Theme.spacing.value(2.5),
      flexDirection: 'column',
      borderRadius: Theme.borderRadius.medium,
      borderWidth: 1,
      borderStyle: 'solid',
      // ...Theme.debug('red'),
      borderColor: 'transparent',
      width: Theme.spacing.value(5),
      height: Theme.spacing.value(5),
      margin: 2,
      '&:hover': {
        background: Theme.colors.gray,
      },
    },
    'menuItem:mobile': {
      display: 'flex',
      ...Theme.presets.center,
      flexDirection: 'column-reverse',
      justifyContent: 'space-between',
    },
    'menuItem:mobile:text': {
      color: Theme.colors.black,
      padding: Theme.spacing.value(1),
      textTransform: 'uppercase',
    },
    'menuItem:text': {
      fontWeight: '500',
      color: Theme.colors.primary,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    'menuItem:text:selected': {
      fontWeight: 'bold',
      color: Theme.colors.gray,
    },
      
    'sideMenu': {
      borderRadius: Theme.borderRadius.medium,
      boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.16)',
      marginRight: Theme.spacing.value(6),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      width: Theme.spacing.value(11),
      flexShrink: 0,
      flexGrow: 0,
      [Theme.media.down('xlarge')]: {
        marginRight: Theme.spacing.value(4),
      },
      [Theme.media.down('large')]: {
        marginRight: Theme.spacing.value(3),
        width: 90,
      },
    },
    'topMenu': {
      width: '100%',
      backgroundColor: Theme.colors.white,
      height: 80,
    },

    'horizontalScroll': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })),
}
