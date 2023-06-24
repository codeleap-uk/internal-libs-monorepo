import React from 'react'
import { ComponentVariants, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Icon, IconProps } from '../Icon'
import { Touchable, TouchableProps } from '../Touchable'
import { View } from '../View'
import { ActionIconComposition, ActionIconParts, ActionIconPresets } from './styles'

export * from './styles'

export type ActionIconProps = Omit<TouchableProps, 'styles' | 'variants'> & {
  disabled?: boolean
  iconProps?: Partial<IconProps>
  icon?: IconProps['name']
  name?: IconProps['name']
  styles?: StylesOf<ActionIconComposition>
} & ComponentVariants<typeof ActionIconPresets>

const defaultProps: Partial<ActionIconProps> = {
  disabled: false,
}

export const ActionIcon:React.FC<ActionIconProps> = (props) => {
  const allProps = {
    ...ActionIcon.defaultProps,
    ...props,
  }

  const { 
    icon,
    name,
    iconProps,
    onPress,
    responsiveVariants = {},
    variants = [],
    styles = {},
    children,
    disabled,
    ...touchableProps 
  } = allProps
  
  const variantStyles = useDefaultComponentStyle<'u:ActionIcon', typeof ActionIconPresets>('u:ActionIcon', {
    responsiveVariants,
    variants, 
    styles
  })

  const isPressable = TypeGuards.isFunction(onPress) && !disabled

  const WrapperComponent: any = isPressable ? Touchable : View

  const handlePress = () => {
    if (!isPressable) return

    if (onPress) onPress?.()
  }

  const getStyles = (key: ActionIconParts) => ([
    variantStyles[key],
    disabled && variantStyles[`${key}:disabled`],
    isPressable && variantStyles[`${key}:pressable`]
  ])

  return (
    <WrapperComponent 
      onPress={handlePress}
      css={getStyles('touchableWrapper')}
      disabled={disabled}
      {...touchableProps}
    >
      <Icon
        name={icon ?? name}
        css={getStyles('icon')}
        {...iconProps}
      />
      {children}
    </WrapperComponent>
  )
}

ActionIcon.defaultProps = defaultProps
