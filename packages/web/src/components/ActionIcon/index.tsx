import React from 'react'
import { ComponentVariants, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Icon, IconProps } from '../Icon'
import { Touchable, TouchableProps } from '../Touchable'
import { View } from '../View'
import { ActionIconComposition, ActionIconPresets } from './styles'

export type ActionIconProps = {
    disabled?: boolean
    iconProps?: Partial<IconProps>
    icon?: IconProps['name']
    name?: IconProps['name']
    styles?: StylesOf<ActionIconComposition>
} & Omit<TouchableProps, 'styles' | 'variants'> & ComponentVariants<typeof ActionIconPresets>

export const ActionIcon:React.FC<ActionIconProps> = (props) => {
  const { icon, name, iconProps, onPress, variants, styles, children, disabled, ...touchableProps } = props
  
  const variantStyles = useDefaultComponentStyle<'u:ActionIcon', typeof ActionIconPresets>('u:ActionIcon', {
    variants, 
    styles
  })

  const isPressable = TypeGuards.isFunction(onPress) && !disabled

  const WrapperComponent: any = isPressable ? Touchable : View

  const handlePress = () => {
    if (!isPressable) return

    if (onPress) onPress?.()
  }
  
  return (
    <WrapperComponent 
      onPress={handlePress}
      css={[
        variantStyles.wrapper,
        disabled && variantStyles['wrapper:disabled'],
        isPressable && variantStyles['wrapper:cursor']
      ]}
      disabled={disabled}
      {...touchableProps}
    >
      <Icon 
        name={icon ?? name} 
        css={[
          variantStyles.icon,
          disabled && variantStyles['icon:disabled'],
        ]}
        {...iconProps}
      />
      {children}
    </WrapperComponent>
  )
}

export * from './styles'
