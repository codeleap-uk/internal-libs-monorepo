import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'
import { shadeColor } from '../../../utils'
import { optionalObject } from '../../../utils'
import { ActivityIndicatorComposition } from '.'

export type ButtonStates = 'disabled'
export type ButtonParts = 'text' | 'inner' |'wrapper' | 'icon' | 'leftIcon' | 'rightIcon' | 'loader' | `loader${Capitalize<ActivityIndicatorComposition>}` |
  'badgeText' | 'badgeWrapper'
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

    loaderFrontCircle: {
      borderTopColor: theme.colors.white,
    },
    'wrapper:disabled': {
      backgroundColor: theme.colors.disabled,
      opacity: 0.9,
      cursor: 'auto',
      ...optionalObject(theme.IsBrowser, {
        '&:hover': {
          backgroundColor: theme.colors.disabled,
        },
      }, {}),

    },
    badgeWrapper: {
      backgroundColor: theme.colors.negative,
      position: 'absolute',
      ...theme.spacing.padding(2.5),
    },
    badgeText: {
      color: theme.colors.white,
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
