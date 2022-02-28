import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'
import shadeColor from '../../../utils/shadeColor'
import { optionalObject } from '../../../utils'

export type ButtonStates = 'disabled'
export type ButtonParts = 'text' | 'inner' |'wrapper' | 'icon' | 'leftIcon' | 'rightIcon' | 'loader'
export type ButtonComposition = `${ButtonParts}:${ButtonStates}` | ButtonParts

const createButtonStyle = createDefaultVariantFactory<ButtonComposition>()

const presets = includePresets((styles) => createButtonStyle(() => ({ wrapper: styles })))

export const ButtonStyles = {
  ...presets,
  default: createButtonStyle((theme) => ({
    wrapper: {
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      ...theme.presets.alignCenter,
      ...(
        theme.IsBrowser ?
          {
            '&:hover': {
              backgroundColor: shadeColor(theme.colors.primary, -30),
            },

          }
          : {}
      ),
    },
    text: {
      flex: 1,
      textAlign: 'center',
    },
    loader: {
      height: 20,
      width: 20,
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.disabled,
      opacity: 0.9,
    },
  })),
  negative: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.negative,

      '&:hover': {
        backgroundColor: shadeColor(theme.colors.negative, -30),
      },
    },

  })),

  circle: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(1),
    },
  })),
  pill: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.medium,
      ...theme.spacing.paddingHorizontal(1),
      ...theme.spacing.paddingVertical(0.5),
    },
  })),
  icon: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: 'transparent',
      aspectRatio: 1,
      display: 'flex',
      ...theme.presets.center,
      ...theme.spacing.padding(0),
      ...optionalObject(theme.IsBrowser,
        { '&:hover': {
          backgroundColor: 'transparent',
        }}
        , {}),
    },
    text: {
      flex: 1,
      textAlign: 'center',
    },
    loader: {
      ...theme.spacing.margin(0),
    },
    icon: {
      ...theme.spacing.margin(0),
      ...theme.presets.center,
      height: null,
      width: null,
      color: theme.colors.icon,
    },
    leftIcon: {
      ...theme.spacing.marginRight(0),
    },
    rightIcon: {
      ...theme.spacing.marginRight(0),
    },
  })),
}
