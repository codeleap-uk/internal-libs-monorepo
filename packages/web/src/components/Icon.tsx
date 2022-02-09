import {
  ComponentVariants,
  IconPlaceholder,
  useComponentStyle,
  useStyle,
  IconStyles,
} from "@codeleap/common";

export type IconProps = {
  name: IconPlaceholder;
  style?: {
    color: string;
    size?: string | number;
    width?: string | number;
    height?: string | number;
  };
} & ComponentVariants<typeof IconStyles>;

export const Icon: React.FC<IconProps> = ({
  name,
  style,
  responsiveVariants,
  variants,
}) => {
  const { Theme, logger } = useStyle();
  if (!name) return null;
  const Component = Theme?.icons?.[name];

  const variantStyles = useComponentStyle("Icon", {
    variants,
    responsiveVariants,
  });
  if (!Component) {
    logger.warn(
      "Icon",
      `No icon found in theme for name "${name}"`,
      "Component"
    );
    return null;
  }
  return <Component style={{ ...variantStyles.icon, ...style }} />;
};
