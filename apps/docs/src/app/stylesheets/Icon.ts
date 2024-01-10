import { IconComposition, IconPresets } from "@codeleap/web"
import { variantProvider } from ".."

const createIconStyle = variantProvider.createVariantFactory<IconComposition>()

export const AppIconStyles = {
  ...IconPresets,
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
      color: theme.colors['primary-3'],
      fill: theme.colors['primary-3'],
    },
  })),
  negative: createIconStyle((theme) => ({
    icon: {
      color: theme.colors['neutral-1'],
      fill: theme.colors['neutral-1'],
    },
  })),
  positive: createIconStyle((theme) => ({
    icon: {
      color: theme.colors['neutral-10'],
      fill: theme.colors['neutral-10'],
    },
  })),

  huge: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(8),
    },
  })),
  large: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(6),
    },
  })),
  largeish: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(4),
    },
  })),
  medium: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(3),
    },
  })),
  small: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(2.5),
    },
  })),
  smaller: createIconStyle((theme) => ({
    icon: {
      ...theme.sized(2),
    },
  })),

}
