import { assignTextStyle } from "./Text";
import { includePresets } from "../../presets";
import { createDefaultVariantFactory } from "../createDefaults";

export type SliderComposition =
  | "wrapper"
  | "handle"
  | "track"
  | "label"
  | "selectedTrack"
  | "inputContainer"
  | "tooltip"
  | "tooltip:visible"
  | "tooltip:hidden"
  | "trackLabels"
  | "mark"
  | "tooltipArrow"
  | "tooltipText";

const createSliderStyle = createDefaultVariantFactory<SliderComposition>();

const presets = includePresets((styles) =>
  createSliderStyle(() => ({ wrapper: styles }))
);

export const SliderStyles = {
  ...presets,
  default: createSliderStyle((theme) => ({
    wrapper: {},
    handle: {
      backgroundColor: theme.colors.primary,
    },
    selectedTrack: {
      backgroundColor: theme.colors.primary,
    },
    track: {
      backgroundColor: theme.colors.gray,
    },
    tooltip: {
      padding: theme.spacing.value(0.5),
      backgroundColor: theme.colors.primary,
      position: "relative",
      borderRadius: theme.borderRadius.small,
    },
    "tooltip:visible": {
      opacity: 1,
    },
    "tooltip:hidden": {
      opacity: 0,
    },
    mark: {
      position: "absolute",
      backgroundColor: theme.colors.primary,
      borderRadius: 29,
      height: 10,
      width: 10,
      top: -5,
    },
    trackLabels: {
      position: "absolute",
      top: 8,
      ...assignTextStyle("p3")(theme).text,
    },
    tooltipArrow: {
      height: 6,
      width: 6,
      position: "absolute",
      backgroundColor: theme.colors.primary,
      transform: [{ rotate: "45deg" }],
      bottom: -3,
      left: "50%",
    },
    tooltipText: {
      color: theme.colors.white,
      ...assignTextStyle("p3")(theme).text,
    },
  })),
};
