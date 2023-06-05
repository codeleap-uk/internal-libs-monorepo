import { ComponentVariants, getNestedStylesByKey, useDefaultComponentStyle } from '@codeleap/common'
import React from 'react'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types'
import { Icon, IconProps } from '../Icon'
import { Touchable, TouchableProps } from '../Touchable'
import { ActionIconComposition, ActionIconPresets } from './styles'

export type ActionIconProps= {
    iconProps?: Partial<IconProps>
    icon?: IconProps['name']
    name?: IconProps['name']
    styles?: StylesOf<ActionIconComposition> | StylesOf<ActionIconComposition>[]
} & Omit<TouchableProps, 'styles' | 'variants'> & ComponentVariants<typeof ActionIconPresets>

export const ActionIcon:React.FC<ActionIconProps> = (props) => {
  const { name, icon, iconProps, variants, styles, children, debugName, ...touchableProps } = props
  
  const variantStyles = useDefaultComponentStyle<'u:ActionIcon', typeof ActionIconPresets>('u:ActionIcon', {
    variants, 
    styles, 
    transform: StyleSheet.flatten,
  })
  
  const touchableStyles = getNestedStylesByKey('touchable', variantStyles)

  const badgeStyles = getNestedStylesByKey('badge', variantStyles)

  return (
    <Touchable debugName={debugName} styles={touchableStyles} badgeStyles={badgeStyles} {...touchableProps}>
      <Icon 
        name={icon ?? name} 
        style={[
          variantStyles.icon,
          touchableProps?.disabled && variantStyles['icon:disabled'],
        ]}
        {...iconProps}
      />
      {children}
    </Touchable>
  )
}

export * from './styles'
