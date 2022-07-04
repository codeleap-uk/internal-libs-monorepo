import { CenterWrapperComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createCenterWrapperStyle =
  variantProvider.createVariantFactory<CenterWrapperComposition>()
const defaultStyles = variantProvider.getDefaultVariants('CenterWrapper')

export const AppCenterWrapperStyles = {
  ...defaultStyles,
  default: createCenterWrapperStyle((theme) => ({
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      width: '100%',
    },
    innerWrapper: {
      flex: 1,
      display: 'flex',
      width: '80%',
      maxWidth: 1280,
      [theme.media.down('xxlarge')]: {
        paddingLeft: theme.spacing.value(8),
        paddingRight: theme.spacing.value(8),
      },
      // [theme.media.down('large')]: {
      //   paddingLeft: theme.spacing.value(12),
      //   paddingRight: theme.spacing.value(12),
      // },
      // [theme.media.down('largeish')]: {
      //   paddingLeft: theme.spacing.value(8),
      //   paddingRight: theme.spacing.value(8),
      // },
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
