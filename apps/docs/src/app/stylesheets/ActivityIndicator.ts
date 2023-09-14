import { ActivityIndicatorComposition, ActivityIndicatorPresets } from "@codeleap/web"
import { variantProvider } from "../theme"

const createActivityIndicatorStyle = variantProvider.createVariantFactory<ActivityIndicatorComposition>()



export const AppActivityIndicatorStyles = {
  ...ActivityIndicatorPresets,

  default: createActivityIndicatorStyle((theme) => ({
    wrapper: {
      height: theme.values.iconSize[6],
      width: theme.values.iconSize[6],
      zIndex: 99,
    },
  })),
  tiny: createActivityIndicatorStyle((theme) => ({
    wrapper: {
      height: theme.values.iconSize[2],
      width: theme.values.iconSize[2],
    },
  })),
  small: createActivityIndicatorStyle((theme) => ({
    wrapper: {
      height: theme.values.iconSize[4],
      width: theme.values.iconSize[4],
    },
  })),
  medium: createActivityIndicatorStyle((theme) => ({
    wrapper: {
      height: theme.values.iconSize[5],
      width: theme.values.iconSize[5],
    },
  })),
}
