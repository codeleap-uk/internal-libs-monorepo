/** @jsx jsx */
import { jsx } from "@emotion/react";
import { standardizeVariants, useStyle } from "@codeleap/common";
import { ElementType } from "react";
import { TextProps } from "./Text";
import { scrollToElem } from "../lib/utils/pollyfils/scroll";
import { stopPropagation } from "../lib/utils/stopPropagation";
import { Text } from "./Text";

export type LinkProps<T extends ElementType> = TextProps<T> & {
  openNewTab?: boolean;
};

export const Link = <T extends ElementType = "a">(linkProps: LinkProps<T>) => {
  const { variants, to, openNewTab, component = "a", ...props } = linkProps;

  const isExternal = ["http", "tel", "mailto"].some((start) =>
    to.startsWith(start)
  );

  const Component = isExternal ? "a" : component;
  const { logger } = useStyle();
  function handleClick(event: React.MouseEvent) {
    logger.log("Link pressed", { to, text: linkProps.text }, "Component");
    if (to) {
      if (to.startsWith("#")) {
        event.preventDefault();
        stopPropagation(event);

        scrollToElem(to);
      }
      if (openNewTab) {
        window.open(to, "_blank");
      }
    }
  }

  const passedVariants = standardizeVariants(
    variants || []
  ) as TextProps<T>["variants"];

  const linkPropOverride = {
    [isExternal ? "href" : "to"]: to,
  };

  return (
    <Text
      component={Component}
      {...props}
      {...linkPropOverride}
      text={props.text}
      variants={[...passedVariants]}
      onClick={handleClick}
    />
  );
};
