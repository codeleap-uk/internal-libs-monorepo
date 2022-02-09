import * as React from 'react';
import {
  ComponentVariants,
  IconPlaceholder,
  IconStyles,
  useComponentStyle,
  useStyle,
} from '@codeleap/common';
import { StyleSheet } from 'react-native';

export type IconProps = {
  name: IconPlaceholder;
  style?: {
    color?: string;
    size?: string | number;
    width?: string | number;
    height?: string | number;
  };
  variants?: ComponentVariants<typeof IconStyles>['variants'];
};

export const Icon: React.FC<IconProps> = ({ name, style, variants }) => {
  const { Theme } = useStyle();

  if (!name) return null;

  const Component = Theme?.icons?.[name];

  const { logger } = useStyle();
  const variantStyles = useComponentStyle('Icon', {
    variants,
    styles: {
      icon: StyleSheet.flatten([style]),
    },
  });
  if (!Component) {
    logger.warn(
      'Icon',
      `No icon found in theme for name "${name}"`,
      'Component',
    );
    return null;
  }
  return <Component style={variantStyles.icon} />;
};
