import * as React from 'react'
import {
  ComponentVariants,
  IconPlaceholder,
  IconStyles,
  useDefaultComponentStyle,
  useCodeleapContext,
  arePropsEqual,
} from '@codeleap/common'
import { StyleSheet } from 'react-native'
import { View } from './View'

export type IconProps = {
  name: IconPlaceholder
  style?: any
  color?: string
  variants?: ComponentVariants<typeof IconStyles>['variants']
  renderEmptySpace?: boolean
  size?: number
}

export const IconComponent: React.FC<IconProps> = ({ name, style, variants, renderEmptySpace, ...otherProps }) => {
  const { Theme, logger } = useCodeleapContext()

  const variantStyles = useDefaultComponentStyle('Icon', {
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

function areEqual(prevProps, nextProps) {
  const check = ['name', 'style', 'variants', 'renderEmptySpace']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Icon = React.memo(IconComponent, areEqual)

