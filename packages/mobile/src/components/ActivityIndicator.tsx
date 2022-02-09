import * as React from 'react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { ActivityIndicator as Indicator, StyleSheet } from 'react-native';
import {
  ActivityIndicatorComposition,
  ActivityIndicatorStyles,
  useComponentStyle,
  ComponentVariants,
  useStyle,
} from '@codeleap/common';
import { StylesOf } from '../types/utility';

export type ActivityIndicatorProps = ComponentPropsWithoutRef<
  typeof Indicator
> & {
  variants?: ComponentVariants<typeof ActivityIndicatorStyles>['variants'];
  styles?: StylesOf<ActivityIndicatorComposition>;
};

export const ActivityIndicator = forwardRef<Indicator, ActivityIndicatorProps>(
  (activityIndicatorProps, ref) => {
    const { variants = [], style, ...props } = activityIndicatorProps;

    const variantStyles = useComponentStyle('ActivityIndicator', {
      variants,
    });

    const { Theme } = useStyle();

    const styles = StyleSheet.flatten([variantStyles.wrapper, style]);
    const color = styles?.color || Theme.colors.gray;
    const size = styles?.height || styles?.width || 'large';
    return (
      <Indicator
        size={size}
        ref={ref}
        color={color}
        style={styles}
        {...props}
      />
    );
  },
);
