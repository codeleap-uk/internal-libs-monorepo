import { includePresets } from "../../presets";
import { createDefaultVariantFactory } from "../createDefaults";
import shadeColor from "../../../utils/shadeColor";
import { optionalObject } from "../../../utils";

export type ButtonStates = "disabled";
export type ButtonParts =
  | "text"
  | "inner"
  | "wrapper"
  | "icon"
  | "leftIcon"
  | "rightIcon"
  | "loader";
export type ButtonComposition = `${ButtonParts}:${ButtonStates}` | ButtonParts;

const createButtonStyle = createDefaultVariantFactory<ButtonComposition>();

const presets = includePresets((styles) =>
  createButtonStyle(() => ({ wrapper: styles }))
);

export const ButtonStyles = {
  ...presets,
  default: createButtonStyle((theme) => ({
    wrapper: {
      cursor: "pointer",
      border: "none",
      outline: "none",
      display: "flex",
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      ...theme.presets.alignCenter,
      ...theme.spacing.padding(1),
      ...(theme.IsBrowser
        ? {
            "&:hover": {
              backgroundColor: shadeColor(theme.colors.primary, -30),
            },
          }
        : {}),
    },
    text: {
      flex: 1,
      textAlign: "center",
    },
    loader: {
      ...theme.spacing.marginRight(1),
    },
    leftIcon: {
      ...theme.spacing.marginRight(1),
    },
    rightIcon: {
      ...theme.spacing.marginRight(1),
    },
    "wrapper:disabled": {
      opacity: 0.5,
    },
  })),
  negative: createButtonStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.negative,

      "&:hover": {
        backgroundColor: shadeColor(theme.colors.negative, -30),
      },
    },
  })),
  circle: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: 100,
      ...theme.spacing.padding(1),
    },
  })),
  pill: createButtonStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.medium,
      ...theme.spacing.paddingHorizontal(1),
      ...theme.spacing.paddingVertical(0.5),
    },
  })),
  icon: createButtonStyle((theme) => ({
    wrapper: {
      ...theme.spacing.padding(0),
      ...optionalObject(
        theme.IsBrowser,
        {
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
        {}
      ),
    },
    text: {
      flex: 1,
      textAlign: "center",
    },
    loader: {
      ...theme.spacing.margin(0),
    },
    icon: {
      ...theme.spacing.margin(0),
    },
    leftIcon: {
      ...theme.spacing.marginRight(0),
    },
    rightIcon: {
      ...theme.spacing.marginRight(0),
    },
  })),
};
