import * as React from 'react'
import {
  ComponentVariants,
  IconPlaceholder,
  IconStyles,
  useComponentStyle,
  useStyle,
} from '@codeleap/common'
import { StyleSheet } from 'react-native'
import { View } from './View'

export type IconProps = {
  name: IconPlaceholder;
  style?: {
    color?: string;
    size?: string | number;
    width?: string | number;
    height?: string | number;
  };
  size: number;
  variants?: ComponentVariants<typeof IconStyles>['variants'];
  renderEmptySpace?: boolean
};

export const Icon: React.FC<IconProps> = ({ name, style, variants, renderEmptySpace, ...otherProps }) => {
  const { Theme } = useStyle()
  const variantStyles = useComponentStyle('Icon', {
    variants,
    transform: StyleSheet.flatten,
    styles: {
      icon: style,
    },
  })
 
  if (!name) {
    return renderEmptySpace ? <View style={variantStyles.icon}/> : null
  }

  const Component = Theme?.icons?.[name]

  const { logger } = useStyle()
  if (!Component) {
    logger.warn(
      'Icon',
      `No icon found in theme for name "${name}"`,
      'Component',
    )
    return null
  }
  return <Component {...otherProps} style={variantStyles.icon} />
}
