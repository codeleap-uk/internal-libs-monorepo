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
      height: 2,
      backgroundColor: theme.colors.neutral5,

      [theme.media.down('mid')]: {
        height: 4,
      },
    },
  })),
}
