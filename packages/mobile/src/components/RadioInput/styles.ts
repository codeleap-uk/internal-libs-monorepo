import {
  createDefaultVariantFactory,
  RadioInputStyles,
} from "@codeleap/common";
type RadioParts = "button" | "itemWrapper" | "text" | "buttonMark";

type RadioGroupParts = "label" | "wrapper" | "list";

export type MobileRadioInputComposition =
  | `${RadioParts}:checked`
  | RadioParts
  | RadioGroupParts;

const createRadioStyle =
  createDefaultVariantFactory<MobileRadioInputComposition>();

const defaultStyles = RadioInputStyles.default;

export const MobileRadioInputStyles = {
  ...RadioInputStyles,
  default: createRadioStyle((theme) => {
    const style = defaultStyles(theme);

    const itemHeight = theme.typography.baseFontSize * 1.2;
    const markHeight = itemHeight / 2;
    const translateX = -(markHeight / 2);
    const translateY = -(markHeight / 2);
    return {
      ...style,
      itemWrapper: {
        ...style.itemWrapper,
      },
      button: {
        height: itemHeight,
        width: itemHeight,
        ...theme.border.primary(1),
        borderRadius: theme.borderRadius.large,

        position: "relative",
        ...theme.spacing.marginRight(1),
      },
      buttonMark: {
        backgroundColor: theme.colors.primary,
        position: "absolute",
        left: "50%",
        top: "50%",
        height: markHeight,
        width: markHeight,

        transform: [{ translateX }, { translateY }],
        borderRadius: theme.borderRadius.large,
        opacity: 0,
      },
      "buttonMark:checked": {
        opacity: 1,
      },
    };
  }),
  square: createRadioStyle(() => ({
    buttonMark: {
      borderRadius: 0,
    },
    button: {
      borderRadius: 0,
    },
  })),
};
