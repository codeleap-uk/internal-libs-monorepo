import { TooltipComposition } from '@codeleap/common'
import { variantProvider } from '../theme'

const createTooltipStyle =
  variantProvider.createVariantFactory<TooltipComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Tooltip')

export const AppTooltipStyles = {
  ...defaultStyles,
  default: createTooltipStyle((theme) => ({
    ...defaultStyles.default,
    bubble: {
      ...defaultStyles.default.bubble,
      background: theme.colors.gray,

      borderRadius: theme.borderRadius.small,
    },
    arrow: {
      ...defaultStyles.default.arrow,
      background: theme.colors.gray,
    },
  })),
  highlight: createTooltipStyle((theme) => ({
    bubble: {
      ...theme.border.primary(1),
    },
    arrow: {
      ...theme.border.primary(1),
    },
  })),
}
