import { variantProvider } from '../theme'
import { ButtonComposition, ButtonPresets } from '@codeleap/web'
import { assignTextStyle } from './Text'

const createButtonStyle = variantProvider.createVariantFactory<ButtonComposition>()

export const AppButtonStyles = {
  ...ButtonPresets,
  default: createButtonStyle((theme) => ({
    wrapper: {
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      ...theme.presets.row,
      ...theme.presets.relative,
      backgroundColor: theme.colors.primary3,
      borderRadius: theme.borderRadius.small,
      transitionProperty: 'background, color, border, filter',
      transitionDuration: '0.2s',
      ...theme.presets.alignCenter,
      ...theme.presets.justifyCenter,
      width: 'auto',
      
      '&:hover': {
        backgroundColor: theme.colors.primary4,
      },
      ...theme.spacing.padding(1),
      ...theme.spacing.paddingHorizontal(2)
    },
    text: {
      textAlign: 'center',
      color: theme.colors.neutral10,
    },
    'text:disabled': {
      color: theme.colors.neutral5,
    },
    'loaderWrapper': {
      height: theme.values.iconSize[4],
      width: theme.values.iconSize[4],
    },
    icon: {
      color: theme.colors.neutral10,
      width: theme.values.iconSize[1],
      height: theme.values.iconSize[1],
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    leftIcon: {
      ...theme.spacing.marginRight('auto'),
    },
    rightIcon: {
      ...theme.spacing.marginLeft('auto'),
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.neutral2,

      cursor: 'not-allowed',

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
      },
      '&:active': {
        backgroundColor: theme.colors.neutral2,
      },
    },
  })),

  docItem: createButtonStyle((theme) => ({
    wrapper: {
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      ...theme.presets.row,
      ...theme.presets.relative,
      backgroundColor: theme.colors.background,
      borderRadius: 0,
      transitionProperty: 'background, color, border, filter',
      transitionDuration: '0.2s',
      ...theme.presets.alignCenter,
      ...theme.presets.justifyStart,
      width: '100%',
      ...theme.spacing.gap(1),

      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 40,
      paddingRight: 40,
      
      '&:hover': {
        backgroundColor: theme.colors.background,
      },
    },
    text: {
      width: '100%',
      textAlign: 'start',
      ...assignTextStyle('p2')(theme).text,
      color: theme.colors.neutral10,
      fontWeight: 800,
    },
  })),
  'docItem:selected': createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.primary1,
      
      '&:hover': {
        backgroundColor: theme.colors.primary1,
      },
    },
    text: {
      width: '100%',
      textAlign: 'start',
      ...assignTextStyle('p2')(theme).text,
      color: theme.colors.primary3,
    },
  })),
  'docItem:list': createButtonStyle((theme) => ({
    wrapper: {
      paddingLeft: 62,
    },
  })),

  hiddenIcon: createButtonStyle((theme) => ({
    icon: {
      opacity: 0,
    }
  })),

  'docNavAction': createButtonStyle((theme) => ({
    wrapper: {
      ...theme.presets.row,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.small,
      border: `1px solid ${theme.colors.primary3}`,
      ...theme.presets.justifySpaceBetween,
      width: '100%',
      ...theme.presets.flex,
      ...theme.spacing.gap(1),
      ...theme.spacing.padding(2),
      transitionProperty: 'background, color, border, filter, box-shadow',
      
      '&:hover': {
        backgroundColor: theme.colors.background,
        ...theme.effects.thin
      },
    },
    'wrapper:disabled': {
      border: `1px solid ${theme.colors.neutral2}`,
      backgroundColor: theme.colors.neutral2,

      '&:hover': {
        backgroundColor: theme.colors.neutral2,
        boxShadow: 'unset'
      },
    }
  })),
}
