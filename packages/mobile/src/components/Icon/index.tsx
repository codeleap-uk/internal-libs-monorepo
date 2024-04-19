import React from 'react'
import { arePropsEqual, TypeGuards } from '@codeleap/common'
import { Badge } from '../Badge'
import { View } from '../View'
import { IconProps } from './types'
import { themeStore, getNestedStylesByKey } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

export * from './styles'
export * from './types'

export const IconComponent = (props: IconProps) => {
  const {
    name,
    style,
    badge = false,
    badgeProps = {},
    wrapperProps = {},
    source,
    ...otherProps
  } = props

  // @ts-expect-error
  const icons = themeStore(store => (store.current?.icons ?? {}))

  const variantStyles = MobileStyleRegistry.current.styleFor(IconComponent.styleRegistryName, style)

  const Component = icons?.[name]

  if (!name && !source) {
    return null
  }

  if (!Component) {
    return null
  }

  if (badge || TypeGuards.isNumber(badge)) {
    const badgeStyles = getNestedStylesByKey('badge', variantStyles)

    const sized = {
      // @ts-expect-error
      height: variantStyles.icon?.size || variantStyles.icon?.height || props?.size,
      // @ts-expect-error
      width: variantStyles.icon?.size || variantStyles.icon?.width || props?.size,
    }

    const wrapperStyle = [
      sized,
      (variantStyles.iconBadgeWrapper ?? {}),
    ]

    return <View {...wrapperProps} style={wrapperStyle}>
      <Component {...otherProps} style={variantStyles.icon} source={source} />
      <Badge style={badgeStyles} badge={badge} {...badgeProps} />
    </View>
  }

  return <Component {...otherProps} style={variantStyles.icon} source={source} />
}

IconComponent.styleRegistryName = 'Icon'
IconComponent.elements = ['icon', 'iconBadgeWrapper', 'badge']
IconComponent.rootElement = 'icon'

MobileStyleRegistry.registerComponent(IconComponent)

function areEqual(prevProps, nextProps) {
  const check = ['name', 'style', 'variants', 'renderEmptySpace', 'badgeProps', 'badge']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Icon = React.memo(IconComponent, areEqual) as unknown as typeof IconComponent
