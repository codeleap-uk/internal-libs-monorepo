import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { TouchableComposition } from '../Touchable'

export type ActionIconParts = 'icon' | `touchable${Capitalize<TouchableComposition>}`
export type ActionIconStates = ':disabled' | ''
export type ActionIconComposition = `${ActionIconParts}${ActionIconStates}`
const createActionIconStyle = createDefaultVariantFactory<ActionIconComposition>()

const presets = includePresets((style) => createActionIconStyle(() => ({ touchableWrapper: style })))

export const ActionIconStyles = {
  ...presets,
  default: createActionIconStyle((theme) => {

    return {
      icon: {
        color: theme.colors.icon,
        ...theme.sized(5 * 0.6),

      },
      touchableWrapper: {
        ...theme.sized(5),
        borderRadius: theme.borderRadius.rounded,
        ...theme.presets.center,
      },
      'icon:disabled': {
        color: theme.colors.disabled,
      },

    }
  }),
  originalColor: createActionIconStyle(theme => ({
    icon: {
      color: 'auto',
    },
  })),
  small: createActionIconStyle((theme) => ({
    touchableWrapper: {
      ...theme.sized(3.5),

    },
    icon: {
      ...theme.sized(3.5 * 0.6),

    },
  })),
  large: createActionIconStyle((theme) => ({
    touchableWrapper: {
      ...theme.sized(6.5),

    },
    icon: {
      ...theme.sized(6.5 * 0.6),

    },
  })),
  primary: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.primary,

    },

  })),
  negative: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.negative,

    },

  })),
  positive: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.positive,

    },

  })),
  black: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.black,

    },

  })),
  white: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.white,

    },

  })),
  neutral: createActionIconStyle((theme) => ({
    icon: {
      color: theme.colors.neutral,
    },
  })),
}
