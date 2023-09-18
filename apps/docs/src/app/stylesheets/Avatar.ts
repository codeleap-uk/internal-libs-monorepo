import { includePresets, shadeColor } from '@codeleap/common'
import { variantProvider } from '../theme'
import { assignTextStyle } from './Text'

export type AvatarComposition =
'wrapper' | 'image' | 'initials' | 'descriptionOverlay' |
 'description' | 'icon' | 'badgeIconWrapper' | 'badgeIcon' | 'touchable'

const createAvatarStyle = variantProvider.createVariantFactory<AvatarComposition>()
const presets = includePresets((style) => createAvatarStyle(() => ({ wrapper: style })))

export const AvatarStyles = {
  ...presets,
  default: createAvatarStyle((theme) => ({
    wrapper: {
      ...theme.presets.relative,
      height: theme.values.itemHeight.default,
      width: theme.values.itemHeight.default,
      cursor: 'pointer',
    },
    initials: {
      ...assignTextStyle('p2')(theme).text,
      color: theme.colors.neutral1,
      textWrap: 'nowrap',
    },
    image: {
      borderRadius: theme.borderRadius.rounded,
      height: theme.values.itemHeight.default,
      width: theme.values.itemHeight.default,
      objectFit: 'cover',
    },
    badgeIconWrapper: {
      ...theme.presets.absolute,
      ...theme.presets.center,
      backgroundColor: theme.colors.neutral1,
      top: '50%',
      left: '50%',
      width: theme.values.iconSize[4],
      height: theme.values.iconSize[4],
      borderRadius: theme.borderRadius.rounded,
      ...theme.effects.light,
    },
    badgeIcon: {
      width: theme.values.iconSize[1],
      height: theme.values.iconSize[1],
      color: theme.colors.primary3,
      ...theme.presets.center,
    },
    icon: {
      width: theme.values.iconSize[2],
      height: theme.values.iconSize[2],
    },
    touchable: {
      ...theme.presets.fullWidth,
      ...theme.presets.fullHeight,
      ...theme.presets.center,
      backgroundColor: theme.colors.primary3,
      borderRadius: theme.borderRadius.rounded,
    },
    descriptionOverlay: {
      ...theme.presets.absolute,
      ...theme.presets.center,
      bottom: theme.spacing.value(0),
      left: theme.spacing.value(0),
      right: theme.spacing.value(0),
      backgroundColor: shadeColor(theme.colors.neutral10, 0, 0.2),
      borderRadius: theme.borderRadius.rounded,
    },
    description: {
      ...assignTextStyle('p3')(theme).text,
      color: theme.colors.neutral1,
    },
  })),
  round: createAvatarStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
  tiny: createAvatarStyle((theme) => ({
    wrapper: {
      height: theme.values.itemHeight.tiny,
      width: theme.values.itemHeight.tiny,
    },
    image: {
      height: theme.values.itemHeight.tiny,
      width: theme.values.itemHeight.tiny,
    },
    initials: {
      ...assignTextStyle('p5')(theme).text,
    },
  })),
  small: createAvatarStyle(theme => ({
    wrapper: {
      height: theme.values.itemHeight.small,
      width: theme.values.itemHeight.small,
    },
    image: {
      height: theme.values.itemHeight.small,
      width: theme.values.itemHeight.small,
    },
  })),
  medium: createAvatarStyle(theme => ({
    wrapper: {
      height: theme.values.itemHeight.default,
      width: theme.values.itemHeight.default,
    },
  })),
  large: createAvatarStyle(theme => ({
    wrapper: {
      height: theme.values.itemHeight.default * 2,
      width: theme.values.itemHeight.default * 2,
    },
    initials: {
      ...assignTextStyle('h3')(theme).text,
      color: theme.colors.neutral1,
      textWrap: 'nowrap',
    },
    image: {
      height: theme.values.itemHeight.default * 2,
      width: theme.values.itemHeight.default * 2,
    },
  })),
}
