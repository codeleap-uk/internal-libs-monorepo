import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type IconComposition = 'icon'

const createIconStyle = createDefaultVariantFactory<IconComposition>()

const presets = includePresets((styles) => createIconStyle(() => ({ icon: styles })))

export const IconStyles = {
  ...presets,
  default: createIconStyle((theme) => ({
    icon: {
      color: theme.colors.icon,
    },
  })),
  white: createIconStyle((theme) => ({
    icon: {
      color: theme.colors.white,
    },
  })),

  primary: createIconStyle((theme) => ({
    icon: {
      color: theme.colors.primary,
    },
  })),
  negative: createIconStyle((theme) => ({
    icon: {
      color: theme.colors.negative,
    },
  })),
  positive: createIconStyle((theme) => ({
    icon: {
      color: theme.colors.positive,
    },
  })),
  small: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(1),
    },
  })),
  medium: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(2),
    },
  })),
  large: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(3),
    },
  })),
}
