/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react';
import {
  ComponentVariants,
  useComponentStyle,
  useStyle,
  ViewStyles,
} from '@codeleap/common';
import { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

export type ViewProps<T extends ElementType> = ComponentPropsWithRef<T> &
  ComponentVariants<typeof ViewStyles> & {
    component?: T;
    children?: ReactNode;
    css?: CSSObject;
    is?: string;
    not?: string;
    up?: string;
    down?: string;
  };

export const View = <T extends ElementType = 'div'>(
  viewProps: ViewProps<T>
) => {
  const {
    responsiveVariants = {},
    variants = [],
    component: Component = 'div',
    children,
    is,
    not,
    up,
    down,
    ...props
  } = viewProps;
  const variantStyles = useComponentStyle('View', {
    responsiveVariants,
    variants,
  });
  const { Theme } = useStyle();

  const shouldRenderToPlatform = Theme.hooks.shouldRenderToPlatform({
    is,
    not,
    up,
    down,
  });
  if (!shouldRenderToPlatform) return null;

  const platformMediaQuery = Theme.media.renderToPlatformQuery({
    is,
    not,
    up,
    down,
  });

  return (
    <Component css={[variantStyles.wrapper, platformMediaQuery]} {...props}>
      {children}
    </Component>
  );
};

// export const View = ViewCP as <
//   T extends ElementType = 'div',
// >(props:ViewProps<T>) => ReactElement
