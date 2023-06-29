/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'

import { ComponentVariants, PropsOf, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Icon, IconProps } from '../Icon'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { ActionIconComposition, ActionIconPresets } from './styles'

export type ActionIconProps = {
    iconProps?: Partial<IconProps>
    icon?: IconProps['name']
    name?: IconProps['name']
    action?: () => void
    styles?: StylesOf<ActionIconComposition>
} & Omit<PropsOf<typeof Touchable>, 'styles' | 'variants'> & ComponentVariants<typeof ActionIconPresets>

export const ActionIcon = (props:ActionIconProps) => {
  const { icon, name, iconProps, onPress, variants, styles, children, disabled, ...touchableProps } = props

  const variantStyles = useDefaultComponentStyle<'u:ActionIcon', typeof ActionIconPresets>('u:ActionIcon', {
    variants,
    styles,
  })

  const isPressable = TypeGuards.isFunction(onPress) && !disabled

  const WrapperComponent: any = isPressable ? Touchable : View

  const handlePress = () => {
    if (!isPressable) return

    if (onPress) onPress?.()
  }

  return (
    // @ts-ignore
    <WrapperComponent
      onPress={handlePress}
      css={[
        variantStyles.wrapper,
        disabled && variantStyles['wrapper:disabled'],
        isPressable && variantStyles['wrapper:cursor'],
      ]}
      disabled={disabled}
      {
        ...(isPressable && {
          onPress: handlePress,
        })
      }
      {...touchableProps}
    >
      <Icon
        name={icon ?? name}
        {...iconProps}
        // @ts-ignore
        css={[
          variantStyles.icon,
          disabled && variantStyles['icon:disabled'],
        ]}
      />
      {children}
    </WrapperComponent>
  )
}

export * from './styles'
