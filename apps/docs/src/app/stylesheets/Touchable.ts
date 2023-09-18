import { TouchableComposition, TouchablePresets } from "@codeleap/web"
import { variantProvider } from ".."

const createTouchableStyle = variantProvider.createVariantFactory<TouchableComposition>()

export const AppTouchableStyles = {
  ...TouchablePresets,
  default: createTouchableStyle((theme) => ({
    wrapper: {
      ...theme.presets.center,
      cursor: 'pointer',
      userSelect: 'none',
    },
    'wrapper:disabled': {
      cursor: 'default',
    }
  })),
}
