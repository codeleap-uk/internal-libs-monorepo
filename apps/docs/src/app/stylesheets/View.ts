import { ViewComposition, ViewPresets } from '@codeleap/web'
import { variantProvider } from '../theme'

const createViewStyle = variantProvider.createVariantFactory<ViewComposition>()

export const AppViewStyles = {
  ...ViewPresets,
  default: createViewStyle((t) => ({
    wrapper: {
      display: 'flex',
    },
  })),
  separator: createViewStyle((theme) => ({
    wrapper: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.neutral3,

      [theme.media.down('mid')]: {
        height: 1,
      },
    },
  })),
}
