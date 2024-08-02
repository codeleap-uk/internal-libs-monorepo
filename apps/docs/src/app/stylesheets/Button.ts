import { createStyles } from '@codeleap/styles'
import { ButtonComposition } from '@codeleap/web'
import { StyleRegistry } from '../styles'
import { customTextStyles } from './Text'

const createButtonVariant = createStyles<ButtonComposition>

export const ButtonStyles = {
  default: createButtonVariant((theme) => ({
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
      ...theme.spacing.paddingHorizontal(2),
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
    },
  })),
  docItem: createButtonVariant((theme) => ({
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

      paddingTop: theme.spacing.value(1),
      paddingBottom: theme.spacing.value(1),
      paddingLeft: theme.spacing.value(5),
      paddingRight: theme.spacing.value(5),
      
      '&:hover': {
        backgroundColor: theme.colors.background,
      },
    },
    text: {
      width: '100%',
      textAlign: 'start',
      ...customTextStyles('p2'),
      color: theme.colors.neutral10,
      fontWeight: 400,
    },
  })),
  'docItem:selected': createButtonVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.primary1,
      
      '&:hover': {
        backgroundColor: theme.colors.primary1,
      },
    },
    text: {
      width: '100%',
      textAlign: 'start',
      ...customTextStyles('p2'),
      color: theme.colors.primary3,
    },
  })),
  'docItem:list': createButtonVariant((theme) => ({
    wrapper: {
      paddingLeft: theme.spacing.value(5) + theme.spacing.value(2.8),
    },
  })),

  hiddenIcon: createButtonVariant((theme) => ({
    icon: {
      opacity: 0,
    }
  })),

  'docNavAction': createButtonVariant((theme) => ({
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

  docNavbar: createButtonVariant((theme) => ({
    wrapper: {
      ...theme.presets.row,
      backgroundColor: theme.colors.primary1,
      borderRadius: 0,
      borderBottom: `1px solid ${theme.colors.primary3}`,
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
    text: {
      width: '100%',
      ...customTextStyles('p3'),
      color: theme.colors.primary3,
    },
  })),
}

StyleRegistry.registerVariants('Button', ButtonStyles)
