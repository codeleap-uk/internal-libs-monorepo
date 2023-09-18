import { SwitchComposition, SwitchPresets } from '@codeleap/web'
import { variantProvider } from '../theme'

const createSwitchStyle = variantProvider.createVariantFactory<SwitchComposition>()

const defaultStyles = SwitchPresets

export const AppSwitchStyles = {
  ...defaultStyles,
  default: createSwitchStyle((theme) => {

    const height = 28
    const width = height * 1.8
    const innerSpacing = theme.spacing.value(0.5)
    const thumbSize = height - innerSpacing * 2

    const thumbTranslateX = width - thumbSize - (innerSpacing * 2)

    return {
      track: {
        height,
        width: width,
        borderRadius: theme.borderRadius.rounded,
        ...theme.presets.row,
        ...theme.presets.alignCenter,
        padding: innerSpacing,
        cursor: 'pointer',
      },
      thumb: {
        height: thumbSize,
        width: thumbSize,
        borderRadius: theme.borderRadius.rounded,
      },
      'thumb:transition': {},
      'track:transition': {},
      'track:on': {
        backgroundColor: theme.colors.primary3,
      },
      'track:disabled': {
        cursor: 'not-allowed',
      },
      'track:off': {
        backgroundColor: theme.colors.neutral5,
      },
      'track:disabled-on': {
        backgroundColor: theme.colors.primary1,
      },
      'track:disabled-off': {
        backgroundColor: theme.colors.neutral3,
      },
      'thumb:off': {
        backgroundColor: theme.colors.neutral1,
        translateX: 0,
      },
      'thumb:on': {
        backgroundColor: theme.colors.neutral1,
        translateX: thumbTranslateX,
      },
      wrapper: {
        ...theme.presets.row,
        ...theme.presets.alignCenter,
        gap: theme.spacing.value(2),
      },
      innerWrapper: {
        marginLeft: 'auto',
      },
      label: {
        marginBottom: theme.spacing.value(0),
      },
      description: {
        marginBottom: theme.spacing.value(0),
      },

    }
  }),
  left: createSwitchStyle((theme) => ({
    __props: {
      switchOnLeft: true,
    },
    innerWrapper: {
      marginRight: 'auto',
      marginLeft: theme.spacing.value(0),
    },
  })),
}
