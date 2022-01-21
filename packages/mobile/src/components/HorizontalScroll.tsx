import React, { ElementType } from 'react';
import { ViewProps } from '.';
import { View } from './View';

export function HorizontalScroll<T extends ElementType = 'div'>(props:ViewProps<T>) {
  const { children, style, ...otherProps } = props;

  return (
    <View {...otherProps} css={[styles.scroll, style]}>
      {children}
    </View>
  );
}

const styles = {
  scroll: {
    overflow: 'auto',
    '::-webkit-scrollbar': {
      display: 'none',
    },
    whiteSpace: 'nowrap',
  },
};

