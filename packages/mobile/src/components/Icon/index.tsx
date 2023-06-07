import * as React from 'react'
import { StyleSheet } from 'react-native'
import { IconComposition, IconPresets } from './styles'
import { Badge, BadgeProps } from '../Badge'
import { View } from '../View'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  useCodeleapContext,
  arePropsEqual,
  IconPlaceholder,
  onUpdate,
  PropsOf,
  StylesOf,
  getNestedStylesByKey,
  TypeGuards,
} from '@codeleap/common'

export * from './styles'

export type IconProps = {
  name: IconPlaceholder
  style?: any
  color?: string
  variants?: ComponentVariants<typeof IconPresets>['variants']
  size?: number
  badgeProps?: Partial<BadgeProps>
  badge?: BadgeProps['badge']
  wrapperProps?: Partial<PropsOf<typeof View>>
  styles?: StylesOf<IconComposition>
}

export const IconComponent: React.FC<IconProps> = (props) => {
  const { 
    name, 
    style, 
    variants, 
    badge = false, 
    badgeProps, 
    wrapperProps = {},
    styles = {},
    ...otherProps 
  } = props

  const { Theme, logger } = useCodeleapContext()

  const variantStyles = useDefaultComponentStyle<'u:Icon', typeof IconPresets>('u:Icon', {
    variants,
    transform: StyleSheet.flatten,
    styles: {
      icon: style,
      ...styles,
    },
    rootElement: 'icon',
  })

  const Component = Theme?.icons?.[name]

  onUpdate(() => {
    if (!Component && !!name) {
      logger.warn(
        `Icon: No icon found in theme for name "${name}".`,
        { props: { style, name, variants, variantStyles }},
        'Component',
      )
    }
  }, [name])

  if (!name) {
    return  null
  }

  if (!Component) {

    return null
  }

  if (badge || TypeGuards.isNumber(badge)) {
    const badgeStyles = getNestedStylesByKey('badge', variantStyles)

    const sized = {
      height: variantStyles.icon?.size || variantStyles.icon?.height || props?.size,
      width: variantStyles.icon?.size || variantStyles.icon?.width || props?.size,
    }
  
    const wrapperStyle = [
      sized,
      (variantStyles.iconBadgeWrapper ?? {}),
    ]

    return <View {...wrapperProps} style={wrapperStyle}>
      <Component {...otherProps} style={variantStyles.icon} />
      <Badge {...badgeProps} styles={badgeStyles} badge={badge} />
    </View>
  }
  
  return <Component {...otherProps} style={variantStyles.icon} />
}

function areEqual(prevProps, nextProps) {
  const check = ['name', 'style', 'variants', 'renderEmptySpace', 'badgeProps', 'badge']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Icon = React.memo(IconComponent, areEqual)
