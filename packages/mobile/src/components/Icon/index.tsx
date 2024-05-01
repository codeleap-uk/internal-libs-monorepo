import React from 'react'
import { arePropsEqual, TypeGuards } from '@codeleap/common'
import { Badge } from '../Badge'
import { View } from '../View'
import { IconProps } from './types'
import { themeStore, getNestedStylesByKey, AnyRecord, StyledComponentProps, IJSX, GenericStyledComponentAttributes } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { ComponentWithDefaultProps } from '../../types'

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

  const styles = MobileStyleRegistry.current.styleFor(Icon.styleRegistryName, style)

  const Component = icons?.[name]

  if (!name && !source) {
    return null
  }

  if (!Component) {
    return null
  }

  if (badge || TypeGuards.isNumber(badge)) {
    const badgeStyles = getNestedStylesByKey('badge', styles)

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
  const check = ['name', 'style', 'variants', 'renderEmptySpace', 'badgeProps', 'badge']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Icon = React.memo(IconComponent, areEqual) as unknown as ComponentWithDefaultProps<IconProps> & GenericStyledComponentAttributes<AnyRecord>

Icon.styleRegistryName = 'Icon'
Icon.elements = ['icon', 'iconBadgeWrapper', 'badge']
Icon.rootElement = 'icon'

Icon.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return IconComponent as (props: StyledComponentProps<IconProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(Icon)
