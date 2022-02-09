import React from 'react';
import {
  ComponentVariants,
  ContentViewStyles,
  useComponentStyle,
  ViewComposition,
} from '@codeleap/common';
import { ActivityIndicator } from '.';
import { ViewProps, View } from './View';
import { Text } from './Text';
import { StylesOf } from '../types/utility';

export type ContentViewProps = Omit<
  ViewProps<'div'>,
  'variants' | 'responsiveVariants'
> & {
  placeholderMsg: string;
  loading?: boolean;
  styles?: StylesOf<ViewComposition>;
} & ComponentVariants<typeof ContentViewStyles>;

const WrapContent = ({ children, ...props }: Partial<ContentViewProps>) => (
  <View {...props}>{children}</View>
);

export const ContentView: React.FC<ContentViewProps> = (rawProps) => {
  const {
    children,
    placeholderMsg,
    loading,
    variants,
    responsiveVariants,
    styles,
    ...props
  } = rawProps;

  const variantStyle = useComponentStyle('ContentView', {
    variants,
    responsiveVariants,
    styles,
  });

  if (loading) {
    return (
      <WrapContent {...props} css={{ ...variantStyle.wrapper }}>
        <ActivityIndicator css={variantStyle.loader} />
      </WrapContent>
    );
  }
  const hasChildren = Object.keys(children || {}).length > 0;
  if (hasChildren) {
    return (
      <WrapContent {...props} css={variantStyle.wrapper}>
        {children}
      </WrapContent>
    );
  }

  return (
    <WrapContent {...props} css={variantStyle.wrapper}>
      <Text text={placeholderMsg} css={variantStyle.placeholder} />
    </WrapContent>
  );
};
