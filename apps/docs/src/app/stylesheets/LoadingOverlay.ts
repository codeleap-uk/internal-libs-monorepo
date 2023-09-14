import { shadeColor } from "@codeleap/common"
import { LoadingOverlayComposition, LoadingOverlayPresets } from "@codeleap/web"
import { variantProvider } from ".."

const createIconStyle = variantProvider.createVariantFactory<LoadingOverlayComposition>()

export const AppLoadingOverlayStyles = {
  ...LoadingOverlayPresets,
  default: createIconStyle((theme) => ({
    wrapper: {
      backgroundColor: shadeColor(theme.colors["neutral3"], 0, 0.5  ),
        backdropFilter: "blur(5px)",
      position: "absolute",
      ...theme.presets.whole,
      zIndex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
      pointerEvents: "none",
    },
    "wrapper:visible": {
      opacity: 1,
      pointerEvents: "auto",
    },

  })),
 
}
