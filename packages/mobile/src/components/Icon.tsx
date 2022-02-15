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
type Style = {
  color?: string;
  size?: string | number;
  width?: string | number;
  height?: string | number;
}
export type IconProps = {
  name: IconPlaceholder
  style?: any
  color?: string
  variants?: ComponentVariants<typeof IconStyles>['variants']
  renderEmptySpace?: boolean
  size?: number
};

export const Icon: React.FC<IconProps> = ({ name, style, variants, renderEmptySpace, ...otherProps }) => {
  const { Theme } = useStyle()
  const variantStyles = useComponentStyle('Icon', {
    variants,
    transform: StyleSheet.flatten,
    styles: {
      icon: style,
    },
    rootElement: 'icon',
  })
 
  if (!name) {
    return renderEmptySpace ? <View style={variantStyles.icon}/> : null
  }

  const Component = Theme?.icons?.[name]

  const { logger } = useStyle()
  if (!Component) {
    logger.warn(
      `Icon: No icon found in theme for name "${name}".`,
      { props: { style, name, variants, variantStyles }},
      'Component',
    )
    return null
  }
  return <Component {...otherProps} style={variantStyles.icon} />
}
