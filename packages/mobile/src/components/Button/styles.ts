import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { ActivityIndicatorComposition } from '../ActivityIndicator'
import { TouchableStylesGen } from '../Touchable'

export type ButtonStates = 'disabled'
export type ButtonParts =
| 'text'
| 'inner'
| 'wrapper'
| 'icon'
| 'leftIcon'
| 'rightIcon'
| 'loader'
| `loader${Capitalize<ActivityIndicatorComposition>}`
| 'badgeText'
| 'badgeWrapper'

export type ButtonComposition = `${ButtonParts}:${ButtonStates}` | ButtonParts

export type ButtonStylesGen<TCSS = any> = StylesOf<ButtonComposition, TCSS> & {
  feedback?: TouchableStylesGen['feedback']
}

const createButtonStyle = createDefaultVariantFactory<ButtonComposition, ButtonStylesGen >()

const presets = includePresets((styles) => createButtonStyle(() => ({ wrapper: styles })))

export const ButtonStyles = {
  ...presets,
  default: createButtonStyle((theme) => ({
    wrapper: {

      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      ...theme.presets.justifyCenter,
      ...theme.presets.alignCenter,
      ...theme.spacing.paddingHorizontal(2.5),
    },
    text: {
      textAlign: 'center',
      // ...theme.spacing.marginHorizontal(2.5),
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

    },
    badgeWrapper: {
      backgroundColor: theme.colors.negative,
      position: 'absolute',
      ...theme.spacing.padding(2.5),
    },
    badgeText: {
      color: theme.colors.white,
    },

    leftIcon: {
      ...theme.sized(4),
      ...theme.spacing.marginRight('auto'),
      // ...theme.spacing.marginLeft(2.5),
    },
    rightIcon: {
      ...theme.spacing.marginLeft('auto'),
      // ...theme.spacing.marginRight(2.5),
      ...theme.sized(4),
    },

  })),
  negative: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.negative,

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
