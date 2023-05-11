import { ComponentVariants, getNestedStylesByKey, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import React from 'react'

import { StylesOf } from '../../types'
import { Icon, IconProps } from '../Icon'
import { Touchable, TouchableProps } from '../Touchable'
import { View } from '../View'
import { ActionIconComposition, ActionIconPresets } from './styles'

export type ActionIconProps= {
    iconProps?: Partial<IconProps>
    icon?: IconProps['name']
    name?: IconProps['name']
    styles?: StylesOf<ActionIconComposition>
} & Omit<TouchableProps, 'styles' | 'variants'> & ComponentVariants<typeof ActionIconPresets>

export const ActionIcon:React.FC<ActionIconProps> = (props) => {
  const { icon, name, iconProps, action, onPress, variants, styles, children, disabled, ...touchableProps } = props
  
  const variantStyles = useDefaultComponentStyle<'u:ActionIcon', typeof ActionIconPresets>('u:ActionIcon', {
    variants, 
    styles
  })

  const isPressable = (TypeGuards.isFunction(onPress) || TypeGuards.isFunction(action)) && !disabled

  const WrapperComponent = isPressable ? Touchable : View

  const handlePress = () => {
    if (!isPressable) return

    if (onPress) onPress?.()
    if (action) action?.()
  }
  
  return (
    <WrapperComponent 
      styles={{
        wrapper: variantStyles.wrapper,
      }}
      onPress={handlePress}
      css={[
        variantStyles.wrapper,
        touchableProps?.disabled && variantStyles['wrapper:disabled'],
        isPressable && variantStyles['wrapper:cursor']
      ]}
      disabled={disabled}
      {...touchableProps}
    >
      <Icon 
        name={icon ?? name} 
        css={[
          variantStyles.icon,
          touchableProps?.disabled && variantStyles['icon:disabled'],
        ]}
        {...iconProps}
      />
      {children}
    </WrapperComponent>
  )
}

export * from './styles'
