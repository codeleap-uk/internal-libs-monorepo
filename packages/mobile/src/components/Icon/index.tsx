import React from 'react'
import { arePropsEqual, TypeGuards } from '@codeleap/common'
import { Badge } from '../Badge'
import { View } from '../View'
import { IconProps } from './types'
import { useNestedStylesByKey, AnyRecord, StyledComponentProps, IJSX, useTheme, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

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
  const icons = useTheme(store => store.current?.icons)

  const styles = useStylesFor(Icon.styleRegistryName, style)

  const Component = icons?.[name]

  if (!name && !source) {
    return null
  }

  if (!Component) {
    return null
  }

  if (badge || TypeGuards.isNumber(badge)) {
    const badgeStyles = useNestedStylesByKey('badge', styles)

    const sized = {
      // @ts-expect-error
      height: styles.icon?.size || styles.icon?.height || props?.size,
      // @ts-expect-error
      width: styles.icon?.size || styles.icon?.width || props?.size,
    }

    const wrapperStyle = [
      sized,
      (styles.iconBadgeWrapper ?? {}),
    ]

    return <View {...wrapperProps} style={wrapperStyle}>
      <Component {...otherProps} style={styles.icon} source={source} />
      <Badge style={badgeStyles} badge={badge} {...badgeProps} />
    </View>
  }

  return <Component {...otherProps} style={styles.icon} source={source} />
}

function areEqual(prevProps, nextProps) {
  const check = ['name', 'style', 'renderEmptySpace', 'badgeProps', 'badge']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Icon = React.memo(IconComponent, areEqual) as StyledComponentWithProps<IconProps>

Icon.styleRegistryName = 'Icon'
Icon.elements = ['icon', 'iconBadgeWrapper', 'badge']
Icon.rootElement = 'icon'

Icon.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return IconComponent as (props: StyledComponentProps<IconProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(Icon)
