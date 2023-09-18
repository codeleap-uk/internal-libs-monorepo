import { variantProvider } from '../theme'
import { includePresets } from '@codeleap/common'
import { ButtonComposition, CollapseComposition } from '@codeleap/web'
import { assignTextStyle } from './Text'

export type NavigationComposition =
  'section' |
  `collapse${Capitalize<CollapseComposition>}` |
  `title${Capitalize<ButtonComposition>}` |
  `item${Capitalize<ButtonComposition>}` |
  'titleWrapper:collapsible' |
  'titleText:collapsible' |
  `collapseWrapper:collapsible` |
  'itemWrapper:focused' |
  'itemText:focused' |
  'itemIcon:focused' |
  'group'

const createNavigationStyle = variantProvider.createVariantFactory<NavigationComposition>()

const presets = includePresets((s) => createNavigationStyle(() => ({ section: s })))

export const NavigationStyles = {
  ...presets,
  default: createNavigationStyle((theme) => ({
    section: {
      ...theme.presets.column,
    },
    'collapseWrapper': {
      ...theme.presets.column,
      ...theme.presets.fullWidth,
    },
    'titleWrapper': {
      backgroundColor: 'transparent',
      cursor: 'default',
      transition: 'all .2s ease',
      ...theme.spacing.marginBottom(1),

      '&:hover': {
        backgroundColor: theme.colors.neutral1,
      },
    },
    'titleWrapper:collapsible': {
      cursor: 'pointer',

      '&:hover': {
        background: theme.colors.neutral2,
      },
    },
    'titleIcon': {
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    },
    'itemWrapper': {
      backgroundColor: theme.colors.neutral2,
      borderRadius: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral3,
      borderBottomStyle: 'solid',
      ...theme.spacing.padding(1.5),

      '&:hover': {
        backgroundColor: theme.colors.neutral3,
      },

      '&:last-of-type': {
        borderBottomWidth: 0,
      },
    }
  })),
  list: createNavigationStyle(theme => ({
    'section': {
      alignItems: 'flex-start',

      [theme.media.up('mid')]: {
        padding: theme.spacing.value(0),
        margin: theme.spacing.value(0),
      },

      [theme.media.down('mid')]: {
        ...theme.presets.fullWidth,
        flex: 1,
      }
    },
    'collapseWrapper': {
      borderRadius: theme.borderRadius.small,

      [theme.media.down('mid')]: {
        ...theme.presets.fullWidth,
        ...theme.presets.row,
      }
    },
    'group': {
      borderRadius: theme.borderRadius.small,
      overflow: 'hidden',
      ...theme.presets.column,

      [theme.media.down('mid')]: {
        ...theme.presets.fullWidth,
        ...theme.presets.row,
        
      }
    },
    'collapseWrapper:collapsible': {
      [theme.media.down('mid')]: {
        ...theme.presets.fullWidth,
        ...theme.presets.column,
      }
    },
    'titleText': {
      ...assignTextStyle('p2')(theme).text,
    },
    'itemWrapper': {
      backgroundColor: theme.colors.neutral2,
      borderRadius: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral3,
      borderBottomStyle: 'solid',
      ...theme.spacing.padding(2.5),
      textDecoration: 'none',

      '&:hover': {
        backgroundColor: theme.colors.neutral3,
      },

      [theme.media.down('mid')]: {
        flex: 1,
        borderWidth: 0,
      }
    },
    'itemWrapper:focused': {
      background: theme.colors.neutral3,

      '&:hover': {
        backgroundColor: theme.colors['neutral4'],
      },
    },
  })),
  'lastItem:collapsible': createNavigationStyle(theme => ({
    'itemWrapper': {
      borderBottomRightRadius: theme.borderRadius.small,
      borderBottomLeftRadius: theme.borderRadius.small,
    },
  })),
  menu: createNavigationStyle(theme => ({
    'section': {
      ...theme.presets.alignStart,
      ...theme.presets.justifySpaceBetween,

      [theme.media.up('mid')]: {
        borderRadius: theme.borderRadius.small,
        padding: theme.spacing.value(0),
        margin: theme.spacing.value(0),
      },

      [theme.media.down('mid')]: {
        ...theme.presets.fullWidth,
        flex: 1,
      }
    },
    'collapseWrapper': {
      borderRadius: theme.borderRadius.small,

      [theme.media.down('mid')]: {
        ...theme.presets.fullWidth,
        ...theme.presets.row,
        ...theme.border.neutral2({ 'directions': ['bottom'], 'width': 1 }),
      }
    },
    'collapseWrapper:collapsible': {
      [theme.media.up('mid')]: {
        ...theme.effects.light,
        borderRadius: theme.borderRadius.small,
      },

      [theme.media.down('mid')]: {
        ...theme.effects.light,
        ...theme.presets.column,
      }
    },
    'group': {
      borderRadius: theme.borderRadius.small,
      
      overflow: 'hidden',
      ...theme.presets.column,

      [theme.media.up('mid')]: {
        ...theme.effects.light,
      },

      [theme.media.down('mid')]: {
        ...theme.presets.fullWidth,
        borderRadius: 0,
        ...theme.presets.row,
        ...theme.border.neutral2({ 'directions': ['bottom'], 'width': 1 }),
      }
    },
    'titleWrapper': {
      ...theme.spacing.marginTop(2),
      ...theme.presets.fullWidth,
    },
    'titleText': {
      ...assignTextStyle('p2')(theme).text,
    },
    'titleText:collapsible': {
      textAlign: 'start',
    },
    'itemWrapper': {
      backgroundColor: theme.colors.neutral1,
      borderRadius: 0,
      ...theme.border.primary3({ 'directions': ['bottom'], 'width': 0 }),
      ...theme.spacing.padding(2.5),
      textDecoration: 'none',
      ...theme.spacing.gap(2),
      
      '&:hover': {
        backgroundColor: theme.colors.neutral1,
        filter: 'brightness(95%)'
      },

      '&:active': {
        backgroundColor: theme.colors.primary1,
      },

      [theme.media.down('mid')]: {
        flex: 1,
      }
    },
    'itemWrapper:focused': {
      [theme.media.down('mid')]: {
        flex: 1,
      }
    },
    'itemText': {
      ...theme.presets.fullWidth,
      textAlign: 'start',
    },
    'itemText:focused': {
      color: theme.colors.primary3,
    },
    'itemIcon': {
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    },
    'itemIcon:focused': {
      color: theme.colors.primary3,
    },
  })),
}
