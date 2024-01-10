import { includePresets } from "@codeleap/common"
import { variantProvider } from ".."

export type CenterWrapperComposition = 'wrapper' | 'innerWrapper'

const createCenterWrapperStyle =
  variantProvider.createVariantFactory<CenterWrapperComposition>()

const presets = includePresets((styles) => createCenterWrapperStyle(() => ({ innerWrapper: styles })))

const MAX_WIDTH = 1280

export const CenterWrapperStyles = {
  ...presets,
  default: createCenterWrapperStyle((theme) => ({
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      width: '100%',
    },
    innerWrapper: {
      flex: 1,
      display: 'flex',
      width: '100%',
      maxWidth: MAX_WIDTH,

      [theme.media.down('xxlarge')]: {
        paddingLeft: theme.spacing.value(16),
        paddingRight: theme.spacing.value(16),
      },
      [theme.media.down('large')]: {
        paddingLeft: theme.spacing.value(12),
        paddingRight: theme.spacing.value(12),
      },
      [theme.media.down('largeish')]: {
        paddingLeft: theme.spacing.value(8),
        paddingRight: theme.spacing.value(8),
      },
      [theme.media.down('mid')]: {
        paddingLeft: theme.spacing.value(4),
        paddingRight: theme.spacing.value(4),
      },
      [theme.media.down('small')]: {
        paddingLeft: theme.spacing.value(2),
        paddingRight: theme.spacing.value(2),
      },
    },
  })),
}
