import { ActivityIndicatorComposition, getActivityIndicatorBaseStyles } from '@codeleap/common'
import { WebActivityIndicatorStyles } from '@codeleap/web'
import { variantProvider } from '../theme'

const createActivityIndicatorStyle =
  variantProvider.createVariantFactory<ActivityIndicatorComposition>()
const defaultStyles = WebActivityIndicatorStyles

export const AppActivityIndicatorStyles = {
  ...defaultStyles,
  
  small: createActivityIndicatorStyle((theme) => {
    const baseStyles = getActivityIndicatorBaseStyles(theme.values.buttons.large.height)

    return {
      ...baseStyles,
      backCircle: {
        ...baseStyles.backCircle,
        borderColor: theme.colors.primary,
      },
      frontCircle: {
        ...baseStyles.frontCircle,
        borderTopColor: theme.colors.primary,
      },
    }

  }),
  large: createActivityIndicatorStyle((theme) => {
    const baseStyles = getActivityIndicatorBaseStyles(theme.values.buttons.large.height)

    return {
      ...baseStyles,
      backCircle: {
        ...baseStyles.backCircle,
        borderColor: theme.colors.primary,
      },
      frontCircle: {
        ...baseStyles.frontCircle,
        borderTopColor: theme.colors.primary,
      },
    }

  }),
}
