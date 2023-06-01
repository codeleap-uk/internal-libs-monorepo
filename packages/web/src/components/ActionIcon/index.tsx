/** @jsx jsx */
import { jsx } from '@emotion/react'
import { ComponentVariants,  PropsOf,  TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import React from 'react'

import { StylesOf, HTMLProps } from '../../types'
import { Icon, IconProps } from '../Icon'
import { Touchable, TouchableProps } from '../Touchable'
import { View } from '../View'
import { ActionIconComposition, ActionIconPresets } from './styles'

export type ActionIconProps= {
    iconProps?: Partial<IconProps>
    icon?: IconProps['name']
    name?: IconProps['name']
    action?: () => void
    styles?: StylesOf<ActionIconComposition>
} & Omit<PropsOf<typeof Touchable>, 'styles' | 'variants'> & ComponentVariants<typeof ActionIconPresets>

export const ActionIcon = (props:ActionIconProps) => {
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
    // @ts-ignore
    <WrapperComponent 
      style={variantStyles.wrapper}
      css={[
        variantStyles.wrapper,
        disabled && variantStyles['wrapper:disabled'],
        isPressable && variantStyles['wrapper:cursor']
      ]}
      disabled={disabled}
      {
        ...(isPressable && {
          onPress: handlePress
        })
      }
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
