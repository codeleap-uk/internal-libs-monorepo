import { ComponentVariants, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { ComponentCommonProps, StylesOf } from '../../types'
import { Icon, IconProps } from '../Icon'
import { Touchable, TouchableProps } from '../Touchable'
import { View } from '../View'
import { ActionIconComposition, ActionIconParts, ActionIconPresets } from './styles'

export * from './styles'

/** ActionIcon */
export type ActionIconProps = Omit<TouchableProps, 'styles' | 'variants'> & ComponentCommonProps & {
  iconProps?: Partial<IconProps>
  icon?: IconProps['name']
  name?: IconProps['name']

  styles?: StylesOf<ActionIconComposition>
} & ComponentVariants<typeof ActionIconPresets>

const defaultProps: Partial<ActionIconProps> = {
  disabled: false,
}

export const ActionIcon = (props: ActionIconProps) => {
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
    debugName,
    ...touchableProps 
  } = allProps
  
  const variantStyles = useDefaultComponentStyle<'u:ActionIcon', typeof ActionIconPresets>('u:ActionIcon', {
    responsiveVariants,
    variants, 
    styles,
    rootElement: 'touchableWrapper'
  })

  const isPressable = TypeGuards.isFunction(onPress) && !disabled

  const WrapperComponent: any = isPressable ? Touchable : View

  const handlePress = () => {
    if (!isPressable) return

    if (onPress) onPress?.()
  }

  const getStyles = (key: ActionIconParts) => ({
    ...variantStyles[key],
    ...(disabled ? variantStyles[`${key}:disabled`] : {}),
    ...(isPressable ? variantStyles[`${key}:pressable`] : {})
  })

  return (
    <WrapperComponent
      css={getStyles('touchableWrapper')}
      disabled={disabled}
      debugName={debugName}
      {
        ...(isPressable && {
          onPress: handlePress,
        })
      }
      {...touchableProps}
    >
      <Icon
        debugName={debugName}
        name={icon ?? name}
        style={getStyles('icon')}
        {...iconProps}
      />
      {children}
    </WrapperComponent>
  )
}

ActionIcon.defaultProps = defaultProps
