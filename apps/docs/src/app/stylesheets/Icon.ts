import { createStyles } from '@codeleap/styles'
import { IconComposition } from '@codeleap/web'
import { StyleRegistry } from '../styles'

const createIconVariant = createStyles<IconComposition>

export const IconStyles = {
  default: createIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral10,
      width: theme.values.iconSize[4],
      height: theme.values.iconSize[4],
    },
  })),
  white: createIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral1,
    },
  })),
  primary: createIconVariant((theme) => ({
    icon: {
      color: theme.colors.primary3,
      fill: theme.colors.primary3,
    },
  })),
  negative: createIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral1,
      fill: theme.colors.neutral1,
    },
  })),
  positive: createIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral10,
      fill: theme.colors.neutral10,
    },
  })),

  huge: createIconVariant((theme) => ({
    icon: {
      ...theme.sized(8),
    },
  })),
  large: createIconVariant((theme) => ({
    icon: {
      ...theme.sized(6),
    },
  })),
  largeish: createIconVariant((theme) => ({
    icon: {
      ...theme.sized(4),
    },
  })),
  medium: createIconVariant((theme) => ({
    icon: {
      ...theme.sized(3),
    },
  })),
  small: createIconVariant((theme) => ({
    icon: {
      ...theme.sized(2.5),
    },
  })),
  smaller: createIconVariant((theme) => ({
    icon: {
      ...theme.sized(2),
    },
  })),
  'size:2': createIconVariant((theme) => ({
    icon: {
      width: theme.values.iconSize[2],
      height: theme.values.iconSize[2],
    },
  })),
  'size:3': createIconVariant((theme) => ({
    icon: {
      width: theme.values.iconSize[3],
      height: theme.values.iconSize[3],
    },
  })),
  'size:4': createIconVariant((theme) => ({
    icon: {
      width: theme.values.iconSize[4],
      height: theme.values.iconSize[4],
    },
  })),
  'primary3': createIconVariant((theme) => ({
    icon: {
      color: theme.colors.primary3,
    },
  })),
  'neutral10': createIconVariant((theme) => ({
    icon: {
      color: theme.colors.neutral10,
    },
  })),
}

StyleRegistry.registerVariants('Icon', IconStyles)
