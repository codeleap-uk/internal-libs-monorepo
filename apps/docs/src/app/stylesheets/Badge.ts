import { BadgeComposition, BadgePresets } from '@codeleap/web'
import { variantProvider } from '../theme'
import { assignTextStyle } from './Text'

const createBadgeStyle = variantProvider.createVariantFactory<BadgeComposition>()

const defaultStyles = BadgePresets

export const AppBadgeStyles = {
  ...defaultStyles,
  default: createBadgeStyle((theme) => ({
    wrapper: {
      ...theme.sized(2),
      ...theme.presets.absolute,
      top: theme.spacing.value(0),
      left: theme.spacing.value(0),
      backgroundColor: theme.colors.destructive2,
      borderRadius: theme.borderRadius.rounded,
    },
    innerWrapper: {
      ...theme.sized(2),
      ...theme.presets.center,
      borderRadius: theme.borderRadius.rounded,
    },
    count: {
      ...assignTextStyle('p5')(theme).text,
      ...theme.presets.textCenter,
      color: theme.colors.neutral1,
    },
  })),
  border: createBadgeStyle((theme) => ({
    wrapper: {
      ...theme.sized(2.5),
      backgroundColor: theme.colors.neutral1,
    },
    innerWrapper: {
      ...theme.sized(1.5),
      backgroundColor: theme.colors.destructive2,
    },
  })),
  'position:leftTop': createBadgeStyle((theme) => ({
    wrapper: {
      ...theme.presets.absolute,
      top: -theme.spacing.value(0.5),
      left: -theme.spacing.value(0.5),
      zIndex: 2,
    },
  })),
  'position:leftBottom': createBadgeStyle((theme) => ({
    wrapper: {
      ...theme.presets.absolute,
      bottom: -theme.spacing.value(0.5),
      left: -theme.spacing.value(0.5),
      zIndex: 2,
    },
  })),
  'position:rightTop': createBadgeStyle((theme) => ({
    wrapper: {
      ...theme.presets.absolute,
      top: -theme.spacing.value(0.5),
      right: -theme.spacing.value(0.5),
      zIndex: 2,
    },
  })),
  'position:rightBottom': createBadgeStyle((theme) => ({
    wrapper: {
      ...theme.presets.absolute,
      bottom: -theme.spacing.value(0.5),
      right: -theme.spacing.value(0.5),
      zIndex: 2,
    },
  })),
}
