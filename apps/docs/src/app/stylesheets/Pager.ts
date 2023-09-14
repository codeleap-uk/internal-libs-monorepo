import { PagerComposition, PagerPresets } from "@codeleap/web";
import { variantProvider } from "..";

const createPagerStyle =
  variantProvider.createVariantFactory<PagerComposition>();

const DOT_SIZE = 8;

export const AppPagerStyles = {
  ...PagerPresets,
  default: createPagerStyle((theme) => ({
    wrapper: {
      ...theme.presets.fullWidth,
      ...theme.presets.column,
    },
    footerWrapper: {
      ...theme.presets.column,
    },
    dots: {
      ...theme.presets.fullWidth,
      ...theme.presets.row,
      gap: theme.spacing.value(1),
      ...theme.presets.justifyCenter,
    },
    dot: {
      height: DOT_SIZE,
      width: DOT_SIZE,
      cursor: "pointer",
      borderRadius: theme.borderRadius.rounded,
      backgroundColor: theme.colors.neutral3,
    },
    "dot:selected": {
      height: DOT_SIZE,
      width: DOT_SIZE,
      backgroundColor: theme.colors.primary3,
      cursor: "pointer",
      borderRadius: theme.borderRadius.rounded,
    },
    "dot:disabled": {
      cursor: "auto",
    },
  })),
};
