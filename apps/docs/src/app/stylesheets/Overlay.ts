import { OverlayComposition, OverlayPresets } from '@codeleap/web'
import { variantProvider } from '../theme'

const createOverlayStyle = variantProvider.createVariantFactory<OverlayComposition>()

export const AppOverlayStyles = {
  ...OverlayPresets,
  default: createOverlayStyle((theme) => ({
    wrapper: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      position: theme.IsBrowser ? 'fixed' : 'absolute',
      backgroundColor: theme.colors.neutral10,
      visibility: 'hidden',
      opacity: 0,
    },
    'wrapper:visible': {
      opacity: 0.5,
       visibility: 'visible',
       zIndex: 2,
    },
    closeButton: {
      marginLeft: 'auto',
    },
    header: {
      ...theme.presets.row,
      ...theme.presets.justifySpaceBetween,
    },
  })),
}
