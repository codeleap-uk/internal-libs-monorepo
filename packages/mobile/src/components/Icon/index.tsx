import * as React from 'react'
import {
  ComponentVariants,

  useDefaultComponentStyle,
  useCodeleapContext,
  arePropsEqual,
  IconPlaceholder,
  onUpdate,
  PropsOf,
  StylesOf,
  TypeGuards,
  getNestedStylesByKey,
} from '@codeleap/common'
import { StyleSheet } from 'react-native'
export * from './styles'

import {
  IconComposition,
  IconPresets,
} from './styles'
import { Badge, BadgeComponentProps } from '../Badge'
import { View } from '../View'

export type IconProps = {
  name: IconPlaceholder
  style?: any
  color?: string
  variants?: ComponentVariants<typeof IconPresets>['variants']
  wrapperProps?: Partial<PropsOf<typeof View>>
  size?: number
  styles?: StylesOf<IconComposition>
  source?: string
} & BadgeComponentProps

export const IconComponent = (props: IconProps) => {
  const {
    name,
    style,
    variants,
    badge = false,
    badgeProps = {},
    wrapperProps = {},
    styles = {},
    source,
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
  const Component = Theme?.icons?.[name] || (source && Theme.icons.RenderSource)

  onUpdate(() => {
    if (!Component && !!name) {
      logger.warn(
        `Icon: No icon found in theme for name "${name}".`,
        { props: { style, name, variants, variantStyles } },
        'Component',
      )
    } else if (!Component && !!source) {
      logger.warn('Icon: Cannot render source, no RenderSource component in Theme.icons', {
        source,
        props: { style, name, variants, variantStyles },
        Component,
      }, 'Component')
    }
  }, [name])

  if (!name && !source) {
    return null
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
      <Component {...otherProps} style={variantStyles.icon} source={source} />
      <Badge styles={badgeStyles} badge={badge} {...badgeProps} />
    </View>
  }

  return <Component {...otherProps} style={variantStyles.icon} source={source} />
}

function areEqual(prevProps, nextProps) {
  const check = ['name', 'style', 'variants', 'renderEmptySpace', 'badgeProps', 'badge']
  const res = arePropsEqual(prevProps, nextProps, { check })
  return res
}

export const Icon = React.memo(IconComponent, areEqual) as typeof IconComponent

