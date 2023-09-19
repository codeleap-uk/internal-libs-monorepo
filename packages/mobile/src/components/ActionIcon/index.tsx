import { ComponentVariants, getNestedStylesByKey, useDefaultComponentStyle } from '@codeleap/common'
import React from 'react'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types'
import { Badge, BadgeComponentProps } from '../Badge'
import { Icon, IconProps } from '../Icon'
import { Touchable, TouchableProps } from '../Touchable'
import { ActionIconComposition, ActionIconPresets } from './styles'

/** ActionIcon */
export type ActionIconProps= {
    iconProps?: Partial<IconProps>
    /** prop */
    icon?: IconProps['name']
    /** prop */
    name?: IconProps['name']
    styles?: StylesOf<ActionIconComposition> | StylesOf<ActionIconComposition>[]
} & Omit<TouchableProps, 'styles' | 'variants'> & ComponentVariants<typeof ActionIconPresets> & BadgeComponentProps

export const ActionIcon = (props: ActionIconProps) => {
  const { name, icon, iconProps, variants, styles, children, badge = false, badgeProps = {}, ...touchableProps } = props
  const variantStyles = useDefaultComponentStyle<'u:ActionIcon', typeof ActionIconPresets>('u:ActionIcon', {
    variants, styles, transform: StyleSheet.flatten,
  })
  const touchableStyles = getNestedStylesByKey('touchable', variantStyles)

  const badgeStyles = getNestedStylesByKey('badge', variantStyles)

  return <Touchable styles={touchableStyles} {...touchableProps}>
    <Icon name={icon ?? name} style={
      [
        variantStyles.icon,
        touchableProps?.disabled && variantStyles['icon:disabled'],
      ]} {...iconProps}/>
    {children}

    <Badge badge={badge} style={badgeStyles} {...badgeProps} />
  </Touchable>
}

ActionIcon.defaultProps = {
  hitSlop: 10,
}

export * from './styles'
