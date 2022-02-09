import {
  ComponentVariants,
  OverlayComposition,
  OverlayStyles,
  SmartOmit,
  StylesOf,
  useComponentStyle,
} from "@codeleap/common";
import { Touchable, TouchableProps } from "./Touchable";
import { View, ViewProps } from "./View";

export type OverlayProps = {
  visible?: boolean;
  styles?: StylesOf<OverlayComposition>;
  onPress?: TouchableProps<"div">["onClick"];
} & ComponentVariants<typeof OverlayStyles> &
  Partial<SmartOmit<ViewProps<"div">, "variants" | "responsiveVariants">>;

export const Overlay: React.FC<OverlayProps> = (overlayProps) => {
  const { visible, responsiveVariants, variants, styles, ...props } =
    overlayProps;

  const variantStyles = useComponentStyle("Overlay", {
    variants,
    responsiveVariants,
    styles,
  });

  const Component = props.onClick || props.onPress ? Touchable : View;

  return (
    <Component
      css={{
        ...variantStyles.wrapper,
        transition: "opacity 0.2s ease",
        ...(visible ? variantStyles["wrapper:visible"] : {}),
      }}
      {...props}
    />
  );
};
