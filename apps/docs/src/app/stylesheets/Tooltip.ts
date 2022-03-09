import { optionalObject, TooltipComposition } from '@codeleap/common'
import { variantProvider, Theme } from '../theme'

const createTooltipStyle =
  variantProvider.createVariantFactory<TooltipComposition>()
const defaultStyles = variantProvider.getDefaultVariants('Tooltip')

export const AppTooltipStyles = {
  ...defaultStyles,

  default: createTooltipStyle((theme) => {
    const isLightTheme = theme.theme == 'light'
    return {
      ...defaultStyles.default,
      wrapper: {
        ...defaultStyles.default(theme).wrapper,

      },
      bubble: {
        ...defaultStyles.default(theme).bubble,
        ...theme.spacing.padding(0),
        ...theme.spacing.paddingVertical(1),
        ...optionalObject(isLightTheme, {
          boxShadow: `0 0 5px 2px ${theme.colors.black + '1'}`,
        }, {}),
        borderRadius: theme.borderRadius.medium,
      },
      arrow: {
        ...defaultStyles.default(theme).arrow,
      },
    }

  }),
  highlight: createTooltipStyle((theme) => ({
    bubble: {
      ...theme.border.primary(1),
    },
    arrow: {
      ...theme.border.primary(1),
    },
  })),
}
